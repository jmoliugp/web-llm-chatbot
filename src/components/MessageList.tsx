"use client";

import { Chat } from "@/actions/chat";
import { useWebLlmContext } from "@/components/LlmProvider";
import { Message } from "@/components/Message";
import { assets } from "@/lib/constants";
import { useMessagesQuery } from "@/networking/queries/useMessagesQuery";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
  chat: Chat;
  user: {
    id: number;
    email: string;
    name: string;
    image?: string;
  };
}

export const MessageList: React.FC<Props> = (props) => {
  const { data: chat, isLoading, isError } = useMessagesQuery(props.chat.id);
  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 500,
  });
  const { llmProgressReport, reply } = useWebLlmContext();

  useEffect(() => {
    if (inView) {
      entry?.target?.scrollIntoView({ behavior: "smooth" });
    }
  }, [entry, inView, chat?.messages.length, !!llmProgressReport]);

  const messages = chat?.messages ?? [];

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-white">Fetching most recent chat messages.</p>
      </div>
    );

  if (isError)
    return (
      <p className="text-white">Something went wrong. Refresh to try again.</p>
    );

  return (
    <div className="flex-1  p-6 max-w-4xl mx-auto flex justify-between items-center overflow-y-auto">
      <div className="flex flex-col min-w-10 space-y-7  w-full">
        {!inView && (
          <div className="py-1.5 w-full px-3 z-10 text-xs absolute flex justify-center bottom-0 mb-28 inset-x-0">
            <button
              className="py-1.5 px-3 text-xs bg-zinc-900 border border-neutral-700 rounded-full text-white font-medium"
              onClick={() =>
                entry?.target?.scrollIntoView({ behavior: "auto" })
              }
            >
              Scroll to see the latest messages
            </button>
          </div>
        )}
        {messages.map((msg) => {
          const isAuthorMsg = msg.sender === "USER";
          const userAvatar = props.user.image ?? assets.defaultUserAvatar;
          const avatar = isAuthorMsg ? userAvatar : assets.chatBotAvatar;

          return (
            <Message
              key={msg.id}
              content={msg.content}
              createdAt={msg.createdAt}
              id={msg.id}
              isAuthorMsg={isAuthorMsg}
              username={props.user.name}
              avatar={avatar}
            />
          );
        })}
        {llmProgressReport && (
          <Message
            avatar={assets.loadingIcon}
            content={llmProgressReport.text}
            isAuthorMsg={false}
            username={props.user.name}
            actionMsg={"Loading..."}
          />
        )}
        {reply && (
          <Message
            avatar={assets.chatBotAvatar}
            content={reply}
            isAuthorMsg={false}
            username={props.user.name}
            actionMsg={"Generating response..."}
          />
        )}
      </div>
      <div ref={scrollRef} />
    </div>
  );
};
