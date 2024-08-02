"use client";

import { Chat } from "@/actions/chat";
import { useWebLlmContext } from "@/components/LlmProvider";
import { useAddMessageMutation } from "@/networking/mutations/useAddMessageMutation";
import { $Enums } from "@prisma/client";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

interface Props {
  chat: Chat;
}

export const NewMessageForm: React.FC<Props> = (props) => {
  const [body, setBody] = useState<string>();
  const { data: session } = useSession();
  const { mutateAsync, data: addedMessage } = useAddMessageMutation();
  const { llmProgressReport, onReply } = useWebLlmContext();

  const isDisabled = !session || !!llmProgressReport;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!body) return;

        setBody("");
        await mutateAsync({
          chatId: props.chat.id,
          content: body,
          sender: $Enums.SenderType.USER,
          type: "TEXT",
        });
        onReply(props.chat.id);
      }}
      className="flex items-center space-x-3"
    >
      <input
        autoFocus
        autoComplete="off"
        id="message"
        name="message"
        placeholder="Write a message..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className={clsx(
          "flex-1 h-12 px-3 rounded bg-neutral-800 border border-neutral-800 focus:border-neutral-800 focus:outline-none text-white placeholder-white",
          { "opacity-45": isDisabled }
        )}
        disabled={isDisabled}
      />
      <button
        type="submit"
        className={clsx(
          "bg-neutral-800 active:opacity-75 hover:cursor-pointer  rounded h-12 font-medium text-white w-24 text-lg border border-transparent ",
          {
            "opacity-45": isDisabled,
          }
        )}
        disabled={isDisabled || !body}
      >
        Send
      </button>
    </form>
  );
};
