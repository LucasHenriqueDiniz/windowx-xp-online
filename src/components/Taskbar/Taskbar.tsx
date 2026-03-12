'use client';
import { useDesktop } from "@/context/DesktopContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import './Taskbar.css';
import StartMenu from "./StartMenu";

const getTime = () => {
  const date = new Date();
  let hour = date.getHours();
  let hourPostFix = 'AM';
  let min: string | number = date.getMinutes();
  if (hour >= 12) {
    hour -= 12;
    hourPostFix = 'PM';
  }
  if (hour === 0) {
    hour = 12;
  }
  if (min < 10) {
    min = '0' + min;
  }
  return `${hour}:${min} ${hourPostFix}`;
};

export default function Taskbar() {
  const [time, setTime] = useState(getTime);
  const [menuOn, setMenuOn] = useState(false);
  const menuRef = useRef(null);
  const startButtonRef = useRef(null);
  const { desktopState, focusProgram, minimizeProgram, unFocus } = useDesktop();
  const { programs, focused_program_id } = desktopState;

  function toggleMenu() {
    setMenuOn(on => !on);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getTime();
      newTime !== time && setTime(newTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
        if (
            menuOn &&
            menuRef.current &&
            !(menuRef.current as any).contains(e.target) &&
            startButtonRef.current &&
            !(startButtonRef.current as any).contains(e.target)
        ) {
            setMenuOn(false);
        }
    }
    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
}, [menuOn]);

  const onMouseDownApp = (id: string) => {
    if (focused_program_id === id) {
        minimizeProgram(id);
    } else {
        focusProgram(id);
    }
  }

  const onMouseDownTaskbar = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.taskbar__window')) return;
    unFocus();
  }

  return (
    <div className="taskbar" onMouseDown={onMouseDownTaskbar}>
      <div className="taskbar__left">
        <div ref={menuRef} className="taskbar__start-menu-container">
            {menuOn && <StartMenu onClose={toggleMenu} />}
        </div>

        <div ref={startButtonRef} className="taskbar__start-button-wrapper" onMouseDown={toggleMenu}>
            <Image
                src="/assets/windowsIcons/start.png"
                alt="start"
                width={100}
                height={30}
                className={`taskbar__start-button ${menuOn ? 'clicked' : ''}`}
            />
        </div>

        <div className="taskbar__windows">
            {programs.map(app => (
            <TaskbarWindow
                key={app.id}
                id={app.id}
                icon={app.icon}
                title={app.title}
                onMouseDown={onMouseDownApp}
                isFocus={focused_program_id === app.id}
            />
            ))}
        </div>
      </div>

      <div className="taskbar__right">
        <Image className="taskbar__icon" src="/assets/windowsIcons/690(16x16).png" alt="" width={16} height={16} />
        <Image className="taskbar__icon" src="/assets/windowsIcons/394(16x16).png" alt="" width={16} height={16} />
        <Image className="taskbar__icon" src="/assets/windowsIcons/229(16x16).png" alt="" width={16} height={16} />
        <div className="taskbar__time">{time}</div>
      </div>
    </div>
  );
}

interface TaskbarWindowProps {
    id: string;
    icon: string;
    title: string;
    onMouseDown: (id: string) => void;
    isFocus: boolean;
}

function TaskbarWindow({ id, icon, title, onMouseDown, isFocus }: TaskbarWindowProps) {
  function _onMouseDown() {
    onMouseDown(id);
  }
  return (
    <div
      onMouseDown={_onMouseDown}
      className={`taskbar__window ${isFocus ? 'focus' : 'cover'}`}>
      <Image className="taskbar__window-icon" src={icon} alt={title} width={16} height={16} />
      <div className="taskbar__window-text">{title}</div>
    </div>
  );
}
