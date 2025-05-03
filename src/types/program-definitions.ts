// Program definitions for Windows XP-style applications
export interface ProgramDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  program: string;
  category?: string;
  fileSize?: string;
  fileType?: string;
  dateModified?: string;
  isSystem?: boolean;
}

export interface ProgramFolder {
  id: string;
  name: string;
  icon: string;
  items: (string | ProgramFolder)[]; // Can contain program IDs or nested folders
}

// Represents a user's pinned and recent programs in Start Menu
export interface UserProgramSettings {
  pinnedPrograms: string[]; // Array of program IDs
  recentPrograms: string[]; // Array of recently used program IDs
}

// Represents the tree structure of the All Programs menu
export interface ProgramsMenuStructure {
  folders: ProgramFolder[];
  items: string[]; // Top-level program IDs
}
