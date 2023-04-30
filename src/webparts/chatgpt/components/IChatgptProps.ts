import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IChatgptProps {
  apiURL: string;
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
