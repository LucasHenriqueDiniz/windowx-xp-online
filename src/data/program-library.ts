import { ProgramDefinition, ProgramsMenuStructure } from "@/types/program-definitions";
import * as Icons from "../../public/assets/icons";

export const getProgramDefinition = (iconId: string): ProgramDefinition => {
  // Look up the program in the program library
  const program = programLibrary[iconId];

  if (program) {
    return {
      name: program.name,
      icon: program.icon,
      program: program.program,
      description: program.description,
      category: program.category,
      fileSize: program.fileSize,
      isSystem: program.isSystem,
      id: program.id,
    };
  }

  // Fallback for unknown icons
  return {
    name: iconId,
    icon: Icons.NewFile.src,
    description: "Unknown program",
    program: "error",
    category: "Unknown",
    fileSize: "0 KB",
    isSystem: false,
    id: iconId,
  };
};

// Define all available programs in the Windows XP system
export const programLibrary: Record<string, ProgramDefinition> = {
  "internet-explorer": {
    id: "internet-explorer",
    name: "Internet Explorer",
    description: "Browse the web",
    icon: Icons.InternetExplorer.src,
    program: "browser",
    category: "Internet",
    fileSize: "850 KB",
    isSystem: true,
  },
  "outlook-express": {
    id: "outlook-express",
    name: "E-mail",
    description: "Send and receive email",
    icon: Icons.OutlookExpress.src,
    program: "mail",
    category: "Internet",
    fileSize: "1.2 MB",
    isSystem: true,
  },
  "windows-media-player": {
    id: "windows-media-player",
    name: "Windows Media Player",
    description: "Play music and videos",
    icon: Icons.MediaPlayer.src,
    program: "media-player",
    category: "Entertainment",
    fileSize: "2.5 MB",
    isSystem: true,
  },
  "windows-messenger": {
    id: "windows-messenger",
    name: "Windows Messenger",
    description: "Chat with friends and family",
    icon: Icons.WindowsMessenger.src,
    program: "messenger",
    category: "Internet",
    fileSize: "3.5 MB",
    isSystem: true,
  },
  "my-computer": {
    id: "my-computer",
    name: "My Computer",
    description: "View the contents of your computer",
    icon: Icons.MyComputer.src,
    program: "explorer",
    category: "System",
    isSystem: true,
  },
  "my-documents": {
    id: "my-documents",
    name: "My Documents",
    description: "Access your documents",
    icon: Icons.MyDocuments.src,
    program: "explorer",
    category: "System",
    isSystem: true,
  },
  "my-recent-documents": {
    id: "my-recent-documents",
    name: "My Recent Documents",
    description: "Access recently used documents",
    icon: Icons.RecentDocuments.src,
    program: "explorer",
    category: "System",
    isSystem: true,
  },
  "my-pictures": {
    id: "my-pictures",
    name: "My Pictures",
    description: "View your pictures",
    icon: Icons.MyPictures.src,
    program: "explorer",
    category: "System",
    isSystem: true,
  },
  "my-music": {
    id: "my-music",
    name: "My Music",
    description: "Access your music collection",
    icon: Icons.MyMusic.src,
    program: "explorer",
    category: "System",
    isSystem: true,
  },
  "my-network": {
    id: "my-network",
    name: "My Network Places",
    description: "View computers and devices on your network",
    icon: Icons.MyNetwork.src,
    program: "explorer",
    category: "System",
    isSystem: true,
  },
  "control-panel": {
    id: "control-panel",
    name: "Control Panel",
    description: "Change Windows settings",
    icon: Icons.ControlPanel.src,
    program: "control-panel",
    category: "System",
    isSystem: true,
  },
  "default-programs": {
    id: "default-programs",
    name: "Set Program Access and Defaults",
    description: "Choose which programs Windows uses by default",
    icon: Icons.TaskbarStartMenu.src,
    program: "default-programs",
    category: "System",
    isSystem: true,
  },
  "network-connections": {
    id: "network-connections",
    name: "Connect To",
    description: "Connect to networks and the Internet",
    icon: Icons.Network.src,
    program: "network-connections",
    category: "System",
    isSystem: true,
  },
  "printers-faxes": {
    id: "printers-faxes",
    name: "Printers and Faxes",
    description: "Set up and manage printers and faxes",
    icon: Icons.Fax.src,
    program: "printers-faxes",
    category: "System",
    isSystem: true,
  },
  notepad: {
    id: "notepad",
    name: "Notepad",
    description: "Text editor",
    icon: Icons.Notepad.src,
    program: "notepad",
    category: "Accessories",
    fileSize: "95 KB",
    isSystem: false,
  },
  paint: {
    id: "paint",
    name: "Paint",
    description: "Create and edit drawings",
    icon: Icons.Paint.src,
    program: "paint",
    category: "Accessories",
    fileSize: "325 KB",
    isSystem: false,
  },
  calculator: {
    id: "calculator",
    name: "Calculator",
    description: "Perform basic calculations",
    icon: Icons.Calculator.src,
    program: "calculator",
    category: "Accessories",
    fileSize: "120 KB",
    isSystem: false,
  },
  wordpad: {
    id: "wordpad",
    name: "WordPad",
    description: "Rich text editor",
    icon: Icons.WordPad.src,
    program: "wordpad",
    category: "Accessories",
    fileSize: "382 KB",
    isSystem: false,
  },
  cmd: {
    id: "cmd",
    name: "Command Prompt",
    description: "Command line interface",
    icon: Icons.CommandPrompt.src,
    program: "cmd",
    category: "Accessories",
    fileSize: "75 KB",
    isSystem: true,
  },
  minesweeper: {
    id: "minesweeper",
    name: "Minesweeper",
    description: "Classic puzzle game",
    icon: Icons.Minesweeper.src,
    program: "minesweeper",
    category: "Games",
    fileSize: "150 KB",
    isSystem: false,
  },
  solitaire: {
    id: "solitaire",
    name: "Solitaire",
    description: "Card game",
    icon: Icons.Solitaire.src,
    program: "solitaire",
    category: "Games",
    fileSize: "225 KB",
    isSystem: false,
  },
  hearts: {
    id: "hearts",
    name: "Hearts",
    description: "Card game",
    icon: Icons.Hearts.src,
    program: "hearts",
    category: "Games",
    fileSize: "187 KB",
    isSystem: false,
  },
  "spider-solitaire": {
    id: "spider-solitaire",
    name: "Spider Solitaire",
    description: "Card game",
    icon: Icons.SpiderSolitaire.src,
    program: "spider-solitaire",
    category: "Games",
    fileSize: "235 KB",
    isSystem: false,
  },
  pinball: {
    id: "pinball",
    name: "3D Pinball",
    description: "Pinball game",
    icon: Icons.Pinball.src,
    program: "pinball",
    category: "Games",
    fileSize: "1.8 MB",
    isSystem: false,
  },
  "display-properties": {
    id: "display-properties",
    name: "Display Properties",
    description: "Change display settings",
    icon: Icons.Display.src,
    program: "display-properties",
    category: "System",
    isSystem: true,
  },
  help: {
    id: "help",
    name: "Help and Support",
    description: "Get help with Windows XP",
    icon: Icons.HelpFile.src,
    program: "help",
    category: "System",
    isSystem: true,
  },
  search: {
    id: "search",
    name: "Search",
    description: "Search for files and folders",
    icon: Icons.Search.src,
    program: "search",
    category: "System",
    isSystem: true,
  },
  run: {
    id: "run",
    name: "Run...",
    description: "Run a program",
    icon: Icons.Run.src,
    program: "run",
    category: "System",
    isSystem: true,
  },
  "system-restore": {
    id: "system-restore",
    name: "System Restore",
    description: "Restore Windows to an earlier time",
    icon: Icons.SystemRestore.src,
    program: "system-restore",
    category: "System",
    fileSize: "420 KB",
    isSystem: true,
  },
};

// Default folder structure for All Programs menu
export const defaultProgramsMenuStructure: ProgramsMenuStructure = {
  folders: [
    {
      id: "accessories",
      name: "Accessories",
      icon: Icons.Folder.src,
      items: ["notepad", "paint", "calculator", "wordpad", "cmd"],
    },
    {
      id: "games",
      name: "Games",
      icon: Icons.Folder.src,
      items: ["minesweeper", "solitaire", "hearts", "spider-solitaire", "pinball"],
    },
    {
      id: "startup",
      name: "Startup",
      icon: Icons.Folder.src,
      items: [],
    },
    {
      id: "internet-tools",
      name: "Internet and Network",
      icon: Icons.Folder.src,
      items: ["internet-explorer", "outlook-express", "windows-messenger"],
    },
    {
      id: "system-tools",
      name: "System Tools",
      icon: Icons.Folder.src,
      items: [
        {
          id: "accessibility",
          name: "Accessibility",
          icon: Icons.AccessibilityOptions.src,
          items: ["magnifier", "narrator"],
        },
        "display-properties",
      ],
    },
  ],
  items: ["windows-media-player"],
};

// Default pinned programs
export const defaultPinnedPrograms: string[] = ["internet-explorer", "outlook-express", "windows-media-player", "notepad", "paint", "calculator"];

// Default second column items (these are fixed as per Windows XP)
export const systemItems = {
  mainGroup: ["my-documents", "my-recent-documents", "my-pictures", "my-music", "my-computer", "my-network"],
  controlGroup: ["control-panel", "default-programs", "display-properties", "network-connections", "printers-faxes"],
  bottomGroup: ["help", "search", "run"],
};
