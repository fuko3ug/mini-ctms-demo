'use client'

import Link from 'next/link'
import { useDemoData } from '@/hooks/useDemoData'
import { getParticipantsByStudyId } from '@/lib/demoStore'
import { EmptyState, PageBackLink } from '@/components/ui/DemoUi'

export function StudiesList() {
  const data = useDemoData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PageBackLink href="/admin" label="Back to Dashboard" />
          <div className="mt-4 flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Studies</h1>
            <Link
              href="/studies/new"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + New Study
            </Link>
          </div>

          {data.studies.length > 0 ? (
            <div className="space-y-6">
              {data.studies.map((study) => {
                const participantCount = getParticipantsByStudyId(data, study.id).length
                return (
                  <Link
                    key={study.id}
                    href={`/studies/${study.id}`}
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
                          Participants: {participantCount}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            study.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : study.status === 'PAUSED'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {study.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-blue-600 hover:underline">
                        View Details
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="No studies yet"
              description="Create your first study to start tracking participants and site activity."
              actionLabel="Create Study"
              actionHref="/studies/new"
            />
          )}
        </div>
      </div>
    </div>
  )
}
