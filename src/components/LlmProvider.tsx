"use client";

import { CreateMLCEngine, InitProgressReport } from "@mlc-ai/web-llm";
import React, { createContext, ReactNode, useContext, useState } from "react";

enum LlmModel {
  Llama3 = "Llama-3.1-8B-Instruct-q4f32_1-MLC",
}

interface Context {
  initWebLlm: () => Promise<void>;
  llmProgressReport?: InitProgressReport;
}

interface Props {
  children?: ReactNode | undefined;
}

const WebLlmContext = createContext<Context>({} as Context);
export const useWebLlmContext = () => useContext(WebLlmContext);

export const WebLlmProvider: React.FC<Props> = ({ children }) => {
  const [llmProgressReport, setLlmProgressReport] = useState<
    InitProgressReport | undefined
  >(undefined);

  const initWebLlm = async () => {
    const engine = await CreateMLCEngine(LlmModel.Llama3, {
      initProgressCallback: (initProgress: InitProgressReport) => {
        setLlmProgressReport(initProgress);

        if (initProgress.text.startsWith("Finish loading")) {
          setLlmProgressReport(undefined);
        }
      },
    });
  };

  return (
    <WebLlmContext.Provider value={{ initWebLlm, llmProgressReport }}>
      {children}
    </WebLlmContext.Provider>
  );
};
