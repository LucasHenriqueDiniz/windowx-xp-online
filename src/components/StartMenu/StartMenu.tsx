"use client";
import { useEffect, useRef } from "react";
import { systemSounds } from "../../../public/assets/audio";
import {
  ControlPanel,
  Display,
  HelpFile,
  InternetExplorer,
  LogOff,
  MyComputer,
  MyDocuments,
  MyMusic,
  MyPictures,
  OutlookExpress,
  RecentDocuments,
  Run,
  Search,
  ShutDown,
} from "../../../public/assets/icons";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Play start menu sound
      const audio = new Audio(systemSounds.startup);
      audio.play().catch((err) => console.log("Audio play error:", err));

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute left-0 bottom-10 w-72 bg-gradient-to-b from-[#095BDC] to-[#0048CA] rounded-tr-md overflow-hidden shadow-xl flex flex-col"
      style={{
        borderTop: "1px solid #3B9BFF",
        borderRight: "1px solid #3B9BFF",
      }}
    >
      {/* User section */}
      <div className="flex p-2 bg-gradient-to-r from-[#236DE5] to-[#235FDA] h-16">
        <div className="w-12 h-12 rounded-full bg-white mr-3"></div>
        <div className="text-white font-bold">User Name</div>
      </div>

      {/* Menu items section */}
      <div className="flex flex-1">
        {/* Main menu */}
        <div className="flex-1 bg-white p-1">
          <div className="divide-y divide-gray-200">
            {/* Programs section */}
            <div className="py-1">
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${InternetExplorer.src})` }}
                ></div>
                <span>Internet Explorer</span>
              </div>
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${OutlookExpress.src})` }}
                ></div>
                <span>Outlook Express</span>
              </div>
            </div>

            {/* System programs */}
            <div className="py-1">
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${MyDocuments.src})` }}
                ></div>
                <span>My Documents</span>
              </div>
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${RecentDocuments.src})` }}
                ></div>
                <span>My Recent Documents</span>
              </div>
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${MyPictures.src})` }}
                ></div>
                <span>My Pictures</span>
              </div>
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${MyMusic.src})` }}
                ></div>
                <span>My Music</span>
              </div>
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${MyComputer.src})` }}
                ></div>
                <span>My Computer</span>
              </div>
            </div>

            {/* Bottom section */}
            <div className="py-1">
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${ControlPanel.src})` }}
                ></div>
                <span>Control Panel</span>
              </div>
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${HelpFile.src})` }}
                ></div>
                <span>Help and Support</span>
              </div>
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${Search.src})` }}
                ></div>
                <span>Search</span>
              </div>
              <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer">
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${Run.src})` }}
                ></div>
                <span>Run...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-24 bg-[#D3E5FA] p-1">
          <div className="flex flex-col space-y-1">
            <div className="p-1 text-center text-xs font-bold text-[#124DB3]">All Programs</div>
            <div className="border-t border-[#A9C5EF] mt-1 mb-1"></div>

            <div className="flex flex-col items-center hover:bg-[#2F71CD] group cursor-pointer p-1">
              <div
                className="w-8 h-8 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${MyDocuments.src})` }}
              ></div>
              <span className="text-xs group-hover:text-white text-center">Documents</span>
            </div>

            <div className="flex flex-col items-center hover:bg-[#2F71CD] group cursor-pointer p-1">
              <div
                className="w-8 h-8 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${Display.src})` }}
              ></div>
              <span className="text-xs group-hover:text-white text-center">Settings</span>
            </div>

            <div className="flex flex-col items-center hover:bg-[#2F71CD] group cursor-pointer p-1">
              <div
                className="w-8 h-8 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${Search.src})` }}
              ></div>
              <span className="text-xs group-hover:text-white text-center">Search</span>
            </div>

            <div className="flex flex-col items-center hover:bg-[#2F71CD] group cursor-pointer p-1">
              <div
                className="w-8 h-8 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${HelpFile.src})` }}
              ></div>
              <span className="text-xs group-hover:text-white text-center">Help</span>
            </div>

            <div className="flex flex-col items-center hover:bg-[#2F71CD] group cursor-pointer p-1">
              <div
                className="w-8 h-8 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${Run.src})` }}
              ></div>
              <span className="text-xs group-hover:text-white text-center">Run</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="bg-[#C4CCE4] flex items-center p-1">
        <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white rounded cursor-pointer mr-auto">
          <div
            className="w-6 h-6 mr-1 bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${LogOff.src})` }}
          ></div>
          <span className="text-sm">Log Off</span>
        </div>

        <div className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white rounded cursor-pointer">
          <div
            className="w-6 h-6 mr-1 bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${ShutDown.src})` }}
          ></div>
          <span className="text-sm">Shut Down</span>
        </div>
      </div>
    </div>
  );
}
