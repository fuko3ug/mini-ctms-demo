'use client'

import Link from 'next/link'
import { useDemoData } from '@/hooks/useDemoData'
import {
  DEMO_PARTICIPANT_EMAIL,
  getKitsForParticipant,
  getParticipantByEmail,
  getStudyForParticipant,
} from '@/lib/demoStore'
import { ParticipantDashboardClient } from '@/app/participant/ParticipantDashboardClient'
import { EmptyState } from '@/components/ui/DemoUi'

export function ParticipantPortal() {
  const data = useDemoData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const participant = getParticipantByEmail(data, DEMO_PARTICIPANT_EMAIL)

  if (!participant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <EmptyState
          title="Demo participant not found"
          description="Seed data is missing the demo participant account. Refresh to restore defaults."
          actionLabel="Go to Home"
          actionHref="/"
        />
      </div>
    )
  }

  const study = getStudyForParticipant(data, participant)
  const kits = getKitsForParticipant(data, participant.id)
  const activeKit = kits.find((kit) => kit.status === 'ACTIVATED') ?? null

  return (
    <ParticipantDashboardClient
      participant={{
        id: participant.id,
        firstName: participant.firstName,
        participantCode: participant.participantCode,
        status: participant.status,
        study: study ? { name: study.name, code: study.code } : null,
      }}
      kit={activeKit}
      pendingKit={kits.find((kit) => kit.status === 'SHIPPED') ?? null}
    />
  )
}
