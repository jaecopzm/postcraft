export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
        <div className="text-6xl mb-4 text-primary font-black">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 text-white font-bold rounded-xl premium-gradient hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
