import { useDesktop } from "@/context/DesktopContext";
import { ProgramId } from "@/types/program-definitions";

export const useProgramManager = () => {
  const { openProgram, focusProgram } = useDesktop();

  const launchProgram = (programId: ProgramId) => {
    openProgram(programId);
  };

  const activateProgram = (id: string) => {
    focusProgram(id);
  };

  return { launchProgram, activateProgram };
};
