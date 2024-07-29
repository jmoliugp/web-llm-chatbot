import { getMessages } from "@/actions/chat";
import { QueryKey } from "@/networking/types";
import { useQuery } from "@tanstack/react-query";

export const useMessagesQuery = (chatId: number) => {
  return useQuery({
    queryKey: [QueryKey.ChatMessages, chatId],
    queryFn: () => getMessages(chatId),
  });
};
