"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";

export const NewMessageForm = () => {
  // const [addNewMessage] = useMutation(AddNewMessageMutation);
  const [body, setBody] = useState<string>();
  const { data: session } = useSession();
  const addNewMessage = () => console.log("NEW MSG");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (body) {
          addNewMessage();
          setBody("");
        }
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
        className="flex-1 h-12 px-3 rounded bg-neutral-800 border border-neutral-800 focus:border-neutral-800 focus:outline-none text-white placeholder-white"
      />
      <button
        type="submit"
        className="bg-neutral-800 active:opacity-75 hover:cursor-pointer  rounded h-12 font-medium text-white w-24 text-lg border border-transparent "
        disabled={!body || !session}
      >
        Send
      </button>
    </form>
  );
};
