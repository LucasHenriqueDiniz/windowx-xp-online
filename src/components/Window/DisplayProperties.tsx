"use client";
import { useState, useEffect } from "react";
import Window from "../Window";
import { useDesktop } from "@/context/DesktopContext";
import { AVAILABLE_WALLPAPERS, DefaultWallpaper } from "../../../public/assets/wallpapers";
import { WindowPropertiesProps } from "@/types/window-properties";
import { Display } from "../../../public/assets/icons";
import { WindowsXpPreview, WindowsClassicPreview, DisplayComputer } from "../../../public/assets/display";
import Image from "next/image";

export default function DisplayProperties({ id, isActive, isMaximized, isMinimized, zIndex, position, size, props }: WindowPropertiesProps) {
  const { wallpaper, setWallpaper, updateProgramProps } = useDesktop();
  const [currentTab, setCurrentTab] = useState<"themes" | "desktop" | "screensaver" | "appearance" | "settings">("desktop");
  const [selectedTheme, setSelectedTheme] = useState("Windows XP");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState(
    props?.selectedWallpaper || AVAILABLE_WALLPAPERS.find((wp) => wp.path === wallpaper)?.path || DefaultWallpaper.src
  );

  // Sync local state with props from context
  useEffect(() => {
    if (props?.selectedWallpaper && props.selectedWallpaper !== selectedWallpaper) {
      setSelectedWallpaper(props.selectedWallpaper);
      setHasUnsavedChanges(true);
    }
    if (props?.selectedTheme && props.selectedTheme !== selectedTheme) {
      setSelectedTheme(props.selectedTheme);
      setHasUnsavedChanges(true);
    }
  }, [props?.selectedWallpaper, props?.selectedTheme, selectedWallpaper, selectedTheme]);

  // Update synchronized preview when user selects a wallpaper
  const handleWallpaperSelect = (wallpaperPath: string) => {
    setSelectedWallpaper(wallpaperPath);
    // Sync to all users
    updateProgramProps(id, { ...props, selectedWallpaper: wallpaperPath });
  };

  const handleThemeSelect = (theme: string) => {
    if (theme !== selectedTheme) {
      if (theme !== "Windows XP" && theme !== "Windows Classic") {
        throw new Error("Invalid theme selected");
      }
      setSelectedTheme(theme);
      // Sync to all users
      updateProgramProps(id, { ...props, selectedTheme: theme });
    }
  };

  const handleApply = () => {
    if (currentTab === "desktop") {
      setWallpaper(selectedWallpaper);
      setHasUnsavedChanges(false);
    }
  };

  return (
    <Window
      id={id}
      title="Display Properties"
      icon={Display.src}
      isActive={isActive}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
      zIndex={zIndex}
      initialPosition={position || { x: 100, y: 100 }}
      initialSize={size || { width: 400, height: 450 }}
      minWidth={400}
      minHeight={450}
      resizable={true}
    >
      <div className="flex flex-col h-full p-2 box-shadow">
        {/* Tabs */}
        <div className="flex border-b border-gray-400">
          <TabButton
            isActive={currentTab === "themes"}
            onClick={() => setCurrentTab("themes")}
            label="Themes"
          />
          <TabButton
            isActive={currentTab === "desktop"}
            onClick={() => setCurrentTab("desktop")}
            label="Desktop"
          />
          <TabButton
            isActive={currentTab === "screensaver"}
            onClick={() => setCurrentTab("screensaver")}
            label="Screen Saver"
          />
          <TabButton
            isActive={currentTab === "appearance"}
            onClick={() => setCurrentTab("appearance")}
            label="Appearance"
          />
          <TabButton
            isActive={currentTab === "settings"}
            onClick={() => setCurrentTab("settings")}
            label="Settings"
          />
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-auto bg-white">
          {currentTab === "themes" && (
            <div className="flex flex-col">
              <p className="text-sm mb-4">
                A theme is a background plus a set of sounds, icons, and other elements to help you personalize your computer with one click.
              </p>
              <label className="text-sm mr-2 w-20">Theme:</label>
              <div className="flex items-center mb-2 gap-2">
                <select
                  className="border border-gray-400 text-sm p-1 flex-1"
                  onChange={(e) => handleThemeSelect(e.target.value)}
                  value={selectedTheme}
                >
                  <option>Windows XP</option>
                  <option>Windows Classic</option>
                </select>
                <label className="xp-button text-sm mr-2 w-20">Save As...</label>
                <button className="xp-button text-sm">Browse...</button>
              </div>
              <h4 className="mb-2">Sample</h4>
              <div className="flex items-center mb-2 gap-2 w-full">
                <Image
                  src={selectedTheme === "Windows XP" ? WindowsXpPreview.src : WindowsClassicPreview.src}
                  alt="Theme Preview"
                  width={100}
                  height={100}
                  className="w-full border border-gray-400 shadow-sm"
                />
              </div>
            </div>
          )}

          {currentTab === "desktop" && (
            <div className="flex flex-col">
              <div className="flex justify-center mt-2 mb-4">
                <div className="relative">
                  {/* Wallpaper background positioned behind the monitor */}
                  <div
                    className="absolute top-[18px] left-[5px] w-[240px] h-[150px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedWallpaper})` }}
                  ></div>
                  {/* Computer monitor image overlaid on top */}
                  <Image
                    src={DisplayComputer.src}
                    alt="Display"
                    width={200}
                    height={150}
                    className="w-64 relative z-10"
                  />
                </div>
              </div>

              <label className="text-sm">Background:</label>
              <div className="flex gap-4 mt-2">
                <div className="flex-1">
                  <div className="h-32 overflow-y-auto border border-gray-400 p-1 mb-2">
                    <div className="flex flex-col">
                      {AVAILABLE_WALLPAPERS.map((wallpaper) => (
                        <div
                          key={wallpaper.path}
                          className={`cursor-pointer flex items-center px-1 py-0.5 ${selectedWallpaper === wallpaper.path ? "bg-[#316AC5] text-white" : ""}`}
                          onClick={() => handleWallpaperSelect(wallpaper.path)}
                        >
                          <div
                            className="w-4 h-4 mr-2 bg-cover bg-center border border-gray-400"
                            style={{ backgroundImage: `url(${wallpaper.path})` }}
                          ></div>
                          <div className="text-xs truncate">{wallpaper.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="xp-button text-sm">Browse...</button>
                  <label className="text-sm block mb-1">Position:</label>
                  <select className="border border-gray-400 text-sm p-1 w-full">
                    <option>Stretch</option>
                    <option>Center</option>
                    <option>Tile</option>
                  </select>

                  <label className="text-sm block mb-1">Color:</label>
                  <div className="flex items-center">
                    <select className="border border-gray-400 text-sm p-1 ml-2 w-full">
                      <option className="w-6 h-6 bg-blue-800 border border-gray-400"></option>
                      <option>Other...</option>
                    </select>
                  </div>
                </div>
              </div>
              <button className="xp-button text-sm">Customize Desktop...</button>
            </div>
          )}

          {currentTab === "screensaver" && (
            <div className="flex flex-col">
              <h3 className="font-bold mb-2">Screen Saver</h3>
              <p className="text-sm mb-4">A screen saver is a picture or animation that covers your screen when you're not using your computer.</p>

              <div className="border border-gray-400 p-2 mb-4 bg-black h-32 flex justify-center items-center">
                <p className="text-sm text-gray-500 text-white">Screen saver preview</p>
              </div>

              <div className="flex items-center mb-2">
                <label className="text-sm mr-2 w-20">Screen saver:</label>
                <select className="border border-gray-400 text-sm p-1 flex-1">
                  <option>(None)</option>
                  <option>Windows XP</option>
                  <option>Mystify</option>
                  <option>Ribbons</option>
                  <option>Beziers</option>
                </select>
                <button className="xp-button text-sm ml-2">Settings...</button>
                <button className="xp-button text-sm ml-2">Preview</button>
              </div>

              <div className="flex items-center mb-2">
                <label className="text-sm mr-2 w-20">Wait:</label>
                <input
                  type="number"
                  className="border border-gray-400 text-sm p-1 w-16"
                  defaultValue={10}
                />
                <span className="text-sm ml-2">minutes</span>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="password-protect"
                  className="mr-2"
                />
                <label
                  htmlFor="password-protect"
                  className="text-sm"
                >
                  On resume, password protect
                </label>
                <button className="xp-button text-sm ml-auto">Power...</button>
              </div>
            </div>
          )}

          {currentTab === "appearance" && (
            <div className="flex flex-col">
              <h3 className="font-bold mb-2">Appearance</h3>
              <p className="text-sm mb-4">You can change the way windows, buttons, and other elements look.</p>

              <div className="border border-gray-400 p-2 mb-4 bg-white h-32 flex justify-center items-center">
                <div className="windows-xp-sample bg-[#ECE9D8] border border-gray-400 w-40 h-24 relative">
                  <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-r from-[#2A6AFF] to-[#0149E3] flex items-center px-1">
                    <span className="text-xs text-white">Window</span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <button className="xp-button text-xs py-0 px-1">OK</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-2">
                <label className="text-sm mr-2 w-20">Windows and buttons:</label>
                <select className="border border-gray-400 text-sm p-1 flex-1">
                  <option>Windows XP style</option>
                  <option>Windows Classic style</option>
                </select>
              </div>

              <div className="flex items-center mb-2">
                <label className="text-sm mr-2 w-20">Color scheme:</label>
                <select className="border border-gray-400 text-sm p-1 flex-1">
                  <option>Default (blue)</option>
                  <option>Olive Green</option>
                  <option>Silver</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="text-sm mr-2 w-20">Font size:</label>
                <select className="border border-gray-400 text-sm p-1 flex-1">
                  <option>Normal</option>
                  <option>Large</option>
                  <option>Extra Large</option>
                </select>
                <button className="xp-button text-sm ml-2">Effects...</button>
                <button className="xp-button text-sm ml-2">Advanced</button>
              </div>
            </div>
          )}

          {currentTab === "settings" && (
            <div className="flex flex-col">
              <h3 className="font-bold mb-2">Settings</h3>
              <p className="text-sm mb-4">You can adjust display settings for your monitor.</p>

              <div className="border border-gray-400 p-2 mb-4 bg-white h-32 flex justify-center items-center">
                <div className="flex items-center">
                  <div className="mr-4">
                    <img
                      src="/assets/icons/display.png"
                      className="w-16 h-16"
                      alt="Monitor"
                    />
                  </div>
                  <div className="text-xs">
                    <p>1. Monitor</p>
                    <p className="text-gray-500">Default Monitor on NVIDIA GeForce</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mb-2">
                <label className="text-sm font-bold mb-1">Display:</label>
                <select className="border border-gray-400 text-sm p-1 w-full">
                  <option>Default Monitor on NVIDIA GeForce</option>
                </select>
              </div>

              <div className="flex items-center mb-2">
                <button className="xp-button text-sm">Identify</button>
                <button className="xp-button text-sm ml-2">Properties</button>
              </div>

              <div className="flex flex-col mb-2">
                <label className="text-sm font-bold mb-1">Screen resolution:</label>
                <div className="flex items-center">
                  <span className="text-xs mr-2">Less</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="70"
                    className="flex-1"
                  />
                  <span className="text-xs ml-2">More</span>
                </div>
                <span className="text-xs text-right mt-1">1024 by 768 pixels</span>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold mb-1">Color quality:</label>
                <select className="border border-gray-400 text-sm p-1 w-full">
                  <option>Highest (32 bit)</option>
                  <option>Medium (16 bit)</option>
                  <option>Lowest (8 bit)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#F0F0F0] border-t border-gray-400 flex justify-end space-x-2">
          <button className="xp-button">OK</button>
          <button className="xp-button">Cancel</button>
          <button
            className="xp-button"
            onClick={handleApply}
            disabled={!hasUnsavedChanges}
          >
            Apply
          </button>
        </div>
      </div>
    </Window>
  );
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

function TabButton({ isActive, onClick, label }: TabButtonProps) {
  return (
    <button
      className={`flex flex-col items-center py-1 px-3 text-xs focus:outline-none border-t-4  ${
        isActive ? "bg-white border-l border-r border-b-white border-gray-400 -mb-px z-10 border-t-[#F4D279]" : "border-b border-transparent"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
