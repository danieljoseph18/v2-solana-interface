"use client";

import { useEffect } from "react";

const SSEListener = ({
  onUpdate,
  timeout = 0,
}: {
  onUpdate: () => void;
  timeout?: number;
}) => {
  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const eventSource = new EventSource(`${BACKEND_URL}/events/positions`);

    eventSource.onmessage = (event) => {
      // This fires whenever the backend emits an event
      // Call getAllPositions or trigger a state update here
      console.log("SSE event received:", event.data);
      if (timeout > 0) {
        setTimeout(onUpdate, timeout);
      } else {
        onUpdate();
      }
    };

    return () => {
      eventSource.close();
    };
  }, [onUpdate]);

  return null;
};

export default SSEListener;
