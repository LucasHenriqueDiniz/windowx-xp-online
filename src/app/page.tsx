import { DesktopProvider } from "@/context/DesktopContext";
import Desktop from "@/components/Desktop/Desktop";
import Taskbar from "@/components/Taskbar/Taskbar";
import DatabaseInitializer from "@/components/DatabaseInitializer";
import CursorOverlay from "@/components/CursorOverlay";
import NameDialog from "@/components/NameDialog";

export default function Home() {
  return (
    <DesktopProvider>
      <div className="flex flex-col h-screen">
        <DatabaseInitializer />
        <div className="flex-grow relative">
          <Desktop />
        </div>
        <Taskbar />
        <CursorOverlay />
        <NameDialog />
      </div>
    </DesktopProvider>
  );
}
