'use client'

import Link from 'next/link'
import { useDemoData } from '@/hooks/useDemoData'
import { getParticipantById, getStudyForParticipant } from '@/lib/demoStore'
import { PageBackLink } from '@/components/ui/DemoUi'

export function ParticipantDetail({ participantId }: { participantId: string }) {
  const data = useDemoData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const participant = getParticipantById(data, participantId)

  if (!participant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <p className="text-red-600">Participant not found.</p>
        <Link href="/admin/participants" className="mt-4 text-blue-600 hover:underline">
          Back to participants
        </Link>
      </div>
    )
  }

  const study = getStudyForParticipant(data, participant)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PageBackLink href="/admin/participants" label="Back to Participants" />
          <div className="mt-4 flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {participant.firstName} {participant.lastName}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Participant Code: {participant.participantCode}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Study Information</h2>
            <p className="text-gray-700">
              Study: {study?.name} ({study?.code})
            </p>
            {study && (
              <Link
                href={`/studies/${study.id}`}
                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
              >
                View Study
              </Link>
            )}
          </div>

          <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
              <p className="text-2xl font-semibold text-gray-900">{participant.status}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600">Email: {participant.email}</p>
              <p className="text-sm text-gray-600">
                Phone: {participant.phone || 'Not provided'}
              </p>
              <p className="text-sm text-gray-600">
                Date of Birth:{' '}
                {participant.dateOfBirth
                  ? new Date(participant.dateOfBirth).toLocaleDateString()
                  : 'Not provided'}
              </p>
              <p className="text-sm text-gray-600">
                Address: {participant.address || 'Not provided'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Created</h3>
              <p className="text-2xl font-semibold text-gray-600">
                {new Date(participant.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
