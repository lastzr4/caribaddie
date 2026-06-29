export default function MatchesPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Match</h1>
        <p className="text-xs text-gray-400 mt-0.5">Rakan aktiviti kamu</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <div className="w-24 h-24 rounded-full bg-[#EEEDFE] flex items-center justify-center text-4xl">
          💚
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">Tiada match lagi</p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Mula swipe di Discover dan cari buddy aktiviti kamu!
          </p>
        </div>
        <a href="/discover" className="bg-[#7F77DD] text-white text-sm font-semibold px-8 py-3 rounded-full mt-2">
          Mula Discover
        </a>
      </div>
    </div>
  );
}
