"use client";

import { Header } from "@/components/Header";
import { MessageList } from "@/components/MessageList";
import { NewMessageForm } from "@/components/NewMessageForm";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      {session ? (
        <>
          <div className="flex-1  p-6 ">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center">
                <MessageList />
              </div>
            </div>
          </div>
          <div className="p-6 bg-white/5 border-t border-[#363739]">
            <div className="max-w-4xl mx-auto">
              <NewMessageForm />
            </div>
          </div>
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-lg md:text-2xl text-white">
            Sign in to join the chat!
          </p>
        </div>
      )}
    </div>
  );
}
