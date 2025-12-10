import { useEffect, useRef } from "react";

export function useWebSocket(onMessage?: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  // Keep latest callback ref updated
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL;
    console.log("Connecting WebSocket...");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ WS connected");
    ws.onmessage = (e) => {
      console.log("📩 Message:", e.data);
      try {
        const data = JSON.parse(e.data);
        onMessageRef.current?.(data); // ✅ call latest callback
      } catch (err) {
        console.error("❌ Failed to parse WS message", e.data, err);
      }
    };
    ws.onerror = (e) => console.log("⚠️ WS error", e);
    ws.onclose = (e) => console.log("❌ WS closed", e);

    return () => {
      console.log("🧹 Cleanup: closing WS");
      ws.close();
    };
  }, []); // only once, connection stays stable

  return wsRef.current;
}
