'use client'

import Link from 'next/link'
import { useDemoData } from '@/hooks/useDemoData'
import { getParticipantsByStudyId, getStudyById } from '@/lib/demoStore'
import { EmptyState, PageBackLink } from '@/components/ui/DemoUi'

export function StudyDetail({ studyId }: { studyId: string }) {
  const data = useDemoData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const study = getStudyById(data, studyId)

  if (!study) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <p className="text-red-600">Study not found.</p>
        <Link href="/studies" className="mt-4 text-blue-600 hover:underline">
          Back to Studies
        </Link>
      </div>
    )
  }

  const participants = getParticipantsByStudyId(data, study.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PageBackLink href="/studies" label="Back to Studies" />
          <div className="mt-4 flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{study.name}</h1>
              <p className="mt-1 text-sm text-gray-600">Study Code: {study.code}</p>
            </div>
          </div>

          {study.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700">{study.description}</p>
            </div>
          )}

          <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
              <p
                className={`text-2xl font-semibold ${
                  study.status === 'ACTIVE'
                    ? 'text-green-600'
                    : study.status === 'PAUSED'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {study.status}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Created</h3>
              <p className="text-2xl font-semibold text-gray-600">
                {new Date(study.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Participants</h3>
              <p className="text-2xl font-semibold text-gray-600">{participants.length}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Participants ({participants.length})
            </h2>
            {participants.length > 0 ? (
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {participant.participantCode}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Status: {participant.status}
                      </p>
                    </div>
                    <Link
                      href={`/admin/participants/${participant.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No participants yet"
                description="Participants enrolled in this study will appear here."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
