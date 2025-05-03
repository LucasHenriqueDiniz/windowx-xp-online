"use client";
import React from "react";
import { ProgramDefinition } from "@/types/program-definitions";

interface StartMenuItemContextMenuProps {
  x: number;
  y: number;
  program: ProgramDefinition;
  isPinned: boolean;
  onPin: () => void;
  onUnpin: () => void;
  onRename: () => void;
  onOpen: () => void;
  onProperties: () => void;
  onClose: () => void;
}

export default function StartMenuItemContextMenu({
  x,
  y,
  program,
  isPinned,
  onPin,
  onUnpin,
  onRename,
  onOpen,
  onProperties,
  onClose,
}: StartMenuItemContextMenuProps) {
  // Adjust position if it would go offscreen
  const adjustPosition = (x: number, y: number) => {
    const menuWidth = 190;
    const menuHeight = 150;

    // Adjust horizontal position
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 5;
    }

    // Adjust vertical position
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 5;
    }

    return { x, y };
  };

  const { x: adjustedX, y: adjustedY } = adjustPosition(x, y);

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      <div
        className="fixed z-50 w-48 bg-white shadow-md rounded-sm border border-gray-300"
        style={{
          left: adjustedX,
          top: adjustedY,
          boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <div className="divide-y divide-gray-200">
          {/* Context menu header */}
          <div className="p-1 bg-[#0A246A] text-white font-semibold truncate text-sm">{program.name}</div>

          {/* Context menu items */}
          <div className="text-sm">
            <button
              className="w-full text-left px-2 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
              onClick={() => {
                onOpen();
                onClose();
              }}
            >
              <span className="mr-2">⏵</span> Open
            </button>

            {isPinned ? (
              <button
                className="w-full text-left px-2 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
                onClick={() => {
                  onUnpin();
                  onClose();
                }}
              >
                <span className="mr-2">⏵</span> Unpin from Start menu
              </button>
            ) : (
              <button
                className="w-full text-left px-2 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
                onClick={() => {
                  onPin();
                  onClose();
                }}
              >
                <span className="mr-2">⏵</span> Pin to Start menu
              </button>
            )}

            {!program.isSystem && (
              <button
                className="w-full text-left px-2 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
                onClick={() => {
                  onRename();
                  onClose();
                }}
              >
                <span className="mr-2">⏵</span> Rename
              </button>
            )}

            <button
              className="w-full text-left px-2 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
              onClick={() => {
                onProperties();
                onClose();
              }}
            >
              <span className="mr-2">⏵</span> Properties
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
