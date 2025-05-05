"use client";
import { useDesktop } from "@/context/DesktopContext";
import { WindowPropertiesProps } from "@/types/window-properties";
import { useState, useEffect } from "react";
import Window from "../Window";

interface NotepadProps extends WindowPropertiesProps {
  props?: {
    content?: string;
    fileName?: string;
  };
}

export default function Notepad({ id, isActive, isMaximized, isMinimized, zIndex, position, size, props }: NotepadProps) {
  const { updateProgramProps } = useDesktop();
  const [content, setContent] = useState(props?.content || "");
  const [fileName, setFileName] = useState(props?.fileName || "Untitled");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [lineCount, setLineCount] = useState(1);
  const [columnCount, setColumnCount] = useState(1);

  // Sync content with props when they change
  useEffect(() => {
    if (props?.content !== undefined && props.content !== content) {
      setContent(props.content);
    }
    if (props?.fileName !== undefined && props.fileName !== fileName) {
      setFileName(props.fileName);
    }
  }, [props, content, fileName]);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setUnsavedChanges(true);

    // Update line and column count
    const lines = newContent.split("\n");
    setLineCount(lines.length);

    // Get cursor position
    const cursorPosition = e.target.selectionStart;

    // Calculate column
    let column = 0;
    let currentPos = 0;

    for (const line of lines) {
      const lineLength = line.length + 1; // +1 for the newline character
      if (currentPos + lineLength > cursorPosition) {
        column = cursorPosition - currentPos + 1;
        break;
      }
      currentPos += lineLength;
    }

    setColumnCount(column);

    // Sync with other users by updating props
    updateProgramProps(id, {
      ...props,
      content: newContent,
      fileName,
    });
  };

  // Clear document
  const handleNew = () => {
    if (unsavedChanges) {
      if (window.confirm("Do you want to save changes to " + fileName + "?")) {
        // For demonstration, we'll just clear without saving
      }
    }
    setContent("");
    setFileName("Untitled");
    setUnsavedChanges(false);

    // Sync with other users
    updateProgramProps(id, {
      ...props,
      content: "",
      fileName: "Untitled",
    });
  };

  // Simulate opening a file - in a real app, this would use a file dialog
  const handleOpen = () => {
    if (unsavedChanges) {
      if (!window.confirm("Do you want to save changes to " + fileName + "?")) {
        return;
      }
    }

    // Simulate opening a sample file
    const sampleFileName = "ReadMe.txt";
    const sampleContent =
      "This is a sample readme file for the Windows XP Notepad.\n\nYou can edit this text, and it will be synchronized across all connected users!";

    setContent(sampleContent);
    setFileName(sampleFileName);
    setUnsavedChanges(false);

    // Sync with other users
    updateProgramProps(id, {
      ...props,
      content: sampleContent,
      fileName: sampleFileName,
    });
  };

  // Simulate saving a file - in a real app, this would use a file dialog
  const handleSave = () => {
    // In a real application, this would open a save dialog
    // For now, we'll just mark the file as saved
    setUnsavedChanges(false);
    alert("File saved: " + fileName);
  };

  // Toggle word wrap
  const toggleWordWrap = () => {
    setWordWrap(!wordWrap);
  };

  // Toggle status bar
  const toggleStatusBar = () => {
    setShowStatusBar(!showStatusBar);
  };

  // Function to get cursor position information
  const handleCursorPosition = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const lines = textBeforeCursor.split("\n");

    setLineCount(lines.length);
    setColumnCount(lines[lines.length - 1].length + 1);
  };

  return (
    <Window
      id={id}
      title={`${fileName}${unsavedChanges ? " *" : ""} - Notepad`}
      icon="/assets/icons/notepad.png"
      isActive={isActive}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
      zIndex={zIndex}
      initialPosition={position || { x: 120, y: 120 }}
      initialSize={size || { width: 600, height: 400 }}
      minWidth={300}
      minHeight={200}
    >
      <div className="flex flex-col h-full bg-[#ECE9D8]">
        {/* Menu Bar */}
        <div className="flex text-xs border-b border-gray-400 bg-[#ECE9D8]">
          <div className="relative group">
            <button className="px-2 py-1 hover:bg-[#B8C7E0]">File</button>
            <div className="absolute hidden group-hover:block z-10 bg-[#ECE9D8] border border-gray-400 shadow-md min-w-[180px]">
              <button
                onClick={handleNew}
                className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center"
              >
                <span className="mr-2">New</span>
                <span className="ml-auto text-gray-500">Ctrl+N</span>
              </button>
              <button
                onClick={handleOpen}
                className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center"
              >
                <span className="mr-2">Open...</span>
                <span className="ml-auto text-gray-500">Ctrl+O</span>
              </button>
              <button
                onClick={handleSave}
                className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center"
              >
                <span className="mr-2">Save</span>
                <span className="ml-auto text-gray-500">Ctrl+S</span>
              </button>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0]">Save As...</button>
              <div className="border-t border-gray-400 my-1"></div>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0]">Page Setup...</button>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0]">Print...</button>
              <div className="border-t border-gray-400 my-1"></div>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0]">Exit</button>
            </div>
          </div>

          <div className="relative group">
            <button className="px-2 py-1 hover:bg-[#B8C7E0]">Edit</button>
            <div className="absolute hidden group-hover:block z-10 bg-[#ECE9D8] border border-gray-400 shadow-md min-w-[180px]">
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center">
                <span className="mr-2">Undo</span>
                <span className="ml-auto text-gray-500">Ctrl+Z</span>
              </button>
              <div className="border-t border-gray-400 my-1"></div>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center">
                <span className="mr-2">Cut</span>
                <span className="ml-auto text-gray-500">Ctrl+X</span>
              </button>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center">
                <span className="mr-2">Copy</span>
                <span className="ml-auto text-gray-500">Ctrl+C</span>
              </button>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center">
                <span className="mr-2">Paste</span>
                <span className="ml-auto text-gray-500">Ctrl+V</span>
              </button>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center">
                <span className="mr-2">Delete</span>
                <span className="ml-auto text-gray-500">Del</span>
              </button>
              <div className="border-t border-gray-400 my-1"></div>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center">
                <span className="mr-2">Select All</span>
                <span className="ml-auto text-gray-500">Ctrl+A</span>
              </button>
            </div>
          </div>

          <div className="relative group">
            <button className="px-2 py-1 hover:bg-[#B8C7E0]">Format</button>
            <div className="absolute hidden group-hover:block z-10 bg-[#ECE9D8] border border-gray-400 shadow-md min-w-[180px]">
              <button
                onClick={toggleWordWrap}
                className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center"
              >
                <span className="mr-2">Word Wrap</span>
                {wordWrap && <span className="ml-auto">✓</span>}
              </button>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0]">Font...</button>
            </div>
          </div>

          <div className="relative group">
            <button className="px-2 py-1 hover:bg-[#B8C7E0]">View</button>
            <div className="absolute hidden group-hover:block z-10 bg-[#ECE9D8] border border-gray-400 shadow-md min-w-[180px]">
              <button
                onClick={toggleStatusBar}
                className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0] flex items-center"
              >
                <span className="mr-2">Status Bar</span>
                {showStatusBar && <span className="ml-auto">✓</span>}
              </button>
            </div>
          </div>

          <div className="relative group">
            <button className="px-2 py-1 hover:bg-[#B8C7E0]">Help</button>
            <div className="absolute hidden group-hover:block z-10 bg-[#ECE9D8] border border-gray-400 shadow-md min-w-[180px]">
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0]">Help Topics</button>
              <div className="border-t border-gray-400 my-1"></div>
              <button className="w-full px-4 py-1 text-left hover:bg-[#B8C7E0]">About Notepad</button>
            </div>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          className="flex-grow p-1 bg-white font-mono text-sm focus:outline-none resize-none"
          style={{
            whiteSpace: wordWrap ? "normal" : "pre",
            overflowWrap: wordWrap ? "break-word" : "normal",
          }}
          value={content}
          onChange={handleContentChange}
          onClick={handleCursorPosition}
          onKeyUp={handleCursorPosition}
        />

        {/* Status Bar */}
        {showStatusBar && (
          <div className="flex text-xs p-1 border-t border-gray-400 bg-[#ECE9D8]">
            <div className="flex-grow">
              Ln {lineCount}, Col {columnCount}
            </div>
            {unsavedChanges && <div className="text-right">Modified</div>}
          </div>
        )}
      </div>
    </Window>
  );
}
