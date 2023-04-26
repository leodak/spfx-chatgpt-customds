import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IChatGptProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  wpContext: WebPartContext;
}

export interface IChatGPTState {
  question: string;
  answer: string;
}
