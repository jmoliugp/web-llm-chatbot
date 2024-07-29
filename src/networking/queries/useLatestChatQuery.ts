import { retrieveLatestChat } from "@/actions/chat";
import { QueryKey } from "@/networking/types";
import { useQuery } from "@tanstack/react-query";

export const useLatestChatQuery = (userId: number) => {
  return useQuery({
    queryKey: [QueryKey.LatestChat, userId],
    queryFn: () => retrieveLatestChat(userId),
  });
};
