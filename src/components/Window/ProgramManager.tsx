"use client";
import { useDesktop } from "@/context/DesktopContext";
import { programComponentMap } from "@/lib/program-library";
import { Suspense } from "react";

export default function ProgramManager() {
  const { desktopState } = useDesktop();
  const { programs } = desktopState;

  // Find the highest z-index to determine which window is active
  const maxZIndex = programs.length > 0 ? Math.max(...programs.map((p) => p.zIndex)) : 0;

  return (
    <>
      {programs.map((program) => {
        // Dynamically get the component from the map
        const ProgramComponent = programComponentMap[program.type];

        if (!ProgramComponent) {
          console.warn(`No component found for program type: ${program.type}`);
          // Optionally render a placeholder or error component
          return null;
        }

        const commonProps = {
          id: program.id,
          isActive: program.zIndex === maxZIndex,
          isMaximized: program.isMaximized || false,
          isMinimized: program.isMinimized || false,
          zIndex: program.zIndex,
          position: program.position,
          size: program.size,
          title: program.title,
          icon: program.icon,
          props: program.props,
        };

        // Special handling for ErrorDialog props
        if (program.type === "error-dialog") {
          return (
            <Suspense key={program.id} fallback={<div>Loading...</div>}> {/* Suspense for lazy component */}
              <ProgramComponent
                {...commonProps}
                message={program.props?.message || "An error has occurred."}
              />
            </Suspense>
          );
        }

        return (
          <Suspense key={program.id} fallback={<div>Loading...</div>}> {/* Suspense for lazy component */}
            <ProgramComponent {...commonProps} />
          </Suspense>
        );
      })}
    </>
  );
}
