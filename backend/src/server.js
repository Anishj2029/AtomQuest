import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { seedDemoDataIfEmpty } from "./seed/autoSeed.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();
  await seedDemoDataIfEmpty();

 const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err.message);
    server.close(() => process.exit(1));
  });
};

start().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
