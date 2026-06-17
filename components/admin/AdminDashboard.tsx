'use client'

import Link from 'next/link'
import { useDemoData } from '@/hooks/useDemoData'
import { getDashboardStats } from '@/lib/demoStore'

export function AdminDashboard() {
  const data = useDemoData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const stats = getDashboardStats(data)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of clinical trial operations
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Studies</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalStudies}</dd>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Participants</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalParticipants}</dd>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Screening</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.screening}</dd>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Enrolled</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.enrolled}</dd>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Kit Sent</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.kitSent}</dd>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Sample Received</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.sampleReceived}</dd>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.completed}</dd>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Withdrawn</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.withdrawn}</dd>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/studies"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">Studies</h3>
              <p className="text-sm text-gray-500 mt-1">View and manage studies</p>
            </Link>
            <Link
              href="/admin/participants"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">Participants</h3>
              <p className="text-sm text-gray-500 mt-1">View and manage participants</p>
            </Link>
            <Link
              href="/admin/audit-logs"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">Audit Logs</h3>
              <p className="text-sm text-gray-500 mt-1">View system audit trail</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
