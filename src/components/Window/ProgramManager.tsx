"use client";
import { useDesktop } from "@/context/DesktopContext";
import Calculator from "./Calculator";
import DisplayProperties from "./DisplayProperties";

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

          // Add cases for other program types as they're implemented

          default:
            return null;
        }
      })}
    </>
  );
}
