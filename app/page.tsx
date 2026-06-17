import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Mini CTMS Demo
      </h1>
      <p className="text-lg text-gray-600 mb-2">
        Clinical Trial Participant Tracking
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Demo only — not production HIPAA compliant
      </p>
      <div className="flex gap-4">
        <Link
          href="/admin"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Admin Portal
        </Link>
        <Link
          href="/participant"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Participant Portal
        </Link>
      </div>
    </div>
  );
}