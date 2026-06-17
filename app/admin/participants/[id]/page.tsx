import { ParticipantDetail } from '@/components/participants/ParticipantDetail'

export default async function ParticipantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ParticipantDetail participantId={id} />
}
