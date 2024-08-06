"use client";

import { assets } from "@/lib/constants";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="p-6 bg-white/5 border-b border-neutral-700">
      <div className="mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex flex-row justify-center items-center gap-2">
            <Image
              width={34}
              height={34}
              src={assets.chatIcon}
              alt={"App icon"}
            />
            <span className="text-white font-bold text-xl">
              Web-Llm-Chatbot
            </span>
          </div>
          {session ? (
            <div className="flex space-x-1">
              {session?.user?.image && (
                <div className="w-12 h-12 rounded overflow-hidden">
                  <Image
                    width={50}
                    height={50}
                    src={session?.user?.image}
                    alt={session?.user?.name || "User profile picture"}
                  />
                </div>
              )}
              <button
                onClick={() => signOut()}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white border border-transparent active:opacity-75"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <button
                onClick={() => signIn("github")}
                className="bg-white/5  gap-3 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center"
              >
                <Image
                  width={26}
                  height={26}
                  src={assets.githubIcon}
                  alt={"Github icon"}
                />
                Sign in with GitHub
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
