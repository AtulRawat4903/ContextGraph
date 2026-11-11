import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";

const startServer = async (): Promise<void> => {
  try {
    await pool.query("SELECT 1");

    console.log("PostgreSQL connected successfully");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to connect to PostgreSQL. Server startup aborted:",
      error,
    );

    try {
      await pool.end();
    } catch (cleanupError) {
      console.error("Failed to close PostgreSQL pool:", cleanupError);
    }

    process.exitCode = 1;
  }
};

void startServer();
