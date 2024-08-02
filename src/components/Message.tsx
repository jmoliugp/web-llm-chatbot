"use client";

import Image from "next/image";

interface Props {
  id?: number;
  isAuthorMsg: boolean;
  actionMsg?: string;
  username: string;
  avatar: string;
  content: string;
  createdAt?: Date;
}

export const Message = ({
  avatar,
  content,
  isAuthorMsg,
  actionMsg,
  username,
}: Props) => {
  return (
    <div
      className={`flex relative space-x-1 gap-2 ${
        isAuthorMsg ? "flex-row-reverse space-x-reverse" : "flex-row"
      }`}
    >
      <div className="flex flex-col gap-2">
        {actionMsg && <span>{actionMsg}</span>}
        <div className="flex flex-row gap-2.5">
          <div className="w-12 h-12 overflow-hidden flex-shrink-0 rounded">
            <Image width={50} height={50} src={avatar} alt={username} />
          </div>
          <span
            className={`inline-flex rounded space-x-2 items-start p-3 text-white ${
              isAuthorMsg ? "bg-emerald-700" : "bg-neutral-700"
            } `}
          >
            {isAuthorMsg && (
              <span className="font-bold">{username}:&nbsp;</span>
            )}
            {content}
          </span>
        </div>
      </div>
    </div>
  );
};
