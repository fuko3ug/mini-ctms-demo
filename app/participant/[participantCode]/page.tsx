import { ParticipantByCodeDetail } from '@/components/participant/ParticipantByCodeDetail'

export default async function ParticipantDetailPage({
  params,
}: {
  params: Promise<{ participantCode: string }>
}) {
  const { participantCode } = await params
  return <ParticipantByCodeDetail participantCode={participantCode} />
}
