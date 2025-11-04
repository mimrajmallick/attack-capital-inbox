// components/ChatClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Contact, Message } from '@prisma/client';

// Define the type for our conversation prop
type ConversationWithMessages = Contact & {
  messages: Message[];
};

export default function ChatClient({
  conversation,
}: {
  conversation: ConversationWithMessages;
}) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || isSending) return;

    setIsSending(true);

    // Get the channel from the last message, or default to SMS
    const channel =
      conversation.messages[conversation.messages.length - 1]?.channel || 'SMS';

    try {
      await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: conversation.id,
          content: message,
          channel: channel,
        }),
      });

      setMessage(''); // Clear the input
      router.refresh(); // Refresh the page to show the new message
    } catch (error) {
      console.error('Failed to send message', error);
      alert('Error: Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b bg-white shadow-sm">
        <h2 className="text-xl font-semibold">{conversation.name}</h2>
        <p className="text-sm text-gray-500">{conversation.phone}</p>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-sm ${
                msg.direction === 'OUTBOUND'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.channel}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSending}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}