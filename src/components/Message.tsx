import { useSession } from "next-auth/react";
import Image from "next/image";

export type MessageProps = {
  id: string;
  username: string;
  avatar?: string;
  body: string;
  likes: number;
  createdAt: string;
};

interface Props {
  message: MessageProps;
}

export const Message = ({ message }: Props) => {
  const { data: session } = useSession();

  const isAuthorMsg = message.username === session?.user?.name;

  return (
    <div
      className={`flex relative space-x-1 gap-2 ${
        isAuthorMsg ? "flex-row-reverse space-x-reverse" : "flex-row"
      }`}
    >
      {message?.avatar && (
        <div className="w-12 h-12 overflow-hidden flex-shrink-0 rounded">
          <Image
            width={50}
            height={50}
            src={message.avatar}
            alt={message.username}
          />
        </div>
      )}
      <span
        className={`inline-flex rounded space-x-2 items-start p-3 text-white ${
          isAuthorMsg ? "bg-emerald-700" : "bg-neutral-700"
        } `}
      >
        {isAuthorMsg && (
          <span className="font-bold">{message.username}:&nbsp;</span>
        )}
        {message.body}
      </span>
    </div>
  );
};
