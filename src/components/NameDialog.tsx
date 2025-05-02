"use client";
import { useState, useEffect } from "react";
import { useCursor } from "@/context/CursorContext";

export default function NameDialog() {
  const { displayName, setDisplayName } = useCursor();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(displayName);

  // Also add a button in the system tray
  useEffect(() => {
    const systemTray = document.querySelector(".system-tray");
    if (!systemTray) return;

    const nameButton = document.createElement("button");
    nameButton.className = "system-tray-icon cursor-pointer flex items-center justify-center";
    nameButton.title = "Change Display Name";
    nameButton.innerHTML = `<div class="w-4 h-4 rounded-full" style="background-color: var(--xp-blue);"></div>`;
    nameButton.onclick = () => setIsOpen(true);

    systemTray.prepend(nameButton);

    return () => {
      nameButton.remove();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setDisplayName(name.trim());
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-[#ECE9D8] border-2 border-[#0A246A] rounded shadow-lg w-80">
        <div className="xp-window-title flex items-center p-1 text-sm">
          <span className="flex-1 font-bold">Change Your Display Name</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-[#f00]/80 h-5 w-5 flex items-center justify-center rounded"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4"
        >
          <p className="text-sm mb-3">Enter a display name for other users to see:</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 p-1 w-full mb-4"
            maxLength={20}
            placeholder="Your display name"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="xp-button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="xp-button"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
