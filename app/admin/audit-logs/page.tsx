import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/app/generated/prisma/client';

export default async function AuditLogsPage() {
  const [studies, setStudies] = useState<Array<any> | null>(null);
  const [auditLogs, setAuditLogs] = useState<Array<any> | null>(null);
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
    async function loadAuditLogs() {
      try {
        let data;
        if (selectedStudyId) {
          data = await prisma.auditLog.findMany({
            where: { studyId: selectedStudyId },
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
        } else {
          data = await prisma.auditLog.findMany({
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
        }
        setAuditLogs(data);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
        setError('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    }

    loadAuditLogs();
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
              Audit Logs
            </h1>
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

          {auditLogs && auditLogs.length > 0 ? (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {log.action.replace(/_/g, ' ')}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Target: {log.targetType} ({log.targetId})
                      </p>
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
                        >
                      </span>
                    )}
                  </div>
                  {log.metadata && (
                    <div className="mt-2 text-sm text-gray-500">
                      <pre className="bg-gray-50 p-2 rounded">{JSON.stringify(log.metadata, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">
              No audit logs found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}