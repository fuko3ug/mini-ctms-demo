import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/app/generated/prisma/client';

export default async function ParticipantsPage() {
  const [studies, setStudies] = useState<Array<any> | null>(null);
  const [participants, setParticipants] = useState<Array<any> | null>(null);
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudies() {
      try {
        const data = await prisma.study.findMany({
          select: { id: true, name: true, code: true },
          orderBy: { name: 'asc' },
        });
        setStudies(data);
      } catch (err) {
        console.error('Failed to load studies for filter:', err);
        setError('Failed to load studies');
      }
    }

    loadStudies();
  }, []);

  useEffect(() => {
    async function loadParticipants() {
      try {
        let data;
        if (selectedStudyId) {
          data = await prisma.participant.findMany({
            where: { studyId: selectedStudyId },
            include: {
              study: {
                select: { name: true, code: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          });
        } else {
          data = await prisma.participant.findMany({
            include: {
              study: {
                select: { name: true, code: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          });
        }
        setParticipants(data);
      } catch (err) {
        console.error('Failed to load participants:', err);
        setError('Failed to load participants');
      } finally {
        setLoading(false);
      }
    }

    loadParticipants();
  }, [selectedStudyId]);

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Participants
            </h1>
            <Link
              href="/admin/participants/create"
              className="mb-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + New Participant
            </Link>
          </div>

          <div className="mb-6">
            <label htmlFor="study-filter" className="sr-only">
              Study Filter
            </label>
            <select
              id="study-filter"
              value={selectedStudyId ?? ''}
              onChange={(e) => setSelectedStudyId(e.target.value || null)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">All Studies</option>
              {studies &&
                studies.map((study) => (
                  <option key={study.id} value={study.id}>
                    {study.name} ({study.code})
                  </option>
                ))}
            </select>
          </div>

          {participants && participants.length > 0 ? (
            <div className="space-y-4">
              {participants.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/participants/${p.id}`}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">
                      {p.firstName} {p.lastName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 truncate">
                      {p.participantCode}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Study: {p.study?.name || 'Unknown'} ({p.study?.code || 'N/A'})
                    </p>
                    <p className="mt-1 text-sm">
                      <span className={`px-2 py-0.5 ${
                        p.status === 'REGISTERED'
                          ? 'bg-blue-100 text-blue-800'
                          : p.status === 'SCREENING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : p.status === 'ENROLLED'
                          ? 'bg-green-100 text-green-800'
                          : p.status === 'KIT_SENT'
                          ? 'bg-indigo-100 text-indigo-800'
                          : p.status === 'KIT_ACTIVATED'
                          ? 'bg-purple-100 text-purple-800'
                          : p.status === 'SAMPLE_RECEIVED'
                          ? 'bg-pink-100 text-pink-800'
                          : p.status === 'COMPLETED'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-red-100 text-red-800'
                      } rounded text-xs`}>
                        {p.status}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <Link
                      href={`/admin/participants/${p.id}`}
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
              No participants found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}