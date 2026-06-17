'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalStudies: 0,
    screening: 0,
    enrolled: 0,
    kitSent: 0,
    sampleReceived: 0,
    completed: 0,
    withdrawn: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          totalParticipants,
          totalStudies,
          screening,
          enrolled,
          kitSent,
          sampleReceived,
          completed,
          withdrawn,
        ] = await Promise.all([
          prisma.participant.count(),
          prisma.study.count(),
          prisma.participant.count({ where: { status: 'SCREENING' } }),
          prisma.participant.count({ where: { status: 'ENROLLED' } }),
          prisma.participant.count({ where: { status: 'KIT_SENT' } }),
          prisma.participant.count({ where: { status: 'SAMPLE_RECEIVED' } }),
          prisma.participant.count({ where: { status: 'COMPLETED' } }),
          prisma.participant.count({ where: { status: 'WITHDRAWN' } }),
        ]);

        setStats({
          totalParticipants,
          totalStudies,
          screening,
          enrolled,
          kitSent,
          sampleReceived,
          completed,
          withdrawn,
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
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
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of clinical trial operations
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Studies */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Studies
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalStudies}
                </dd>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10m-9-5a2 2 0 012-2h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Total Participants */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Participants
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalParticipants}
                </dd>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Screening */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Screening
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.screening}
                </dd>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Enrolled
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.enrolled}
                </dd>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c0 1.105.895 2 2 2s2-.895 2-2-1.605-2-2-2-1.395.338-1.896.874-1.104 1.34.919 3.137.314 4.312a7.942 7.942 0 004.189 2.07A5.98 5.98 0 0022 16a6 6 0 01-9.514-.484A5.98 5.98 0 003 15.75a7.942 7.942 0 00-.314-1.896C3.395 8.338 5 7.657 6.605 7.222z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Kit Sent */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Kit Sent
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.kitSent}
                </dd>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 01-2 2v1a2 2 0 01-2-2v-1a2 2 0 012-2h2a2 2 0 012-2v-1a2 2 0 012-2v-1a2 2 0 012 2h2a2 2 0 012 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Received */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Sample Received
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.sampleReceived}
                </dd>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 012-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Completed
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.completed}
                </dd>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0012 2.944a11.955 11.955 0 00-8.516 6.064M12 20a8.006 8.006 0 004.429-1.177M12 20a8.006 8.006 0 01-4.429-1.177M12 10a6.006 6.006 0 004.429 1.177M12 10a6.006 6.006 0 01-4.429 1.177" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawn */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Withdrawn
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.withdrawn}
                </dd>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Links
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/studies"
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-between h-24 hover:shadow-md transition-shadow"
            >
              <div className="text-left w-full">
                <h3 className="font-medium text-gray-900">Studies</h3>
                <p className="text-sm text-gray-500 mt-1">View and manage studies</p>
              </div>
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000-4h5a2 2 0 000 4h-5zM9 13a2 2 0 012-2h5a2 2 0 010 4h-5a2 2 0 01-2-2z" />
                </svg>
              </div>
            </Link>
            <Link
              href="/admin/participants"
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-between h-24 hover:shadow-md transition-shadow"
            >
              <div className="text-left w-full">
                <h3 className="font-medium text-gray-900">Participants</h3>
                <p className="text-sm text-gray-500 mt-1">View and manage participants</p>
              </div>
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5a2 2 0 002-2V6a2 2 0 00-2-2h-1v16a2 2 0 002 2zM9 18V9l12-1" />
                </svg>
              </div>
            </Link>
            <Link
              href="/admin/audit-logs"
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-between h-24 hover:shadow-md transition-shadow"
            >
              <div className="text-left w-full">
                <h3 className="font-medium text-gray-900">Audit Logs</h3>
                <p className="text-sm text-gray-500 mt-1">View system audit trail</p>
              </div>
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h3m8 9v-9M8 7l4 4 8-8" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}