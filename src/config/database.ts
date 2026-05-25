import mongoose from "mongoose";

let isConnected = false;

export async function connectDatabase(uri: string): Promise<void> {
  if (isConnected) return;
  await mongoose.connect(uri);
  isConnected = true;
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

export function getDatabaseHealth(): { connected: boolean } {
  return { connected: mongoose.connection.readyState === 1 };
}
