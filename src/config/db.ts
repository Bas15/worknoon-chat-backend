import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/worknoon";
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.info("[Database] Successfully connected to MongoDB.");
      return;
    } catch (error) {
      retries += 1;
      console.error(
        `[Database] Connection failed (Attempt ${retries}/${maxRetries}):`,
        error,
      );

      if (retries >= maxRetries) {
        console.error(
          "[Database] Maximum connection retries reached. Shutting down.",
        );
        process.exit(1);
      }

      // Wait for 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};
