export interface Program {
    id: string;
    name: string;
    icon: string;
    Component: () => JSX.Element;
  }
  