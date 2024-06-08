'use client';

import Link from 'next/link';

export default function SignIn() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Sign In</h1>
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-600">TravelPlanner</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Sign In
          </button>
        </div>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link href="/user/signup">Sign Up</Link>
        </p>
        <div className="text-center mt-6">
          <a href="#" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </main>
  );
}
