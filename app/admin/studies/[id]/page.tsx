import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function StudyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [study, setStudy] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudy() {
      try {
        const data = await prisma.study.findUnique({
          where: { id: params.id },
          include: {
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            participants: {
              include: {
                kits: true,
              },
            },
          },
        });

        if (!data) {
          notFound();
        }

        setStudy(data);
      } catch (err) {
        console.error('Failed to load study:', err);
        setError('Failed to load study details');
      } finally {
        setLoading(false);
      }
    }

    loadStudy();
  }, [params.id]);

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
        <Link href="/admin/studies" className="mt-4 text-blue-600 hover:underline">
          Go back to studies
        </Link>
      </div>
    );
  }

  if (!study) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {study.name}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Study Code: {study.code}
              </p>
            </div>
            <Link
              href="/admin/studies"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Studies
            </Link>
          </div>

          {study.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700">{study.description}</p>
            </div>
          )}

          <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Status
              </h3>
              <p className={`text-2xl font-semibold ${
                study.status === 'ACTIVE'
                  ? 'text-green-600'
                  : study.status === 'PAUSED'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {study.status}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Created
              </h3>
              <p className="text-2xl font-semibold text-gray-600">
                {new Date(study.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Members
              </h3>
              <p className="text-2xl font-semibold text-gray-600">
                {study.members.length}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Participants ({study.participants.length})
            </h2>
            {study.participants.length > 0 ? (
              <div className="space-y-4">
                {study.participants.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {p.firstName} {p.lastName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {p.participantCode}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Status: {p.status}
                      </p>
                    </div>
                    <div className="text-right space-x-2">
                      <Link
                        href={`/admin/participants/${p.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      {p.kits.length > 0 && (
                        <Link
                          href={`/admin/kits/${p.kits[0].id}`}
                          className="text-sm font-medium text-green-600 hover:underline"
                        >
                          Kit
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No participants in this study yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}