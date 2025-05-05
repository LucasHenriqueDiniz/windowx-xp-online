export interface WindowPropertiesProps {
  id: string;
  isActive: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}
