"use client";

import { ChatMessage, ChatMessages } from "@/actions/chat";
import { useAddMessageMutation } from "@/networking/mutations/useAddMessageMutation";
import { QueryKey } from "@/networking/types";
import {
  ChatCompletionMessageParam,
  CreateMLCEngine,
  InitProgressReport,
  MLCEngine,
} from "@mlc-ai/web-llm";
import { $Enums } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

enum LlmModel {
  Llama3 = "Llama-3.1-8B-Instruct-q4f32_1-MLC",
}

interface Context {
  initWebLlm: () => Promise<void>;
  llmProgressReport?: InitProgressReport;
  onReply: (msg: NewMsg) => Promise<void>;
  reply: string | undefined;
}

interface Props {
  children?: ReactNode | undefined;
}

interface NewMsg {
  chatId: number;
  content: string;
}

const WebLlmContext = createContext<Context>({} as Context);
export const useWebLlmContext = () => useContext(WebLlmContext);

export const WebLlmProvider: React.FC<Props> = ({ children }) => {
  const [engine, setEngine] = useState<MLCEngine | undefined>();
  const [reply, setReply] = useState<string | undefined>();
  const [llmProgressReport, setLlmProgressReport] = useState<
    InitProgressReport | undefined
  >({
    progress: 0,
    text: "Loading engine...",
    timeElapsed: 0,
  });
  const { mutate: addNewMessage, mutateAsync: addNewMessageAsync } =
    useAddMessageMutation();
  const queryClient = useQueryClient();

  const initWebLlm = async () => {
    const engine = await CreateMLCEngine(LlmModel.Llama3, {
      initProgressCallback: (initProgress: InitProgressReport) => {
        setLlmProgressReport(initProgress);

        if (initProgress.text.startsWith("Finish loading")) {
          setLlmProgressReport(undefined);
        }
      },
    });
    setEngine(engine);
  };
  useEffect(() => {
    initWebLlm();
  }, []);

  const onReply = async (newMsg: NewMsg) => {
    if (!engine) return;

    addNewMessage({
      chatId: newMsg.chatId,
      content: newMsg.content,
      sender: $Enums.SenderType.USER,
      type: "TEXT",
    });

    const rawMessages: ChatMessage[] =
      queryClient.getQueryData<ChatMessages>([
        QueryKey.ChatMessages,
        newMsg.chatId,
      ])?.messages ?? [];
    const messagesHistory: ChatCompletionMessageParam[] = rawMessages.map(
      (rawMsg) => {
        return {
          role: rawMsg.sender === "LLM" ? "assistant" : "user",
          content: rawMsg.content,
        };
      }
    );
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      ...messagesHistory,
      {
        role: "user",
        content: newMsg.content,
      },
    ];

    const chunks = await engine.chat.completions.create({
      messages,
      temperature: 1,
      stream: true,
      stream_options: { include_usage: true },
    });

    setReply("");
    for await (const chunk of chunks) {
      const msgChunk = chunk.choices[0]?.delta.content;
      if (!msgChunk) continue;

      setReply((prev) => prev + msgChunk);
    }

    const fullReply = await engine.getMessage();
    await addNewMessageAsync({
      chatId: newMsg.chatId,
      content: fullReply,
      sender: $Enums.SenderType.LLM,
      type: "TEXT",
    });
    setReply(undefined);
  };

  return (
    <WebLlmContext.Provider
      value={{ initWebLlm, llmProgressReport, onReply, reply }}
    >
      {children}
    </WebLlmContext.Provider>
  );
};
