"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedContact, setSelectedContact] = useState("Alice");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  // 📨 Fetch messages from your DB (via /api/messages/get)
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages/get");
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }

    fetchMessages();
  }, []);

  // ✉️ Send message via Twilio (using your /api/messages POST route)
  const handleSend = async () => {
    if (!input.trim()) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "+12295149079", // ✅ your verified Twilio number
        content: input,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMessages((prev) => [
        ...prev,
        { content: input, contact: { phone: "+12295149079" } },
      ]);
      setInput("");
    } else {
      alert("Failed to send message");
    }
  };

  // 🔒 Show login prompt if not logged in
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Please log in first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex text-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white/10 border-r border-white/20 p-5 space-y-4">
        <h2 className="text-xl font-bold mb-3">Contacts</h2>
        {["Alice", "Bob", "Charlie"].map((c) => (
          <div
            key={c}
            onClick={() => setSelectedContact(c)}
            className={`cursor-pointer p-2 rounded-lg ${
              selectedContact === c ? "bg-blue-600" : "hover:bg-blue-800"
            }`}
          >
            {c}
          </div>
        ))}
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col p-6">
        <h2 className="text-lg font-semibold mb-4">
          Chat with {selectedContact}
        </h2>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-white/5 p-4 rounded-lg border border-white/10">
          {messages.length === 0 && (
            <p className="text-gray-400">No messages yet.</p>
          )}
          {messages.map((msg, i) => (
            <p key={i} className="mb-2">
              <span className="font-semibold">
                {msg.contact?.phone || "Unknown"}:
              </span>{" "}
              {msg.content}
            </p>
          ))}
        </div>

        {/* Composer */}
        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="flex-1 p-2 rounded-lg bg-white/10 text-white border border-white/20"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
}
