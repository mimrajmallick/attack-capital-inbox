"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-gray-900 text-gray-100">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2 drop-shadow">
          Attack Capital 💬
        </h1>
        <p className="text-gray-300 mb-6 text-sm tracking-wide">
          Unified Inbox & Messaging Platform
        </p>

        {session ? (
          <div>
            <img
              src={session.user?.image || ""}
              alt="User Avatar"
              className="w-20 h-20 rounded-full mx-auto mb-3 ring-2 ring-blue-400/50"
            />
            <h2 className="text-xl font-semibold">{session.user?.name}</h2>
            <p className="text-sm text-gray-400 mb-6">{session.user?.email}</p>

            <button
              onClick={() => signOut()}
              className="w-full bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 transition duration-200 shadow-md"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-4">Sign in to continue</p>
            <button
              onClick={() => signIn("google")}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>

      <footer className="mt-10 text-gray-500 text-xs tracking-widest">
        © {new Date().getFullYear()} Attack Capital. All rights reserved.
      </footer>
    </main>
  );
}
