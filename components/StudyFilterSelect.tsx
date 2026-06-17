'use client'

import { useRouter, usePathname } from 'next/navigation'

type Study = {
  id: string
  name: string
  code: string
}

export function StudyFilterSelect({
  studies,
  selectedStudyId,
}: {
  studies: Study[]
  selectedStudyId: string | null
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <select
      id="study-filter"
      value={selectedStudyId ?? ''}
      onChange={(e) => {
        const studyId = e.target.value
        if (studyId) {
          router.push(`${pathname}?studyId=${studyId}`)
        } else {
          router.push(pathname)
        }
      }}
      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
    >
      <option value="">All Studies</option>
      {studies.map((study) => (
        <option key={study.id} value={study.id}>
          {study.name} ({study.code})
        </option>
      ))}
    </select>
  )
}
