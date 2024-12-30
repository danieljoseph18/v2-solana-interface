"use client";

import { useEffect } from "react";

const SSEListener = ({
  onUpdate,
  publicKey,
  timeout = 0,
}: {
  onUpdate: () => void;
  publicKey: string | null;
  timeout?: number;
}) => {
  useEffect(() => {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    if (!BACKEND_URL || !publicKey) {
      return;
    }

    const eventSource = new EventSource(
      `${BACKEND_URL}/events/positions?userId=${publicKey}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Only trigger update if the event is for this user
      if (data.userId === publicKey) {
        console.log("SSE event received for user:", data);
        if (timeout > 0) {
          setTimeout(onUpdate, timeout);
        } else {
          onUpdate();
        }
      }
    };

    return () => {
      eventSource.close();
    };
  }, [onUpdate, publicKey]);

  return null;
};

export default SSEListener;
