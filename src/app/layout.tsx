import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { WebLlmProvider } from "@/components/LlmProvider";
import { assets } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web Llm Chatbot",
  description: "Web LLM Chatbot",
  icons: {
    icon: assets.chatIcon,
  },
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
        <ReactQueryProvider>
          <WebLlmProvider>
            <body className="bg-neutral-900">{children}</body>
          </WebLlmProvider>
        </ReactQueryProvider>
      </SessionWrapper>
    </html>
  );
}
