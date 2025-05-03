export interface WindowPropertiesProps {
  id: string;
  isActive: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
