import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/app/generated/prisma/client';
import { notFound } from 'next/navigation';

export default async function ParticipantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [participant, setParticipant] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<Array<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadParticipant() {
      try {
        const data = await prisma.participant.findUnique({
          where: { id: params.id },
          include: {
            study: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            kits: true,
          },
        });

        if (!data) {
          notFound();
        }

        setParticipant(data);
      } catch (err) {
        console.error('Failed to load participant:', err);
        setError('Failed to load participant details');
      } finally {
        setLoading(false);
      }
    }

    loadParticipant();
  }, [params.id]);

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        const data = await prisma.auditLog.findMany({
          where: {
            targetType: 'PARTICIPANT',
            targetId: params.id,
          },
          include: {
            actor: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
            study: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        setAuditLogs(data);
      } catch (err) {
        console.error('Failed to load audit logs for participant:', err);
        // We don't set error for audit logs to not break the page
      }
    }

    loadAuditLogs();
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
        <Link href="/admin/participants" className="mt-4 text-blue-600 hover:underline">
          Go back to participants
        </Link>
      </div>
    );
  }

  if (!participant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {participant.firstName} {participant.lastName}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Participant Code: {participant.participantCode}
              </p>
            </div>
            <Link
              href="/admin/participants"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Participants
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Study Information
            </h2>
            <p className="text-gray-700">
              Study: {participant.study?.name} ({participant.study?.code})
            </p>
          </div>

          <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Status
              </h3>
              <p className={`text-2xl font-semibold ${
                participant.status === 'REGISTERED'
                  ? 'text-blue-600'
                  : participant.status === 'SCREENING'
                  ? 'text-yellow-600'
                  : participant.status === 'ENROLLED'
                  ? 'text-green-600'
                  : participant.status === 'KIT_SENT'
                  ? 'text-indigo-600'
                  : participant.status === 'KIT_ACTIVATED'
                  ? 'text-purple-600'
                  : participant.status === 'SAMPLE_RECEIVED'
                  ? 'text-pink-600'
                  : participant.status === 'COMPLETED'
                  ? 'text-teal-600'
                  : 'text-red-600'
              }`}>
                {participant.status}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Contact Information
              </h3>
              <p className="text-sm text-gray-600">
                Email: {participant.email}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {participant.phone || 'Not provided'}
              </p>
              <p className="text-sm text-gray-600">
                Date of Birth: {
                  participant.dateOfBirth
                    ? new Date(participant.dateOfBirth).toLocaleDateString()
                    : 'Not provided'
                }
              </p>
              <p className="text-sm text-gray-600">
                Address: {participant.address || 'Not provided'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Created
              </h3>
              <p className="text-2xl font-semibold text-gray-600">
                {new Date(participant.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Kits ({participant.kits.length})
            </h2>
            {participant.kits.length > 0 ? (
              <div className="space-y-4">
                {participant.kits.map((k) => (
                  <div key={k.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        Kit Code: {k.kitCode}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Status: {k.status}
                      </p>
                      {k.shippedAt && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          Shipped: {new Date(k.shippedAt).toLocaleDateString()}
                        </p>
                      )}
                      {k.receivedAt && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          Received: {new Date(k.receivedAt).toLocaleDateString()}
                        </p>
                      )}
                      {k.activatedAt && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          Activated: {new Date(k.activatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Link
                        href={`/admin/kits/${k.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        View Kit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No kits assigned to this participant.
              </p>
            )}
          </div>

          {auditLogs && auditLogs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Audit Logs
              </h2>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {log.action.replace(/_/g, ' ')}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          by {log.actor?.name || 'Unknown'} (
                            {log.actor?.role || 'Unknown'}
                          ){' '}
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        {log.study && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {log.study.code}
                          </span>
                        )}
                      </div>
                    </div>
                    {log.metadata && (
                      <div className="mt-2 text-sm text-gray-500">
                        <pre className="bg-gray-50 p-2 rounded">{JSON.stringify(log.metadata, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}