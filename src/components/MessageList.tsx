"use client";

import { Message, MessageProps } from "@/components/Message";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const sampleAvatar1 = "/images/avatarMaleAi.webp";
const sampleAvatar2 = "/images/avatarFemAi.webp";
const stubMessages: MessageProps[] = [
  {
    id: "1",
    username: "alice",
    avatar: sampleAvatar2,
    body: "Hey Bob, how's it going?",
    likes: 2,
    createdAt: "2024-06-08T10:00:00Z",
  },
  {
    id: "2",
    username: "bob",
    avatar: sampleAvatar1,
    body: "Hi Alice! I'm doing well, thanks. How about you?",
    likes: 1,
    createdAt: "2024-06-08T10:02:00Z",
  },
  {
    id: "3",
    username: "alice",
    avatar: sampleAvatar2,
    body: "I'm great, just working on a new project. Have you heard about the new TypeScript features?",
    likes: 3,
    createdAt: "2024-06-08T10:05:00Z",
  },
  {
    id: "4",
    username: "bob",
    avatar: sampleAvatar1,
    body: "Yes, I have! They seem really useful, especially the improved type inference. Are you planning to use them?",
    likes: 2,
    createdAt: "2024-06-08T10:07:00Z",
  },
  {
    id: "5",
    username: "alice",
    avatar: sampleAvatar2,
    body: "Definitely! I think they'll make our codebase much cleaner. Let's catch up later and discuss more?",
    likes: 4,
    createdAt: "2024-06-08T10:10:00Z",
  },
  {
    id: "6",
    username: "bob",
    avatar: sampleAvatar1,
    body: "Sounds like a plan. Talk to you later!",
    likes: 1,
    createdAt: "2024-06-08T10:12:00Z",
  },
];

export const MessageList = () => {
  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 500,
  });

  useEffect(() => {
    if (inView) {
      entry?.target?.scrollIntoView({ behavior: "auto" });
    }
  }, [entry, inView]);

  const messages = stubMessages;
  const loading = false;
  const error = false;

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-white">Fetching most recent chat messages.</p>
      </div>
    );

  if (error)
    return (
      <p className="text-white">Something went wrong. Refresh to try again.</p>
    );

  return (
    <div className="flex flex-col min-w-10 space-y-7  w-full">
      {!inView && (
        <div className="py-1.5 w-full px-3 z-10 text-xs absolute flex justify-center bottom-0 mb-[120px] inset-x-0">
          <button
            className="py-1.5 px-3 text-xs bg-[#1c1c1f] border border-[#363739] rounded-full text-white font-medium"
            onClick={() => entry?.target?.scrollIntoView({ behavior: "auto" })}
          >
            Scroll to see the latest messages
          </button>
        </div>
      )}
      {messages.map((msg) => (
        <Message key={msg?.id} message={msg} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};
