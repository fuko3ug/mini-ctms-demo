'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/app/generated/prisma/client';

export default function ParticipantDashboard() {
  const { session } = useAuth();
  const router = useRouter();
  const [participant, setParticipant] = useState<any | null>(null);
  const [kit, setKit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kitCode, setKitCode] = useState('');
  const [kitMessage, setKitMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadParticipantData() {
      if (!session?.user) {
        router.push('/login');
        return;
      }

      try {
        // In a real app, we would have a participantId in the user or session
        // For demo, we find participant by email matching the user's email
        const data = await prisma.participant.findFirst({
          where: {
            email: session.user.email,
          },
          include: {
            study: true,
            kits: true,
          },
        });

        if (!data) {
          setError('No participant record found for this user');
          setLoading(false);
          return;
        }

        setParticipant(data);
        // Assume the first kit is the one for this participant
        if (data.kits.length > 0) {
          setKit(data.kits[0]);
        }
      } catch (err) {
        console.error('Failed to load participant data:', err);
        setError('Failed to load participant data');
      } finally {
        setLoading(false);
      }
    }

    loadParticipantData();
  }, [session]);

  const handleKitActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setKitMessage({ type: '', text: '' });

    if (!kitCode.trim()) {
      setKitMessage({ type: 'error', text: 'Please enter a kit code' });
      return;
    }

    try {
      // Find the kit by code
      const kitData = await prisma.kit.findUnique({
        where: { kitCode: kitCode.trim() },
      });

      if (!kitData) {
        setKitMessage({ type: 'error', text: 'Invalid kit code' });
        return;
      }

      // Check if the kit belongs to this participant
      if (kitData.participantId !== participant.id) {
        setKitMessage({ type: 'error', text: 'This kit does not belong to you' });
        return;
      }

      // Check if the kit is already activated
      if (kitData.status === 'ACTIVATED') {
        setKitMessage({ type: 'info', text: 'Kit is already activated' });
        return;
      }

      // Activate the kit
      const updatedKit = await prisma.kit.update({
        where: { id: kitData.id },
        data: {
          status: 'ACTIVATED',
          activatedAt: new Date(),
        },
      });

      // Create an audit log
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          actorRole: session.user.role,
          action: 'ACTIVATE_KIT',
          targetType: 'KIT',
          targetId: kitData.id,
          studyId: participant.studyId,
          metadata: {
            activatedBy: session.user.email,
            kitCode: kitData.kitCode,
          },
        },
      });

      setKit(updatedKit);
      setKitCode('');
      setKitMessage({ type: 'success', text: 'Kit activated successfully!' });

      // Refresh participant data to get updated kit
      const refreshed = await prisma.participant.findUnique({
        where: { id: participant.id },
        include: { kits: true },
      });
      if (refreshed) {
        setParticipant(refreshed);
        if (refreshed.kits.length > 0) {
          setKit(refreshed.kits[0]);
        }
      }
    } catch (err) {
      console.error('Failed to activate kit:', err);
      setKitMessage({ type: 'error', text: 'Failed to activate kit' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <p className="text-red-600">{error}</p>
        <Link href="/login" className="mt-4 text-blue-600 hover:underline">
          Go back to login
        </Link>
      </div>
    );
  }

  if (!participant) {
    return <div>Loading participant data...</div>;
  }

  // Define the timeline steps
  const steps = [
    { id: 'registered', label: 'Registered', status: 'completed' },
    { id: 'screening', label: 'Screening', status: participant.status === 'SCREENING' ? 'current' : participant.status === 'ENROLLED' || participant.status === 'KIT_SENT' || participant.status === 'KIT_ACTIVATED' || participant.status === 'SAMPLE_RECEIVED' || participant.status === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'enrolled', label: 'Enrolled', status: participant.status === 'ENROLLED' || participant.status === 'KIT_SENT' || participant.status === 'KIT_ACTIVATED' || participant.status === 'SAMPLE_RECEIVED' || participant.status === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'kitSent', label: 'Kit Sent', status: participant.status === 'KIT_SENT' || participant.status === 'KIT_ACTIVATED' || participant.status === 'SAMPLE_RECEIVED' || participant.status === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'kitActivated', label: 'Kit Activated', status: participant.status === 'KIT_ACTIVATED' || participant.status === 'SAMPLE_RECEIVED' || participant.status === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'sampleReceived', label: 'Sample Received', status: participant.status === 'SAMPLE_RECEIVED' || participant.status === 'COMPLETED' ? 'completed' : 'pending' },
    { id: 'completed', label: 'Completed', status: participant.status === 'COMPLETED' ? 'completed' : 'pending' },
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
                  participant.status === 'REGISTERED'
                    ? 'Registered'
                    : participant.status === 'SCREENING'
                    ? 'Screening'
                    : participant.status === 'ENROLLED'
                    ? 'Enrolled'
                    : participant.status === 'KIT_SENT'
                    ? 'Kit Sent'
                    : participant.status === 'KIT_ACTIVATED'
                    ? 'Kit Activated'
                    : participant.status === 'SAMPLE_RECEIVED'
                    ? 'Sample Received'
                    : participant.status === 'COMPLETED'
                    ? 'Completed'
                    : participant.status === 'WITHDRAWN'
                    ? 'Withdrawn'
                    : participant.status
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

          {kit && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Kit
              </h2>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Kit Code
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {kit.kitCode}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Status: {
                    kit.status === 'SHIPPED'
                      ? 'Shipped'
                      : kit.status === 'RECEIVED'
                      ? 'Received'
                      : kit.status === 'ACTIVATED'
                      ? 'Activated'
                      : kit.status === 'USED'
                      ? 'Used'
                      : kit.status
                  }
                </p>
                {kit.shippedAt && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    Shipped: {new Date(kit.shippedAt).toLocaleDateString()}
                  </p>
                )}
                {kit.receivedAt && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    Received: {new Date(kit.receivedAt).toLocaleDateString()}
                  </p>
                )}
                {kit.activatedAt && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    Activated: {new Date(kit.activatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {!kit && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Kit Activation
              </h2>
              <form onSubmit={handleKitActivate} className="space-y-4">
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