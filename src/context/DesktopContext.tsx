/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { DesktopState, Program, WindowPosition, WindowSize } from "@/types";
import { programDefinitions, ProgramId } from "@/types/program-definitions";
import { useDebouncedCallback } from "use-debounce";

// --- TYPES --- //
type Action = 
  | { type: 'SET_STATE', payload: DesktopState }
  | { type: 'OPEN_PROGRAM', payload: { programId: ProgramId, props?: Record<string, unknown> } }
  | { type: 'CLOSE_PROGRAM', payload: { id: string } }
  | { type: 'FOCUS_PROGRAM', payload: { id: string } }
  | { type: 'UNFOCUS_ALL' }
  | { type: 'MINIMIZE_PROGRAM', payload: { id: string } }
  | { type: 'MAXIMIZE_PROGRAM', payload: { id: string } }
  | { type: 'MOVE_PROGRAM', payload: { id: string, position: WindowPosition } }
  | { type: 'RESIZE_PROGRAM', payload: { id: string, size: WindowSize } }
  | { type: 'MOVE_ICON', payload: { id: string, position: WindowPosition } };

// --- REDUCER --- //
const desktopReducer = (state: DesktopState, action: Action): DesktopState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'OPEN_PROGRAM': {
        const definition = programDefinitions[action.payload.programId];
        if (!definition) return state;
        const newProgram: Program = {
            id: `${action.payload.programId}-${Date.now()}`,
            type: action.payload.programId,
            title: definition.name,
            icon: definition.icon, 
            position: { x: 100, y: 100 },
            size: definition.defaultSize || { width: 640, height: 480 },
            zIndex: state.nextZIndex, 
            isMinimized: false,
            isMaximized: false,
            props: { ...definition.defaultProps, ...action.payload.props },
        };
        return {
            ...state,
            programs: [...state.programs, newProgram],
            focused_program_id: newProgram.id,
            nextZIndex: state.nextZIndex + 1,
        };
    }
    case 'CLOSE_PROGRAM': {
        const newPrograms = state.programs.filter((p) => p.id !== action.payload.id);
        const lastProgram = newPrograms.slice().reverse().find(p => !p.isMinimized);
        return {
            ...state,
            programs: newPrograms,
            focused_program_id: lastProgram ? lastProgram.id : undefined,
        };
    }
    case 'FOCUS_PROGRAM':
        if (state.focused_program_id === action.payload.id) return state;
        return {
            ...state,
            programs: state.programs.map((p) => 
                p.id === action.payload.id 
                    ? { ...p, zIndex: state.nextZIndex, isMinimized: false } 
                    : p
            ),
            focused_program_id: action.payload.id,
            nextZIndex: state.nextZIndex + 1,
        };
    case 'UNFOCUS_ALL':
        return { ...state, focused_program_id: undefined };
    case 'MINIMIZE_PROGRAM':
        const newFocusedId = state.focused_program_id === action.payload.id ? undefined : state.focused_program_id;
        return {
            ...state,
            programs: state.programs.map((p) => 
                p.id === action.payload.id ? { ...p, isMinimized: true } : p
            ),
            focused_program_id: newFocusedId,
        };
    case 'MAXIMIZE_PROGRAM':
        return {
            ...state,
            programs: state.programs.map((p) => 
                p.id === action.payload.id ? { ...p, isMaximized: !p.isMaximized, isMinimized: false } : p
            ),
            focused_program_id: action.payload.id,
            nextZIndex: state.nextZIndex + 1,
        };
    case 'MOVE_PROGRAM':
        return {
            ...state,
            programs: state.programs.map((p) => 
                p.id === action.payload.id ? { ...p, position: action.payload.position } : p
            ),
        };
    case 'RESIZE_PROGRAM':
        return {
            ...state,
            programs: state.programs.map((p) => 
                p.id === action.payload.id ? { ...p, size: action.payload.size } : p
            ),
        };
    case 'MOVE_ICON':
        return {
            ...state,
            icons: state.icons.map((icon) => 
                icon.id === action.payload.id ? { ...icon, position: action.payload.position } : icon
            ),
        };
    default:
      return state;
  }
};

// --- DEFAULT STATE --- //
const defaultInitialState: DesktopState = {
  icons: [
    { id: 'paint', position: { x: 20, y: 20 } },
    { id: 'notepad', position: { x: 20, y: 120 } },
  ],
  programs: [],
  nextZIndex: 10,
  focused_program_id: undefined,
};

// --- CONTEXT --- //
interface DesktopContextType {
  desktopState: DesktopState;
  openProgram: (programId: ProgramId, props?: Record<string, unknown>) => void;
  closeProgram: (id: string) => void;
  focusProgram: (id: string) => void;
  unFocus: () => void;
  minimizeProgram: (id: string) => void;
  maximizeProgram: (id: string) => void;
  moveProgram: (id: string, position: WindowPosition) => void;
  resizeProgram: (id: string, size: WindowSize) => void;
  moveIcon: (id: string, position: WindowPosition) => void;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

// --- PROVIDER --- //
export function DesktopProvider({ children }: { children: ReactNode }) {
  const [desktopState, dispatch] = useReducer(desktopReducer, defaultInitialState);
  const [isInitialized, setIsInitialized] = useState(false);

  const saveToLocalStorage = useDebouncedCallback((state: DesktopState) => {
    try {
      const stateString = JSON.stringify(state);
      localStorage.setItem('desktopState', stateString);
    } catch (e) {
      console.error("Failed to save state to local storage", e);
    }
  }, 300);

  useEffect(() => {
    let stateToLoad: DesktopState;

    try {
      const savedStateJSON = localStorage.getItem('desktopState');
      if (!savedStateJSON) {
        stateToLoad = defaultInitialState;
      } else {
        const savedState = JSON.parse(savedStateJSON) as Partial<DesktopState>;

        // **SAFE VALIDATION & MIGRATION**
        const validPrograms = (savedState.programs ?? [])
          .filter(p => p && p.type && programDefinitions[p.type as ProgramId])
          .map(p => {
            const definition = programDefinitions[p.type as ProgramId];
            if (p.icon !== definition.icon) {
              return { ...p, icon: definition.icon };
            }
            return p;
          });
        
        const validIcons = Array.isArray(savedState.icons) ? savedState.icons : defaultInitialState.icons;

        stateToLoad = {
          ...defaultInitialState,
          ...savedState,
          programs: validPrograms,
          icons: validIcons,
        };
      }
    } catch (error) {
      console.error("Error loading or migrating state. Resetting to default state.", error);
      localStorage.removeItem('desktopState');
      stateToLoad = defaultInitialState;
    }
    
    dispatch({ type: 'SET_STATE', payload: stateToLoad });
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveToLocalStorage(desktopState);
    }
  }, [desktopState, isInitialized]);

  // --- ACTION FUNCTIONS --- //
  const openProgram = useCallback((programId: ProgramId, props: Record<string, unknown> = {}) => dispatch({ type: 'OPEN_PROGRAM', payload: { programId, props } }), []);
  const closeProgram = useCallback((id: string) => dispatch({ type: 'CLOSE_PROGRAM', payload: { id } }), []);
  const focusProgram = useCallback((id: string) => dispatch({ type: 'FOCUS_PROGRAM', payload: { id } }), []);
  const unFocus = useCallback(() => dispatch({ type: 'UNFOCUS_ALL' }), []);
  const minimizeProgram = useCallback((id: string) => dispatch({ type: 'MINIMIZE_PROGRAM', payload: { id } }), []);
  const maximizeProgram = useCallback((id: string) => dispatch({ type: 'MAXIMIZE_PROGRAM', payload: { id } }), []);
  const resizeProgram = useCallback((id: string, size: WindowSize) => dispatch({ type: 'RESIZE_PROGRAM', payload: { id, size } }), []);
  const moveIcon = useCallback((id: string, position: WindowPosition) => dispatch({ type: 'MOVE_ICON', payload: { id, position } }), []);
  const moveProgram = useCallback((id: string, position: WindowPosition) => dispatch({ type: 'MOVE_PROGRAM', payload: { id, position } }), []);

  const value = { desktopState, openProgram, closeProgram, focusProgram, unFocus, minimizeProgram, maximizeProgram, moveProgram, resizeProgram, moveIcon };

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
}

// --- HOOK --- //
export const useDesktop = (): DesktopContextType => {
  const context = useContext(DesktopContext);
  if (context === undefined) {
    throw new Error("useDesktop must be used within a DesktopProvider");
  }
  return context;
};
