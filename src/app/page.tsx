import { getLatestChat } from "@/actions/chat";
import { Header } from "@/components/Header";
import { MessageList } from "@/components/MessageList";
import { NewMessageForm } from "@/components/NewMessageForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col h-screen w-screen">
        <Header />

        <div className="h-full w-full flex items-center justify-center">
          <p className="text-lg md:text-2xl text-white">
            Sign in to join the chat!
          </p>
        </div>
      </div>
    );
  }

  const chat = await getLatestChat(session.user.id);

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      {session ? (
        <>
          <div className="flex-1  p-6 ">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center">
                <MessageList chat={chat} user={session.user} />
              </div>
            </div>
          </div>
          <div className="p-6 bg-white/5 border-t border-neutral-700">
            <div className="max-w-4xl mx-auto">
              <NewMessageForm chat={chat} />
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
