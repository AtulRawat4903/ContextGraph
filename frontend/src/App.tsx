import { useCallback, useEffect, useState } from "react";
import { getHealth } from "./services/api";

type ConnectionStatus = "checking" | "connected" | "disconnected";

function App() {
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [message, setMessage] = useState("");

  const checkConnection = useCallback(async () => {
    setStatus("checking");
    setMessage("");

    try {
      const data = await getHealth();

      setStatus("connected");
      setMessage(data.message);
    } catch (error) {
      setStatus("disconnected");

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend"
      );
    }
  }, []);

  useEffect(() => {
    void checkConnection();
  }, [checkConnection]);

  return (
    <main className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#333] bg-[#1c1c1c] p-8 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-white">
          ContextGraph
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          AI-powered knowledge and incident assistant
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`h-3 w-3 rounded-full ${
              status === "connected"
                ? "bg-green-500"
                : status === "disconnected"
                  ? "bg-red-500"
                  : "bg-yellow-500 animate-pulse"
            }`}
          />

          <span className="text-sm font-medium text-gray-200">
            {status === "checking" && "Checking backend connection..."}
            {status === "connected" && "Backend connected"}
            {status === "disconnected" && "Backend disconnected"}
          </span>
        </div>

        {message && (
          <p className="mt-4 text-sm text-gray-400">
            {message}
          </p>
        )}

        <button
          onClick={checkConnection}
          disabled={status === "checking"}
          className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "checking" ? "Checking..." : "Retry connection"}
        </button>
      </div>
    </main>
  );
}

export default App;