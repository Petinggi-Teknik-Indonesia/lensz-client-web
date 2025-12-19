import { useEffect, useRef } from "react";

// 🔴 keep single WS instance
const wsRef = { current: null as WebSocket | null };

export function useWebSocket(onMessage?: (data: any) => void) {
  const onMessageRef = useRef(onMessage);

  // always keep latest callback
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL;
    console.log("Connecting WebSocket...");

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS connected");
    };

    ws.onmessage = (e) => {
      console.log("📩 WS message:", e.data);
      try {
        const data = JSON.parse(e.data);
        onMessageRef.current?.(data);
      } catch (err) {
        console.error("❌ Failed to parse WS message", e.data, err);
      }
    };

    ws.onerror = (e) => {
      console.log("⚠️ WS error", e);
    };

    ws.onclose = (e) => {
      console.log("❌ WS closed", e);
      wsRef.current = null;
    };

    return () => {
      console.log("🧹 Cleanup: closing WS");
      ws.close();
      wsRef.current = null;
    };
  }, []); // 🔒 connect ONCE

  // ✅ expose send INSIDE hook
  const send = (data: any) => {
    if (!wsRef.current) {
      console.warn("⚠️ WS not connected, message dropped", data);
      return;
    }

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("⚠️ WS not open, message dropped", data);
    }
  };

  return { send };
}
