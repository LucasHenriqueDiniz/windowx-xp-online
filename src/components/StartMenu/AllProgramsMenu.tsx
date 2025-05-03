"use client";
import React, { useState, useEffect, useRef } from "react";
import { useStartMenu } from "@/context/StartMenuContext";
import { ProgramFolder } from "@/types/program-definitions";
import { FolderOpen, Folder, None } from "../../../public/assets/icons";

interface AllProgramsMenuProps {
  onSelectProgram: (programId: string) => void;
  position: { top: number; left: number };
}

export default function AllProgramsMenu({ onSelectProgram, position }: AllProgramsMenuProps) {
  const { allProgramsStructure, getProgramInfo } = useStartMenu();
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [openFolderPosition, setOpenFolderPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const folderMenuRef = useRef<HTMLDivElement>(null);

  // Adjust menu position if it would go offscreen
  const adjustedPosition = (() => {
    let { top, left } = position;

    if (typeof window !== "undefined") {
      // Check menu width and height
      const menuWidth = 240; // Approximate width of the menu
      const menuHeight = Math.min(500, allProgramsStructure.items.length * 30 + allProgramsStructure.folders.length * 30 + 20);

      // Adjust horizontal position if it would go off right side
      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 5;
      }

      // Adjust vertical position if it would go off bottom
      if (top + menuHeight > window.innerHeight) {
        // If the menu would go off the bottom of the screen,
        // position it so the bottom of the menu is at the bottom of the screen
        top = window.innerHeight - menuHeight - 5;
      }

      // Make sure it's not positioned off the top
      if (top < 0) {
        top = 0;
      }
    }

    return { top, left };
  })();

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        folderMenuRef.current &&
        !folderMenuRef.current.contains(event.target as Node)
      ) {
        setOpenFolder(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFolderMouseEnter = (folderId: string, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    // Calculate position for folder submenu
    let folderLeft = rect.right + 2;
    let folderTop = rect.top;

    // Check if submenu would go off right edge of screen
    if (folderLeft + 240 > window.innerWidth) {
      folderLeft = rect.left - 242; // Position to the left of the folder
    }

    // Check if submenu would go off bottom of screen
    const estimatedHeight = 300; // Approximate max height
    if (folderTop + estimatedHeight > window.innerHeight) {
      folderTop = window.innerHeight - estimatedHeight - 5;
    }

    // Make sure it's not positioned off the top
    if (folderTop < 0) {
      folderTop = 0;
    }

    setOpenFolderPosition({
      top: folderTop,
      left: folderLeft,
    });

    setOpenFolder(folderId);
  };

  const renderItems = (items: (string | ProgramFolder)[]) => {
    return items.map((item, index) => {
      if (typeof item === "string") {
        // It's a program ID
        const program = getProgramInfo(item);
        if (!program) return null;

        return (
          <div
            key={program.id}
            className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer"
            onClick={() => onSelectProgram(program.id)}
            title={program.description}
          >
            <div
              className="w-6 h-6 mr-2 bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url(${program.icon})` }}
            ></div>
            <span className="text-sm">{program.name}</span>
          </div>
        );
      } else {
        // It's a folder
        return (
          <div
            key={item.id}
            className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer"
            onMouseEnter={(e) => handleFolderMouseEnter(item.id, e)}
          >
            <div
              className="w-6 h-6 mr-2 bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url(${item.icon || Folder.src})` }}
            ></div>
            <span className="text-sm">{item.name}</span>
            <span className="ml-auto">▶</span>
          </div>
        );
      }
    });
  };

  // Find the opened folder from the structure
  const findFolder = (folderId: string, structure: ProgramFolder[]): ProgramFolder | null => {
    for (const folder of structure) {
      if (folder.id === folderId) {
        return folder;
      }

      // Check nested folders
      for (const item of folder.items) {
        if (typeof item !== "string" && item.id === folderId) {
          return item;
        }

        // Recursively check deeper if it's a folder
        if (typeof item !== "string") {
          const found = findFolder(folderId, [item]);
          if (found) return found;
        }
      }
    }
    return null;
  };

  // Get the contents of the opened folder
  const openFolderContent = openFolder ? findFolder(openFolder, allProgramsStructure.folders) : null;

  return (
    <>
      {/* Main All Programs menu */}
      <div
        ref={menuRef}
        className="fixed z-50 w-64 bg-white shadow-md border border-gray-400 rounded-tr-sm"
        style={{
          top: adjustedPosition.top,
          left: adjustedPosition.left,
          boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        <div className="overflow-y-auto">
          {/* Show top-level items */}
          {renderItems(allProgramsStructure.items)}

          {/* Divider if there are both items and folders */}
          {allProgramsStructure.items.length > 0 && allProgramsStructure.folders.length > 0 && <div className="border-t border-gray-200 my-1"></div>}

          {/* Show folders */}
          {renderItems(allProgramsStructure.folders)}

          {/* Empty state */}
          {allProgramsStructure.items.length === 0 && allProgramsStructure.folders.length === 0 && (
            <div className="flex flex-col items-center justify-center p-4 text-gray-500">
              <div
                className="w-10 h-10 mb-2 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${None.src})` }}
              ></div>
              <span className="text-sm">No items found</span>
            </div>
          )}
        </div>
      </div>

      {/* Folder submenu (only shown when a folder is hovered) */}
      {openFolder && openFolderContent && (
        <div
          ref={folderMenuRef}
          className="fixed z-50 w-64 bg-white shadow-md border border-gray-400 rounded-tr-sm"
          style={{
            top: openFolderPosition.top,
            left: openFolderPosition.left,
            boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          <div className="overflow-y-auto">
            {/* Folder header */}
            <div className="p-1 bg-gradient-to-r from-[#236DE5] to-[#235FDA] text-white font-semibold flex items-center">
              <div
                className="w-5 h-5 mr-2 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${FolderOpen.src})` }}
              ></div>
              <span className="text-sm">{openFolderContent.name}</span>
            </div>

            {/* Folder contents */}
            {openFolderContent.items.length > 0 ? (
              renderItems(openFolderContent.items)
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                <div
                  className="w-10 h-10 mb-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${None.src})` }}
                ></div>
                <span className="text-sm">Empty folder</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
