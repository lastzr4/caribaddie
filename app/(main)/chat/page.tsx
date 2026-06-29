export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chat</h1>
        <p className="text-xs text-gray-400 mt-0.5">Perbualan dengan buddy kamu</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <div className="w-24 h-24 rounded-full bg-[#EEEDFE] flex items-center justify-center text-4xl">
          💬
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">Tiada perbualan</p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Chat akan muncul selepas kamu match dengan buddy aktiviti.
          </p>
        </div>
      </div>
    </div>
  );
}
