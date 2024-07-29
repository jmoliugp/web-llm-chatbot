import { QueryFunctionContext } from "@tanstack/react-query";

export enum QueryKey {
  LatestChat = "LatestChat",
}
export type QueryContext<Input = Record<string, never>> = QueryFunctionContext<
  [string, Input]
>;
