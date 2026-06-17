'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { activateKit as activateDemoKit, DEMO_KIT_CODE } from '@/lib/demoStore';

type Kit = {
  kitCode: string;
  status: string;
  shippedAt?: string | Date | null;
  receivedAt?: string | Date | null;
  activatedAt?: string | Date | null;
};

type Participant = {
  id: string;
  firstName: string;
  participantCode: string;
  status: string;
  study?: {
    name: string;
    code: string;
  } | null;
};

export function ParticipantDashboardClient({
  participant,
  kit: initialKit,
  pendingKit = null,
}: {
  participant: Participant;
  kit: Kit | null;
  pendingKit?: Kit | null;
}) {
  const router = useRouter();
  const [currentKit, setCurrentKit] = useState<Kit | null>(initialKit);
  const [participantStatus, setParticipantStatus] = useState(participant.status);
  const [kitCode, setKitCode] = useState('');
  const [kitMessage, setKitMessage] = useState({ type: '', text: '' });

  const handleKitActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setKitMessage({ type: '', text: '' });

    if (!kitCode.trim()) {
      setKitMessage({ type: 'error', text: 'Please enter a kit code' });
      return;
    }

    const result = activateDemoKit(participant.id, kitCode);

    if (result.success) {
      setCurrentKit(result.kit);
      setParticipantStatus('KIT_ACTIVATED');
      setKitCode('');
      setKitMessage({ type: 'success', text: 'Kit activated successfully!' });
    } else {
      setKitMessage({ type: 'error', text: result.error });
    }
  };

  if (!participant) {
    return <div>Loading participant data...</div>;
  }

  // Define the timeline steps
  const steps = [
    { id: 'registered', label: 'Registered', status: 'completed' },
    { id: 'screening', label: 'Screening', status: participantStatus === 'SCREENING' ? 'current' : participantStatus === 'ENROLLED' || participantStatus === 'KIT_SENT' || participantStatus === 'KIT_ACTIVATED' || participantStatus === 'SAMPLE_RECEIVED' || participantStatus === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'enrolled', label: 'Enrolled', status: participantStatus === 'ENROLLED' || participantStatus === 'KIT_SENT' || participantStatus === 'KIT_ACTIVATED' || participantStatus === 'SAMPLE_RECEIVED' || participantStatus === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'kitSent', label: 'Kit Sent', status: participantStatus === 'KIT_SENT' || participantStatus === 'KIT_ACTIVATED' || participantStatus === 'SAMPLE_RECEIVED' || participantStatus === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'kitActivated', label: 'Kit Activated', status: participantStatus === 'KIT_ACTIVATED' || participantStatus === 'SAMPLE_RECEIVED' || participantStatus === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'sampleReceived', label: 'Sample Received', status: participantStatus === 'SAMPLE_RECEIVED' || participantStatus === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'completed', label: 'Completed', status: participantStatus === 'COMPLETED' ? 'completed' : 'pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {participant.firstName}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Participant Code: {participant.participantCode}
              </p>
            </div>
            <Link
              href="/logout"
              onClick={(e) => {
                e.preventDefault();
                // In a real app, we would call a logout endpoint
                // For demo, we just clear the session
                window.sessionStorage.removeItem('auth-session');
                router.push('/login');
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Logout
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Your Study
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Study Name
              </p>
              <p className="text-xl font-semibold text-gray-900">
                {participant.study?.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Study Code: {participant.study?.code}
              </p>
              <p className="text-sm text-gray-600">
                Status: {
                  participantStatus === 'REGISTERED'
                    ? 'Registered'
                    : participantStatus === 'SCREENING'
                    ? 'Screening'
                    : participantStatus === 'ENROLLED'
                    ? 'Enrolled'
                    : participantStatus === 'KIT_SENT'
                    ? 'Kit Sent'
                    : participantStatus === 'KIT_ACTIVATED'
                    ? 'Kit Activated'
                    : participantStatus === 'SAMPLE_RECEIVED'
                    ? 'Sample Received'
                    : participantStatus === 'COMPLETED'
                    ? 'Completed'
                    : participantStatus === 'WITHDRAWN'
                    ? 'Withdrawn'
                    : participantStatus
                }
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Study Progress
            </h2>
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center mb-2">
                  <div className="w-2 h-2 mr-3">
                    {step.status === 'completed' ? (
                      <div className="h-2 w-2 bg-green-600 rounded-full" />
                    ) : step.status === 'current' ? (
                      <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
                    ) : (
                      <div className="h-2 w-2 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentKit && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Kit
              </h2>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Kit Code
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {currentKit.kitCode}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Status: {
                    currentKit.status === 'SHIPPED'
                      ? 'Shipped'
                      : currentKit.status === 'RECEIVED'
                      ? 'Received'
                      : currentKit.status === 'ACTIVATED'
                      ? 'Activated'
                      : currentKit.status === 'USED'
                      ? 'Used'
                      : currentKit.status
                  }
                </p>
                {currentKit.shippedAt && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    Shipped: {new Date(currentKit.shippedAt).toLocaleDateString()}
                  </p>
                )}
                {currentKit.receivedAt && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    Received: {new Date(currentKit.receivedAt).toLocaleDateString()}
                  </p>
                )}
                {currentKit.activatedAt && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    Activated: {new Date(currentKit.activatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {!currentKit && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Kit Activation
              </h2>
              <form onSubmit={handleKitActivate} className="space-y-4">
                {pendingKit && (
                  <p className="text-sm text-gray-500">
                    Demo kit code: <span className="font-mono font-medium text-gray-700">{DEMO_KIT_CODE}</span>
                  </p>
                )}
                <div>
                  <label htmlFor="kit-code" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your kit code to activate:
                  </label>
                  <input
                    id="kit-code"
                    type="text"
                    autoComplete="off"
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Kit code"
                    value={kitCode}
                    onChange={(e) => setKitCode(e.target.value)}
                  />
                </div>
                {kitMessage.text && (
                  <p className={`text-sm ${kitMessage.type === 'success' ? 'text-green-600' : kitMessage.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                    {kitMessage.text}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Activate Kit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}