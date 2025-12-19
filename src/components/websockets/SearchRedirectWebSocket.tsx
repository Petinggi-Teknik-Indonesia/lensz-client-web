import { useWebSocket } from "@/hooks/useWebSocket";
import { useNavigate } from "@tanstack/react-router";
import { useRef } from "react";

export function SearchRedirectWebSocket() {
  const navigate = useNavigate();
  const ackSentRef = useRef(false);

  const { send } = useWebSocket((msg) => {
    if (msg.type !== "rfid_search") return;

    const glassesID = msg.payload?.rfid;
    if (!glassesID) return;

    // 🛑 prevent duplicate ACK if multiple messages arrive
    if (ackSentRef.current) return;
    ackSentRef.current = true;

    // 1️⃣ Navigate
    navigate({
      to: "/eyeglasses/$glassesId",
      params: { glassesId: glassesID },
    });

    // 2️⃣ ACK backend
    send({ type: "search_ack" });
  });

  return null;
}
