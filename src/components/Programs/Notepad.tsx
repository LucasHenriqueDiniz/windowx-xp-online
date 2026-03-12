
"use client";
import React, { useState, useRef } from 'react';
import Window from '@/components/Window/Window';
import { WindowPropertiesProps } from '@/types/window-properties';

const Notepad: React.FC<WindowPropertiesProps> = (props) => {
  const [text, setText] = useState('');
  const [wordWrap, setWordWrap] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuItemClick = (action: string) => {
    switch (action) {
      case 'Exit':
        // This should be handled by the Window component's close button
        // but we can simulate a close request.
        // In a real scenario, you'd call a function passed via props to close the window.
        console.log("Exit clicked");
        break;
      case 'Word Wrap':
        setWordWrap(!wordWrap);
        break;
      case 'Time/Date':
        const dateTime = new Date().toLocaleString();
        const currentText = textAreaRef.current?.value || '';
        const selectionStart = textAreaRef.current?.selectionStart || 0;
        const selectionEnd = textAreaRef.current?.selectionEnd || 0;
        const newText = 
            currentText.substring(0, selectionStart) + 
            dateTime + 
            currentText.substring(selectionEnd);
        setText(newText);
        break;
      default:
        // For disabled items
        break;
    }
    setActiveMenu(null);
  };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = textAreaRef.current.selectionStart;
            const end = textAreaRef.current.selectionEnd;
            
            const newText = text.substring(0, start) + '\t' + text.substring(end);
            setText(newText);
            
            // Move cursor to after the tab
            setTimeout(() => {
                textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + 1;
            }, 0);
        }
    };

  const menuItems = {
    File: [
      { text: 'New', disabled: true },
      { text: 'Open...', disabled: true },
      { text: 'Save', disabled: true },
      { text: 'Save As...', disabled: true },
      { text: '---' },
      { text: 'Page Setup...', disabled: true },
      { text: 'Print...', disabled: true },
      { text: '---' },
      { text: 'Exit', action: 'Exit' },
    ],
    Edit: [
        { text: 'Undo', disabled: true },
        { text: '---' },
        { text: 'Cut', disabled: true },
        { text: 'Copy', disabled: true },
        { text: 'Paste', disabled: true },
        { text: 'Delete', disabled: true },
        { text: '---' },
        { text: 'Find...', disabled: true },
        { text: 'Find Next', disabled: true },
        { text: 'Replace...', disabled: true },
        { text: 'Go To...', disabled: true },
        { text: '---' },
        { text: 'Select All', disabled: true },
        { text: 'Time/Date', action: 'Time/Date' },
    ],
    Format: [
        { text: 'Word Wrap', action: 'Word Wrap', checked: wordWrap },
        { text: 'Font...', disabled: true },
    ],
    View: [
        { text: 'Status Bar', disabled: true },
    ],
    Help: [
        { text: 'Help Topics', disabled: true },
        { text: 'About Notepad', disabled: true },
    ],
  };

  return (
    <Window {...props} title="Untitled - Notepad" icon="/assets/icons/notepad.png">
      <div className="flex flex-col h-full bg-[#f0f0f0]">
        <div className="relative flex bg-[#f0f0f0] border-b border-gray-400 select-none">
          {Object.keys(menuItems).map((menu) => (
            <div key={menu} className="relative">
              <button
                onClick={() => handleMenuClick(menu)}
                className={`px-2 py-0.5 hover:bg-blue-600 hover:text-white ${activeMenu === menu ? 'bg-blue-600 text-white' : ''}`}>
                {menu}
              </button>
              {activeMenu === menu && (
                <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-400 shadow-lg py-1 z-10">
                  {menuItems[menu].map((item, index) => (
                    item.text === '---' ? (
                      <div key={index} className="border-t border-gray-300 my-1" />
                    ) : (
                      <button
                        key={index}
                        onClick={() => !item.disabled && handleMenuItemClick(item.action)}
                        className={`w-full text-left px-4 py-0.5 flex justify-between items-center ${item.disabled ? 'text-gray-400' : 'hover:bg-blue-600 hover:text-white'}`}>
                        <span>{item.text}</span>
                        {item.checked && <span className="text-xl">&#10003;</span>}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <textarea
          ref={textAreaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          className={`flex-grow w-full h-full p-1 outline-none resize-none font-['Lucida_Console',_monospace] text-xs ${wordWrap ? 'whitespace-normal' : 'whitespace-pre overflow-x-scroll'} overflow-y-scroll`}
        />
      </div>
    </Window>
  );
};

export default Notepad;
