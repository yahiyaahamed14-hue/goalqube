"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-3xl p-10">

        <p className="text-yellow-400 font-bold tracking-[4px]">
          GOALQUBE PROFILE
        </p>

        <h1 className="text-4xl font-black mt-4">
          Welcome ⚽
        </h1>

        {user && (
          <div className="mt-8 space-y-4">

            <div className="bg-zinc-900 p-4 rounded-xl">
              <p className="text-zinc-400">Email</p>
              <p className="font-bold">{user.email}</p>
            </div>

            <div className="bg-zinc-900 p-4 rounded-xl">
              <p className="text-zinc-400">User ID</p>
              <p className="text-sm break-all">
                {user.uid}
              </p>
            </div>

          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-red-500 text-white font-bold py-3 rounded-xl"
        >
          LOGOUT
        </button>

      </div>

    </main>
  );
}