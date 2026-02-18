export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1F] to-[#22222A] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#22222A] to-[#1E1E27] border border-cool-blue/10 rounded-2xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-cool-blue/60 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 text-white font-bold rounded-xl hover:opacity-90 transition-all"
          style={{
            background: 'linear-gradient(to right, #0EA5E9, rgba(14, 165, 233, 0.8))',
            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
          }}
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
