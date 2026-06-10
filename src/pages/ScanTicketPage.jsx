import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ScanTicketPage() {
  const { barcode } = useParams();
  const [status, setStatus] = useState("scanning");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .post("/scan-ticket", { barcode })
      .then(() => {
        setStatus("success");
        setMessage("Ticket validated!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Invalid ticket.");
      });
  }, [barcode]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 80,
        fontFamily: "sans-serif",
        background: "#0F172A",
        minHeight: "100vh",
        paddingTop: 80,
      }}
    >
      {status === "scanning" && (
        <p style={{ color: "#fff" }}>Validating ticket...</p>
      )}
      {status === "success" && (
        <h2 style={{ color: "#22C55E" }}>✅ {message}</h2>
      )}
      {status === "error" && <h2 style={{ color: "#EF4444" }}>❌ {message}</h2>}
    </div>
  );
}
