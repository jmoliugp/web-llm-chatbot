import {
  createNewChat,
  getLatestChat,
  retrieveLatestChat,
} from "@/actions/chat";
import { Header } from "@/components/Header";
import { MessageList } from "@/components/MessageList";
import { NewMessageForm } from "@/components/NewMessageForm";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";

async function initChat(session: Session | null) {
  if (session == null) return;

  return getLatestChat(session.user.id);
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const chat = await initChat(session);

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      {session ? (
        <>
          <div className="flex-1  p-6 ">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center">
                <MessageList chat={chat!} user={session.user} />
              </div>
            </div>
          </div>
          <div className="p-6 bg-white/5 border-t border-neutral-700">
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
