import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function StudiesPage() {
  const [studies, setStudies] = useState<Array<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudies() {
      try {
        const data = await prisma.study.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { participants: true },
            },
          },
        });
        setStudies(data);
      } catch (err) {
        console.error('Failed to load studies:', err);
        setError('Failed to load studies');
      } finally {
        setLoading(false);
      }
    }

    loadStudies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <p className="text-red-600">{error}</p>
        <Link href="/admin" className="mt-4 text-blue-600 hover:underline">
          Go back to admin dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Studies
          </h1>
          <Link
            href="/admin/studies/create"
            className="mb-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Study
          </Link>
        </div>

        {studies && studies.length > 0 ? (
          <div className="space-y-6">
            {studies.map((study) => (
              <Link
                key={study.id}
                href={`/admin/studies/${study.id}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900">{study.name}</h2>
                  <p className="mt-1 text-sm text-gray-600 truncate">
                    {study.description || 'No description'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      Code: {study.code}
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                      Participants: {study._count.participants}
                    </span>
                    <span className={`px-2 py-0.5 ${
                      study.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : study.status === 'PAUSED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    } rounded text-xs`}>
                      {study.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    href={`/admin/studies/${study.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">
            No studies found. <Link href="/admin/studies/create" className="text-blue-600 hover:underline">Create one</Link>.
          </p>
        )}
      </div>
    </div>
  );
}