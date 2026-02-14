'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading map...</div>,
});

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading' || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const markers = [
    {
      position: [37.7749, -122.4194] as [number, number],
      title: 'San Francisco',
      description: 'Welcome to San Francisco!',
    },
    {
      position: [37.7849, -122.4094] as [number, number],
      title: 'Marker 2',
      description: 'Another location',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Find Guarana Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Welcome, {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <div className="h-full rounded-lg overflow-hidden shadow-lg">
            <Map center={[37.7749, -122.4194]} zoom={13} markers={markers} />
          </div>
        </div>
      </main>
    </div>
  );
}
