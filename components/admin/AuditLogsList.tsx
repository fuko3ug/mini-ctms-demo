'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useDemoData } from '@/hooks/useDemoData'
import { getAuditLogs } from '@/lib/demoStore'
import { EmptyState, PageBackLink } from '@/components/ui/DemoUi'

export function AuditLogsList() {
  const data = useDemoData()
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null)

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const auditLogs = getAuditLogs(data, selectedStudyId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PageBackLink href="/admin" label="Back to Dashboard" />
          <div className="mt-4 flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          </div>

          <div className="mb-6">
            <label htmlFor="study-filter" className="sr-only">
              Study Filter
            </label>
            <select
              id="study-filter"
              value={selectedStudyId ?? ''}
              onChange={(e) => setSelectedStudyId(e.target.value || null)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            >
              <option value="">All Studies</option>
              {data.studies.map((study) => (
                <option key={study.id} value={study.id}>
                  {study.name} ({study.code})
                </option>
              ))}
            </select>
          </div>

          {auditLogs.length > 0 ? (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {log.action.replace(/_/g, ' ')}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Target: {log.targetType} ({log.targetId})
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        by {log.actorName} ({log.actorRole}){' '}
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      {log.studyCode}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <pre className="bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No audit logs yet"
              description="System activity will appear here as coordinators and participants take actions."
            />
          )}
        </div>
      </div>
    </div>
  )
}
