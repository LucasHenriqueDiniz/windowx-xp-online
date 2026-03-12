'use client';
import { useDesktop } from "@/context/DesktopContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import './Taskbar.css';
import StartMenu from "./StartMenu";

const getTime = () => {
  const date = new Date();
  let hour = date.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  let min: string | number = date.getMinutes();
  min = min < 10 ? '0' + min : min;
  return `${hour}:${min} ${ampm}`;
};

export default function Taskbar() {
  const [time, setTime] = useState(getTime);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLImageElement>(null);
  const { desktopState, focusProgram, minimizeProgram, unFocus } = useDesktop();
  const { programs, focused_program_id } = desktopState;

  useEffect(() => {
    const timer = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        startButtonRef.current &&
        !startButtonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [isMenuOpen]);

  const handleAppClick = (id: string) => {
    if (focused_program_id === id) {
      minimizeProgram(id);
    } else {
      focusProgram(id);
    }
  };

  return (
    <div className="taskbar" onMouseDown={() => unFocus()}>
      <div ref={menuRef} className="start-menu-wrapper">
        {isMenuOpen && <StartMenu onClose={() => setMenuOpen(false)} />}
      </div>
      
      <div className="taskbar-left">
        <img
          ref={startButtonRef}
          src="/assets/windowsIcons/start.png"
          alt="start"
          className="start-button"
          onClick={() => setMenuOpen(!isMenuOpen)}
        />
        <div className="taskbar-windows">
          {programs.map(app => (
            <TaskbarWindow
              key={app.id}
              {...app}
              onClick={handleAppClick}
              isFocused={focused_program_id === app.id}
            />
          ))}
        </div>
      </div>

      <div className="taskbar-right">
        <Image src="/assets/windowsIcons/690(16x16).png" alt="" width={16} height={16} />
        <Image src="/assets/windowsIcons/394(16x16).png" alt="" width={16} height={16} />
        <Image src="/assets/windowsIcons/229(16x16).png" alt="" width={16} height={16} />
        <div className="time">{time}</div>
      </div>
    </div>
  );
}

interface TaskbarWindowProps {
  id: string;
  icon: string;
  title: string;
  onClick: (id: string) => void;
  isFocused: boolean;
}

function TaskbarWindow({ id, icon, title, onClick, isFocused }: TaskbarWindowProps) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onMouseDown={(e) => e.stopPropagation()}
      className={`taskbar-window ${isFocused ? 'focused' : ''}`}>
      <Image src={icon} alt={title} width={16} height={16} />
      <span className="taskbar-window-text">{title}</span>
    </div>
  );
}
