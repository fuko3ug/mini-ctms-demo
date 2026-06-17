'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useDemoData } from '@/hooks/useDemoData'
import { getStudyForParticipant } from '@/lib/demoStore'
import { StudyFilterSelect } from '@/components/StudyFilterSelect'
import { EmptyState, PageBackLink } from '@/components/ui/DemoUi'

export function ParticipantsList() {
  const data = useDemoData()
  const searchParams = useSearchParams()
  const selectedStudyId = searchParams.get('studyId')

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const studies = data.studies.map((study) => ({
    id: study.id,
    name: study.name,
    code: study.code,
  }))

  const participants = selectedStudyId
    ? data.participants.filter((participant) => participant.studyId === selectedStudyId)
    : data.participants

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PageBackLink href="/admin" label="Back to Dashboard" />
          <div className="mt-4 flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Participants</h1>
          </div>

          <div className="mb-6">
            <label htmlFor="study-filter" className="sr-only">
              Study Filter
            </label>
            <StudyFilterSelect
              studies={studies}
              selectedStudyId={selectedStudyId}
            />
          </div>

          {participants.length > 0 ? (
            <div className="space-y-4">
              {participants.map((participant) => {
                const study = getStudyForParticipant(data, participant)
                return (
                  <Link
                    key={participant.id}
                    href={`/admin/participants/${participant.id}`}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {participant.participantCode}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Study: {study?.name || 'Unknown'} ({study?.code || 'N/A'})
                      </p>
                      <p className="mt-1 text-sm">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            participant.status === 'REGISTERED'
                              ? 'bg-blue-100 text-blue-800'
                              : participant.status === 'SCREENING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : participant.status === 'ENROLLED'
                              ? 'bg-green-100 text-green-800'
                              : participant.status === 'KIT_SENT'
                              ? 'bg-indigo-100 text-indigo-800'
                              : participant.status === 'KIT_ACTIVATED'
                              ? 'bg-purple-100 text-purple-800'
                              : participant.status === 'SAMPLE_RECEIVED'
                              ? 'bg-pink-100 text-pink-800'
                              : participant.status === 'COMPLETED'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {participant.status}
                        </span>
                      </p>
                    </div>
                    <span className="text-sm font-medium text-blue-600 hover:underline">
                      View Details
                    </span>
                  </Link>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="No participants found"
              description="Try clearing the study filter or add participants to a study."
            />
          )}
        </div>
      </div>
    </div>
  )
}
