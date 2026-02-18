export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1F] to-[#22222A] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-[#0EA5E9]/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0EA5E9] animate-spin"></div>
        </div>
        <p className="text-cool-blue/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}
