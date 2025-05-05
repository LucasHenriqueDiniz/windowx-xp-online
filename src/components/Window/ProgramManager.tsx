"use client";
import { useDesktop } from "@/context/DesktopContext";
import Calculator from "../Programs/Calculator";
import DisplayProperties from "../Programs/DisplayProperties";
import Paint from "../Programs/Paint";
import ErrorDialog from "../Programs/ErrorDialog";
import SystemRestore from "../Programs/SystemRestore";
import Notepad from "../Programs/Notepad";

export default function ProgramManager() {
  const { programs } = useDesktop();

  return (
    <>
      {programs.map((program) => {
        // Based on program type, render the appropriate component
        switch (program.type) {
          case "calculator":
            return (
              <Calculator
                key={program.id}
                id={program.id}
                isActive={program.zIndex === Math.max(...programs.map((p) => p.zIndex))}
                isMaximized={program.isMaximized || false}
                isMinimized={program.isMinimized || false}
                zIndex={program.zIndex}
                position={program.position}
                size={program.size}
              />
            );

          case "display-properties":
            return (
              <DisplayProperties
                key={program.id}
                id={program.id}
                isActive={program.zIndex === Math.max(...programs.map((p) => p.zIndex))}
                isMaximized={program.isMaximized || false}
                isMinimized={program.isMinimized || false}
                zIndex={program.zIndex}
                position={program.position}
                size={program.size}
              />
            );

          case "paint":
            return (
              <Paint
                key={program.id}
                id={program.id}
                isActive={program.zIndex === Math.max(...programs.map((p) => p.zIndex))}
                isMaximized={program.isMaximized || false}
                isMinimized={program.isMinimized || false}
                zIndex={program.zIndex}
                position={program.position}
                size={program.size}
                props={program.props || {}}
              />
            );

          case "notepad":
            return (
              <Notepad
                key={program.id}
                id={program.id}
                isActive={program.zIndex === Math.max(...programs.map((p) => p.zIndex))}
                isMaximized={program.isMaximized || false}
                isMinimized={program.isMinimized || false}
                zIndex={program.zIndex}
                position={program.position}
                size={program.size}
                props={program.props || {}}
              />
            );

          case "system-restore":
            return (
              <SystemRestore
                key={program.id}
                id={program.id}
                isActive={program.zIndex === Math.max(...programs.map((p) => p.zIndex))}
                isMaximized={program.isMaximized || false}
                isMinimized={program.isMinimized || false}
                zIndex={program.zIndex}
                position={program.position}
                size={program.size}
              />
            );

          case "error-dialog":
            return (
              <ErrorDialog
                key={program.id}
                id={program.id}
                message={program.props?.message || "An error has occurred."}
                title={program.props?.title || "Error"}
                icon={program.props?.icon || ErrorDialog}
                isActive={program.zIndex === Math.max(...programs.map((p) => p.zIndex))}
                isMaximized={program.isMaximized || false}
                isMinimized={program.isMinimized || false}
                zIndex={program.zIndex}
              />
            );

          // Add cases for other program types as they're implemented

          default:
            return null;
        }
      })}
    </>
  );
}
