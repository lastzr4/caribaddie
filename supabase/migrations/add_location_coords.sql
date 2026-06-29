-- ============================================================
-- Migration: Add GPS coordinates + discovery RPC
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add lat/lng columns to profiles
alter table public.profiles
  add column if not exists lat double precision,
  add column if not exists lng double precision;

-- Index for fast geo filtering
create index if not exists profiles_coords_idx
  on public.profiles(lat, lng)
  where lat is not null and lng is not null;


-- 2. RPC: get_discover_profiles
--    Returns candidates for the discover feed.
--    Hybrid: uses Haversine distance when GPS available,
--    falls back to location_area matching.
create or replace function get_discover_profiles(
  p_user_id    uuid,
  p_activity_id uuid        default null,
  p_lat        double precision default null,
  p_lng        double precision default null,
  p_radius_km  double precision default null,
  p_limit      int          default 20
)
returns table (
  id             uuid,
  display_name   text,
  gender         text,
  preferred_gender text,
  bio            text,
  avatar_url     text,
  location_area  text,
  is_verified    boolean,
  lat            double precision,
  lng            double precision,
  distance_km    double precision
)
language plpgsql
security definer
as $$
declare
  v_gender           text;
  v_preferred_gender text;
  v_location_area    text;
begin
  -- Fetch current user's profile data
  select
    p.gender::text,
    p.preferred_gender::text,
    p.location_area
  into v_gender, v_preferred_gender, v_location_area
  from public.profiles p
  where p.id = p_user_id;

  return query
  select
    p.id,
    p.display_name,
    p.gender::text,
    p.preferred_gender::text,
    p.bio,
    p.avatar_url,
    p.location_area,
    p.is_verified,
    p.lat,
    p.lng,
    -- Haversine distance in km (null if either side has no coords)
    case
      when p_lat is not null
        and p_lng is not null
        and p.lat is not null
        and p.lng is not null
      then
        round((
          2 * 6371 * asin(sqrt(
            power(sin(radians((p.lat - p_lat) / 2)), 2) +
            cos(radians(p_lat)) * cos(radians(p.lat)) *
            power(sin(radians((p.lng - p_lng) / 2)), 2)
          ))
        )::numeric, 1)::double precision
      else null
    end as distance_km

  from public.profiles p

  where
    -- Exclude self
    p.id != p_user_id

    -- Must have a display_name (basic onboarding done)
    and p.display_name is not null

    -- Gender filter: I want candidates of my preferred gender
    and (
      v_preferred_gender = 'any'
      or p.gender::text = v_preferred_gender
    )

    -- Candidate also wants to see my gender
    and (
      p.preferred_gender::text = 'any'
      or p.preferred_gender::text = v_gender
      or v_gender is null
    )

    -- Not already swiped (for this activity, or any if no activity filter)
    and not exists (
      select 1 from public.swipes s
      where s.swiper_id = p_user_id
        and s.target_id = p.id
        and (p_activity_id is null or s.activity_id = p_activity_id)
    )

    -- Activity filter: candidate must want a buddy for this activity
    and (
      p_activity_id is null
      or exists (
        select 1 from public.user_activities ua
        where ua.user_id = p.id
          and ua.activity_id = p_activity_id
          and ua.is_active = true
      )
    )

    -- GPS radius filter (only applied when caller provides coords + radius)
    and (
      p_lat is null
      or p_lng is null
      or p_radius_km is null
      or p.lat is null
      or p.lng is null
      or (
        2 * 6371 * asin(sqrt(
          power(sin(radians((p.lat - p_lat) / 2)), 2) +
          cos(radians(p_lat)) * cos(radians(p.lat)) *
          power(sin(radians((p.lng - p_lng) / 2)), 2)
        ))
      ) <= p_radius_km
    )

    -- Fallback location filter: same area when no GPS radius active
    and (
      p_lat is not null          -- GPS mode active, skip area filter
      or p_radius_km is not null
      or v_location_area is null -- user hasn't set area yet, show everyone
      or p.location_area = v_location_area
      or p.location_area is null
    )

  order by
    -- GPS users first (sorted by distance), then non-GPS by recency
    case
      when p_lat is not null and p_lng is not null
        and p.lat is not null and p.lng is not null
      then
        2 * 6371 * asin(sqrt(
          power(sin(radians((p.lat - p_lat) / 2)), 2) +
          cos(radians(p_lat)) * cos(radians(p.lat)) *
          power(sin(radians((p.lng - p_lng) / 2)), 2)
        ))
      else 999999
    end asc,
    p.is_verified desc,
    p.created_at desc

  limit p_limit;
end;
$$;

-- Grant execute to authenticated users
grant execute on function get_discover_profiles to authenticated;
