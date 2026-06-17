'use client'

import Link from 'next/link'
import { useDemoData } from '@/hooks/useDemoData'
import {
  getKitsForParticipant,
  getParticipantByCode,
  getStudyForParticipant,
} from '@/lib/demoStore'
import { EmptyState, PageBackLink } from '@/components/ui/DemoUi'

export function ParticipantByCodeDetail({ participantCode }: { participantCode: string }) {
  const data = useDemoData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const participant = getParticipantByCode(data, participantCode)

  if (!participant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <EmptyState
          title="Participant not found"
          description={`No participant matches code ${participantCode}.`}
          actionLabel="Back to Participant Portal"
          actionHref="/participant"
        />
      </div>
    )
  }

  const study = getStudyForParticipant(data, participant)
  const kits = getKitsForParticipant(data, participant.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PageBackLink href="/participant" label="Back to Participant Portal" />
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
            <p className="text-xl font-semibold text-gray-900">{study?.name}</p>
            <p className="text-sm text-gray-600 mt-1">Study Code: {study?.code}</p>
          </div>

          <div className="grid gap-6 mb-8 sm:grid-cols-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
              <p className="text-2xl font-semibold text-gray-900">{participant.status}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contact</h3>
              <p className="text-sm text-gray-600">Email: {participant.email}</p>
              <p className="text-sm text-gray-600">
                Phone: {participant.phone || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Kits ({kits.length})
            </h2>
            {kits.length > 0 ? (
              <div className="space-y-4">
                {kits.map((kit) => (
                  <div key={kit.id} className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="font-medium text-gray-900">Kit Code: {kit.kitCode}</h3>
                    <p className="mt-1 text-sm text-gray-600">Status: {kit.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No kits assigned"
                description="This participant does not have any kits in the demo dataset."
              />
            )}
          </div>

          {study && (
            <Link href={`/studies/${study.id}`} className="text-sm text-blue-600 hover:underline">
              View study details
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
