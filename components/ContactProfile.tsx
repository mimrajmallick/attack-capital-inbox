"use client";

import { useState } from "react";
import { Contact, Note } from "@prisma/client";

interface ContactProfileProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactProfile({
  contact,
  isOpen,
  onClose,
}: ContactProfileProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "notes">("timeline");

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        isPrivate,
        contactId: contact.id,
        createdAt: new Date(),
      };
      setNotes([note, ...notes]);
      setNewNote("");
      setIsPrivate(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{contact.name}</h2>
            <p className="text-gray-400">{contact.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex px-6">
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "timeline"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "notes"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("notes")}
            >
              Notes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <div className="text-center text-gray-400 py-8">
                Message history will appear here
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              {/* Add Note */}
              <div className="bg-gray-700 rounded-lg p-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this contact..."
                  className="w-full bg-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center space-x-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded bg-gray-600 border-gray-500"
                    />
                    <span>Private note</span>
                  </label>
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg ${
                      note.isPrivate ? "bg-purple-900 bg-opacity-30" : "bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                      {note.isPrivate && (
                        <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-white">{note.content}</p>
                  </div>
                ))}

                {notes.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No notes yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 px-6 py-4 flex space-x-3">
          <button className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium transition-colors">
            📞 Call
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium transition-colors">
            💬 Message
          </button>
        </div>
      </div>
    </div>
  );
}