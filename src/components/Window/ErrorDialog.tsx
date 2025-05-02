import React from "react";
import { useDesktop } from "@/context/DesktopContext";
import Window from "./Window";

interface ErrorDialogProps {
  id: string;
  message: string;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ id, message }) => {
  const { closeProgram } = useDesktop();

  const handleClose = () => {
    closeProgram(id, false);
  };

  return (
    <Window
      id={id}
      defaultWidth={350}
      defaultHeight={150}
      title="System Error"
      iconPath="/assets/icons/Windows XP Error.png"
      onClose={handleClose}
      resizable={false}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center flex-1 mb-4">
          <img
            src="/assets/icons/Windows XP Error.png"
            alt="Error"
            className="w-12 h-12 mr-3"
          />
          <div className="text-sm">{message}</div>
        </div>
        <div className="flex justify-center">
          <button
            className="px-4 py-1 bg-[#ececec] border border-gray-400 rounded hover:bg-[#e5e5e5] active:bg-[#d9d9d9] text-sm"
            onClick={handleClose}
          >
            OK
          </button>
        </div>
      </div>
    </Window>
  );
};

export default ErrorDialog;
