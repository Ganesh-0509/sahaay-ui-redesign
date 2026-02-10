import { getFirestore } from "../../config/firebase.js";

export interface OpenAiUsageLog {
  userId?: string;
  purpose: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  createdAt: string;
}

const collection = () => getFirestore().collection("openaiUsage");

export const logOpenAiUsage = async (entry: OpenAiUsageLog) => {
  await collection().add(entry);
};
