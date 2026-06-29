export default function ChatPage() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Chat</h1>
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-5xl">💬</span>
        <p className="font-medium text-gray-800">Tiada perbualan lagi</p>
        <p className="text-sm text-gray-500">
          Chat akan muncul selepas kamu match dengan buddy.
        </p>
      </div>
    </div>
  );
}
