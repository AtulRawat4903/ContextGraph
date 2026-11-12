import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db } from "./index.js";
import { pool } from "./pool.js";

const runMigrations = async (): Promise<void> => {
  try {
    const connection = await pool.query(
      "SELECT current_database() AS database, current_user AS username",
    );

    console.log("Database connection:", connection.rows[0]);

    await migrate(db, {
      migrationsFolder: "./drizzle",
    });

    console.log("Database migrations completed successfully.");
  } catch (error) {
    console.error("Database migration failed:", error);

    if (error instanceof Error && "cause" in error) {
      console.error("Underlying cause:", error.cause);
    }

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

void runMigrations();
