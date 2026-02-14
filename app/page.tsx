'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Find Guarana
        </h1>
        <p className="text-xl text-gray-700 mb-12">
          A full-stack application with TypeScript, Next.js, and Prisma
          <br />
          featuring authentication and interactive maps
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-semibold"
          >
            Get Started
          </Link>
          <Link
            href="/auth/signin"
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition text-lg font-semibold border-2 border-indigo-600"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Authentication</h3>
            <p className="text-gray-600">Secure authentication with NextAuth.js</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold mb-2">Interactive Maps</h3>
            <p className="text-gray-600">OpenStreetMap integration with Leaflet</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Full Stack</h3>
            <p className="text-gray-600">TypeScript, Next.js, and Prisma</p>
          </div>
        </div>
      </div>
    </div>
  );
}
