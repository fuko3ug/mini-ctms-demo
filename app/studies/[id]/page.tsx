import { StudyDetail } from '@/components/studies/StudyDetail'

export default async function StudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StudyDetail studyId={id} />
}
