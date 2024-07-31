import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addMessageToChat,
  ChatMessages,
  InputMessage,
  Message,
} from "@/actions/chat";
import { QueryKey } from "@/networking/types";

export const useAddMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Message, DefaultError, InputMessage>({
    mutationFn: addMessageToChat,
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        [QueryKey.ChatMessages, newMessage.chatId],
        (cachedChat: ChatMessages): ChatMessages => {
          const prevMessages = cachedChat.messages ?? [];

          return { ...cachedChat, messages: [...prevMessages, newMessage] };
        }
      );

      return newMessage;
    },
  });
};
