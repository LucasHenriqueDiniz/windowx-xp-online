"use client";
import { limitToLast, onValue, orderByChild, query, ref, remove, set, onDisconnect } from "firebase/database";
import { createContext, ReactNode, useContext, useEffect, useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { database } from "../../lib/firebase";

// Maximum number of users to prevent performance issues
const MAX_USERS = 10;

// How often to update cursor position (ms) - Increased from 33ms to 150ms
const UPDATE_INTERVAL = 150; // ~7 fps instead of 30fps

// Minimum pixel distance before sending an update
const MIN_DISTANCE_THRESHOLD = 5;

// Time before considering a user inactive (ms)
const INACTIVE_THRESHOLD = 10000; // 10 seconds

export interface CursorData {
  id: string;
  displayName: string;
  position: { x: number; y: number };
  lastActive: number;
  color: string;
}

interface CursorContextType {
  userId: string;
  displayName: string;
  cursors: CursorData[];
  setDisplayName: (name: string) => void;
  updateCursorPosition: (x: number, y: number) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

// Generate a random color for the cursor
const getRandomColor = () => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33F0", "#FFBD33", "#33FFBD", "#BD33FF", "#FF3333", "#33FF33"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Calculate distance between two points
const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export function CursorProvider({ children }: { children: ReactNode }) {
  // Create or get a persistent user ID
  const [userId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("cursor_user_id");
      if (storedId) return storedId;

      const newId = uuidv4();
      localStorage.setItem("cursor_user_id", newId);
      return newId;
    }
    return uuidv4();
  });

  // Get or generate display name
  const [displayName, setDisplayNameState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cursor_display_name") || `User-${userId.substring(0, 5)}`;
    }
    return `User-${userId.substring(0, 5)}`;
  });

  // State to track all cursors
  const [cursors, setCursors] = useState<CursorData[]>([]);

  // Track last position to avoid excessive updates
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Track last upload time for throttling
  const lastUpdateTimeRef = useRef(0);

  // Flag to track if an update is pending
  const updatePendingRef = useRef(false);

  // Random color for the user's cursor
  const [cursorColor] = useState<string>(getRandomColor());

  // Reference to heartbeat interval
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update display name
  const setDisplayName = useCallback(
    (name: string) => {
      setDisplayNameState(name);
      if (typeof window !== "undefined") {
        localStorage.setItem("cursor_display_name", name);
      }

      // Update the cursor data in Firebase
      const cursorRef = ref(database!, `cursors/${userId}`);
      set(cursorRef, {
        id: userId,
        displayName: name,
        position: lastPositionRef.current,
        lastActive: Date.now(),
        color: cursorColor,
      });
    },
    [userId, cursorColor]
  );

  // Efficient cursor update function
  const sendCursorUpdate = useCallback(() => {
    if (!updatePendingRef.current) return;

    updatePendingRef.current = false;
    const now = Date.now();

    const cursorRef = ref(database!, `cursors/${userId}`);
    set(cursorRef, {
      id: userId,
      displayName,
      position: lastPositionRef.current,
      lastActive: now,
      color: cursorColor,
    });

    lastUpdateTimeRef.current = now;
  }, [userId, displayName, cursorColor]);

  // Update cursor position with throttling and distance threshold
  const updateCursorPosition = useCallback(
    (x: number, y: number) => {
      const newPosition = { x, y };
      const distance = getDistance(lastPositionRef.current, newPosition);

      // Only update if moved more than threshold distance
      if (distance >= MIN_DISTANCE_THRESHOLD) {
        lastPositionRef.current = newPosition;
        updatePendingRef.current = true;

        // If it's been long enough since the last update, send immediately
        const now = Date.now();
        if (now - lastUpdateTimeRef.current >= UPDATE_INTERVAL) {
          sendCursorUpdate();
        }
      }
    },
    [sendCursorUpdate]
  );

  // Initialize Firebase connection and handle cursor updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get reference to cursors in Firebase
    const cursorsRef = ref(database!, "cursors");

    // Set initial cursor position
    const initCursor = () => {
      const cursorRef = ref(database!, `cursors/${userId}`);
      const initialData = {
        id: userId,
        displayName,
        position: { x: 0, y: 0 },
        lastActive: Date.now(),
        color: cursorColor,
      };

      set(cursorRef, initialData);

      // Set up onDisconnect to automatically remove the cursor when user disconnects
      onDisconnect(cursorRef).remove();
    };

    // Setup listener for all cursors
    const cursorsQuery = query(cursorsRef, orderByChild("lastActive"), limitToLast(MAX_USERS));
    const unsubscribe = onValue(cursorsQuery, (snapshot) => {
      if (!snapshot.exists()) return;

      const cursorsData = snapshot.val();
      const cursorsList: CursorData[] = Object.values(cursorsData);

      // Filter out inactive users and the current user
      const activeCursors = cursorsList.filter((cursor) => cursor.id !== userId && Date.now() - cursor.lastActive < INACTIVE_THRESHOLD);

      setCursors(activeCursors);
    });

    // Initialize cursor
    initCursor();

    // Set up interval to throttle cursor position updates
    const updateInterval = setInterval(() => {
      if (updatePendingRef.current) {
        sendCursorUpdate();
      }
    }, UPDATE_INTERVAL);

    // Set up a separate heartbeat interval at a much lower frequency
    // This ensures user presence even when they're not moving the mouse
    heartbeatIntervalRef.current = setInterval(() => {
      const cursorRef = ref(database!, `cursors/${userId}`);
      set(cursorRef, {
        id: userId,
        displayName,
        position: lastPositionRef.current,
        lastActive: Date.now(),
        color: cursorColor,
      });
    }, 10000); // Update every 10 seconds for presence

    // Cleanup on component unmount
    return () => {
      clearInterval(updateInterval);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      unsubscribe();

      // Remove user cursor when disconnecting
      const cursorRef = ref(database!, `cursors/${userId}`);
      remove(cursorRef);
    };
  }, [userId, displayName, cursorColor, sendCursorUpdate]);

  // Listen for mouse movements with throttling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [updateCursorPosition]);

  return (
    <CursorContext.Provider
      value={{
        userId,
        displayName,
        cursors,
        setDisplayName,
        updateCursorPosition,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
}
