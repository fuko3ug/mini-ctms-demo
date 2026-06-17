import { redirect } from 'next/navigation'

export default async function AdminStudyDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/studies/${id}`)
}
