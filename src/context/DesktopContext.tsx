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
import { getDatabase, ref, set, onChildAdded, push, serverTimestamp } from "firebase/database";
import { DesktopState, Program, WindowPosition, WindowSize } from "@/types";
import { programDefinitions, ProgramId } from "@/types/program-definitions";
import { config } from "@/config";
import { useDebouncedCallback } from "use-debounce";

// --- REDUCER --- //
type Action = 
  | { type: 'SET_STATE', payload: DesktopState }
  | { type: 'OPEN_PROGRAM', payload: { programId: ProgramId, props?: Record<string, unknown> } }
  | { type: 'CLOSE_PROGRAM', payload: { id: string } }
  | { type: 'FOCUS_PROGRAM', payload: { id: string } }
  | { type: 'UNFOCUS_ALL' }
  | { type: 'MINIMIZE_PROGRAM', payload: { id: string } }
  | { type: 'MAXIMIZE_PROGRAM', payload: { id: string, isMaximized: boolean } }
  | { type: 'MOVE_PROGRAM', payload: { id: string, position: WindowPosition } }
  | { type: 'RESIZE_PROGRAM', payload: { id: string, size: WindowSize } }
  | { type: 'MOVE_ICON', payload: { id: string, position: WindowPosition } }
  | { type: 'MINIMIZE_ALL_PROGRAMS' };

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
    case 'CLOSE_PROGRAM':
        return {
            ...state,
            programs: state.programs.filter((p) => p.id !== action.payload.id),
            focused_program_id: undefined,
        };
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
        return {
            ...state,
            programs: state.programs.map((p) => 
                p.id === action.payload.id ? { ...p, isMinimized: true } : p
            ),
            focused_program_id: undefined,
        };
    case 'MAXIMIZE_PROGRAM':
        return {
            ...state,
            programs: state.programs.map((p) => 
                p.id === action.payload.id ? { ...p, isMaximized: !action.payload.isMaximized, isMinimized: false } : p
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
    case 'MINIMIZE_ALL_PROGRAMS':
        return {
            ...state,
            programs: state.programs.map((p) => ({ ...p, isMinimized: true })),
            focused_program_id: undefined,
        };
    default:
        return state;
  }
};

// --- CONTEXT --- //
const defaultInitialState: DesktopState = {
  icons: [
    { id: "paint", position: { x: 20, y: 20 } },
    { id: "notepad", position: { x: 20, y: 120 } },
  ],
  programs: [],
  nextZIndex: 10,
  focused_program_id: undefined,
};

interface DesktopContextType {
  desktopState: DesktopState;
  setDesktopState: (state: DesktopState) => void; 
  openProgram: (programId: ProgramId, props?: Record<string, unknown>) => void;
  closeProgram: (id: string) => void;
  focusProgram: (id: string) => void;
  unFocus: () => void;
  minimizeProgram: (id: string) => void;
  maximizeProgram: (id: string, isMaximized: boolean) => void;
  moveProgram: (id: string, position: WindowPosition) => void;
  resizeProgram: (id: string, size: WindowSize) => void;
  moveIcon: (id: string, position: WindowPosition) => void;
  minimizeAllPrograms: () => void;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [desktopState, dispatch] = useReducer(desktopReducer, defaultInitialState);
  const [isInitialized, setIsInitialized] = useState(false);

  const dispatchEvent = useCallback((action: Omit<Action, 'type'> & { type: string }) => {
    if (config.APP_MODE === 'online' && config.isFirebaseConfigured) {
      const db = getDatabase();
      const eventsRef = ref(db, 'desktop-events');
      push(eventsRef, { ...action, timestamp: serverTimestamp() });
    }
  }, []);

  // --- STATE PERSISTENCE & MIGRATION --- //

  const saveToLocalStorage = useDebouncedCallback((state: DesktopState) => {
    localStorage.setItem("desktopState", JSON.stringify(state));
  }, 300);

  useEffect(() => {
    if (config.APP_MODE === 'local') {
      const savedStateJSON = localStorage.getItem("desktopState");
      let stateToLoad = defaultInitialState;

      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON) as DesktopState;

        // **MIGRATION LOGIC**
        // Update icons for existing programs and desktop icons if they are outdated
        savedState.programs.forEach(program => {
          const definition = programDefinitions[program.type as ProgramId];
          if (definition && program.icon !== definition.icon) {
            program.icon = definition.icon;
          }
        });
        savedState.icons.forEach(icon => {
          const definition = programDefinitions[icon.id as ProgramId];
          if (definition && icon.icon !== definition.desktopIcon) {
            icon.icon = definition.desktopIcon;
          }
        });
        stateToLoad = savedState;
      }
      
      dispatch({ type: 'SET_STATE', payload: stateToLoad });
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && config.APP_MODE === 'local') {
      saveToLocalStorage(desktopState);
    }
  }, [desktopState, saveToLocalStorage, isInitialized]);

  useEffect(() => {
    if (config.APP_MODE === 'online' && config.isFirebaseConfigured && isInitialized) {
      const db = getDatabase();
      const eventsRef = ref(db, 'desktop-events');
      
      const unsubscribe = onChildAdded(eventsRef, (snapshot) => {
        const event = snapshot.val() as Action;
        dispatch(event);
      });

      return () => unsubscribe();
    }
  }, [isInitialized]);

  // --- ACTION FUNCTIONS --- //

  const setDesktopStateForInitializer = useCallback((newState: DesktopState) => {
    dispatch({ type: 'SET_STATE', payload: newState });
    setIsInitialized(true);
  }, []);

  const openProgram = useCallback((programId: ProgramId, props: Record<string, unknown> = {}) => {
    const action: Action = { type: 'OPEN_PROGRAM', payload: { programId, props } };
    config.APP_MODE === 'online' ? dispatchEvent(action) : dispatch(action);
  }, [dispatchEvent]);

  const closeProgram = useCallback((id: string) => {
    const action: Action = { type: 'CLOSE_PROGRAM', payload: { id } };
    config.APP_MODE === 'online' ? dispatchEvent(action) : dispatch(action);
  }, [dispatchEvent]);
  
  const focusProgram = useCallback((id: string) => {
    const action: Action = { type: 'FOCUS_PROGRAM', payload: { id } };
    dispatch(action); // Focus is local first, then (optionally) synced
  }, []);

  const unFocus = useCallback(() => {
    const action: Action = { type: 'UNFOCUS_ALL' };
    dispatch(action);
  }, []);

  const minimizeProgram = useCallback((id: string) => {
    const action: Action = { type: 'MINIMIZE_PROGRAM', payload: { id } };
    config.APP_MODE === 'online' ? dispatchEvent(action) : dispatch(action);
  }, [dispatchEvent]);

  const maximizeProgram = useCallback((id: string, isMaximized: boolean) => {
    const action: Action = { type: 'MAXIMIZE_PROGRAM', payload: { id, isMaximized } };
    config.APP_MODE === 'online' ? dispatchEvent(action) : dispatch(action);
  }, [dispatchEvent]);

  const debouncedMove = useDebouncedCallback((id: string, position: WindowPosition) => {
      const action: Action = { type: 'MOVE_PROGRAM', payload: { id, position } };
      config.APP_MODE === 'online' ? dispatchEvent(action) : dispatch(action);
  }, 50)

  const moveProgram = (id: string, position: WindowPosition) => {
      const localAction: Action = { type: 'MOVE_PROGRAM', payload: { id, position } };
      dispatch(localAction)
      debouncedMove(id, position)
  }

  const resizeProgram = useCallback((id: string, size: WindowSize) => {
    const action: Action = { type: 'RESIZE_PROGRAM', payload: { id, size } };
    config.APP_MODE === 'online' ? dispatchEvent(action) : dispatch(action);
  }, [dispatchEvent]);

  const moveIcon = useCallback((id: string, position: WindowPosition) => {
    const action: Action = { type: 'MOVE_ICON', payload: { id, position } };
    if (config.APP_MODE === 'online') {
       const db = getDatabase();
       const newState = desktopReducer(desktopState, action); 
       dispatch(action); 
       const dbRef = ref(db, "desktop/icons");
       set(dbRef, newState.icons); 
    } else {
      dispatch(action);
    }
  }, [desktopState, dispatchEvent]);

 const minimizeAllPrograms = useCallback(() => {
    const action: Action = { type: 'MINIMIZE_ALL_PROGRAMS' };
    config.APP_MODE === 'online' ? dispatchEvent(action) : dispatch(action);
  }, [dispatchEvent]);

  const value = {
    desktopState,
    setDesktopState: setDesktopStateForInitializer,
    openProgram,
    closeProgram,
    focusProgram,
    unFocus,
    minimizeProgram,
    maximizeProgram,
    moveProgram,
    resizeProgram,
    moveIcon,
    minimizeAllPrograms,
  };

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
}

export const useDesktop = (): DesktopContextType => {
  const context = useContext(DesktopContext);
  if (context === undefined) {
    throw new Error("useDesktop must be used within a DesktopProvider");
  }
  return context;
};
