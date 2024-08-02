"use client";

import { ChatMessage, ChatMessages } from "@/actions/chat";
import { QueryKey } from "@/networking/types";
import {
  ChatCompletionMessageParam,
  CreateMLCEngine,
  InitProgressReport,
  MLCEngine,
} from "@mlc-ai/web-llm";
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
  onReply: (chatId: number) => Promise<void>;
  reply: string | undefined;
}

interface Props {
  children?: ReactNode | undefined;
}

const WebLlmContext = createContext<Context>({} as Context);
export const useWebLlmContext = () => useContext(WebLlmContext);

export const WebLlmProvider: React.FC<Props> = ({ children }) => {
  const [engine, setEngine] = useState<MLCEngine | undefined>();
  const [reply, setReply] = useState<string | undefined>();
  const [llmProgressReport, setLlmProgressReport] = useState<
    InitProgressReport | undefined
  >(undefined);
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

  const onReply = async (chatId: number) => {
    if (!engine) return;

    const rawMessages: ChatMessage[] =
      queryClient.getQueryData<ChatMessages>([QueryKey.ChatMessages, chatId])
        ?.messages ?? [];
    const messages: ChatCompletionMessageParam[] = rawMessages.map((rawMsg) => {
      return {
        role: rawMsg.sender === "LLM" ? "system" : "user",
        content: rawMsg.content,
      };
    });

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
    console.log(fullReply);
  };

  return (
    <WebLlmContext.Provider
      value={{ initWebLlm, llmProgressReport, onReply, reply }}
    >
      {children}
    </WebLlmContext.Provider>
  );
};
