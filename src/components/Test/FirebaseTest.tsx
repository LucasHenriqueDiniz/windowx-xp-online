"use client";
import { useEffect, useState } from "react";
import { database } from "../../../lib/firebase"; // Adjust the import path as necessary
import { ref, set, onValue } from "firebase/database";

export default function FirebaseTest() {
  const [message, setMessage] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const messageRef = ref(database, "test/message");

    // Listen for changes
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessage(data);
      }
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  const updateMessage = () => {
    const messageRef = ref(database, "test/message");
    set(messageRef, inputValue);
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-md text-gray-800">
      <h2 className="text-xl font-bold mb-4">Firebase Realtime Test</h2>
      <div className="mb-4">
        <p>
          Current message: <span className="font-semibold">{message || "No message yet"}</span>
        </p>
        <p className="text-gray-500">This message is fetched from Firebase Realtime Database.</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded"
          placeholder="Enter new message"
        />
        <button
          onClick={updateMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
}
