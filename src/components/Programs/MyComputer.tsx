
"use client";
import React from 'react';
import Image from 'next/image';
import Window from '@/components/Window/Window';
import { WindowPropertiesProps } from '@/types/window-properties';

const myComputerIcons = {
    computer: '/assets/winXPassets/mycomputer/computer.png',
    hardDrive: '/assets/winXPassets/mycomputer/hard-drive.png',
    cd: '/assets/winXPassets/mycomputer/cd.png',
    folder: '/assets/winXPassets/mycomputer/folder.png',
    up: '/assets/winXPassets/mycomputer/up.png',
    search: '/assets/winXPassets/mycomputer/search.png',
    back: '/assets/winXPassets/mycomputer/back.png',
    forward: '/assets/winXPassets/mycomputer/forward.png',
    viewInfo: '/assets/winXPassets/mycomputer/view-info.ico',
    remove: '/assets/winXPassets/mycomputer/remove.png',
    control: '/assets/winXPassets/mycomputer/control.png',
    network: '/assets/winXPassets/mycomputer/network.png',
    document: '/assets/winXPassets/mycomputer/document.png',
    folderSmall: '/assets/winXPassets/mycomputer/folder-small.png',
};

const MyComputer: React.FC<WindowPropertiesProps> = (props) => {

    const ToolbarButton = ({ icon, text, onClick, disabled = false, hasArrow = false }) => (
        <button 
            onClick={onClick} 
            disabled={disabled} 
            className={`flex items-center h-full px-2 mx-px border border-transparent rounded-sm hover:border-gray-400 hover:bg-gray-200 ${disabled ? 'opacity-50 grayscale' : ''}`}>
          <Image src={icon} alt={text || 'icon'} width={20} height={20} />
          {text && <span className="ml-1 text-xs">{text}</span>}
          {hasArrow && <div className="w-2 h-2 border-t-2 border-l-2 border-black transform rotate-45 ml-1"/>}
        </button>
      );
      
    const SidebarSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-2">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-1 font-bold text-xs rounded-t-sm">
        {title}
        </div>
        <div className="bg-blue-100 p-2 border border-blue-300 border-t-0 rounded-b-sm">
        {children}
        </div>
    </div>
    );

    const SidebarLink = ({ icon, text }) => (
    <div className="flex items-center mb-1 hover:underline cursor-pointer text-blue-900">
        <Image src={icon} alt="" width={16} height={16} className="mr-1"/>
        <span className="text-xs">{text}</span>
    </div>
    );

    const MainContentSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-700 border-b-2 border-gray-200 pb-1 mb-2">{title}</h2>
            <div className="flex flex-wrap">{children}</div>
        </div>
    );

    const Drive = ({ icon, label, description }) => (
        <div className="flex items-center w-60 p-1 m-1 hover:bg-blue-100 hover:border-blue-300 border border-transparent rounded-sm cursor-pointer">
            <Image src={icon} alt={label} width={48} height={48} className="mr-2"/>
            <div>
                <div className="font-semibold text-xs">{label}</div>
                <div className="text-xs text-gray-500">{description}</div>
            </div>
        </div>
    );

  return (
    <Window {...props} title="My Computer" icon={myComputerIcons.computer}>
      <div className="flex flex-col h-full bg-gray-100">
        {/* Toolbar */}
        <div className="flex items-center h-8 px-1 border-b border-gray-300 bg-gray-50">
            <ToolbarButton icon={myComputerIcons.back} text="Back" disabled hasArrow />
            <ToolbarButton icon={myComputerIcons.forward} text="Forward" disabled hasArrow />
            <ToolbarButton icon={myComputerIcons.up} text="Up" />
            <div className="h-full w-px bg-gray-400 mx-1" />
            <ToolbarButton icon={myComputerIcons.search} text="Search" />
            <ToolbarButton icon={myComputerIcons.folder} text="Folders" />
        </div>
        
        {/* Address Bar */}
        <div className="flex items-center h-7 px-1 bg-gray-100 border-b border-gray-300">
            <span className="text-gray-500 mr-1 text-xs">Address</span>
            <div className="flex-grow flex items-center bg-white border border-gray-400 h-6">
                <Image src={myComputerIcons.computer} alt="My Computer Icon" width={16} height={16} className="mx-1" />
                <span className="text-sm">My Computer</span>
            </div>
        </div>

        <div className="flex flex-grow">
          {/* Sidebar */}
          <div className="w-48 bg-blue-200 p-2 border-r border-gray-300">
                <SidebarSection title="System Tasks">
                    <SidebarLink icon={myComputerIcons.viewInfo} text="View system information" />
                    <SidebarLink icon={myComputerIcons.remove} text="Add or remove programs" />
                    <SidebarLink icon={myComputerIcons.control} text="Change a setting" />
                </SidebarSection>
                <SidebarSection title="Other Places">
                    <SidebarLink icon={myComputerIcons.network} text="My Network Places" />
                    <SidebarLink icon={myComputerIcons.document} text="My Documents" />
                    <SidebarLink icon={myComputerIcons.folderSmall} text="Shared Documents" />
                    <SidebarLink icon={myComputerIcons.control} text="Control Panel" />
                </SidebarSection>
                <SidebarSection title="Details">
                    <p className="text-xs text-blue-900 font-semibold">My Computer</p>
                </SidebarSection>
            </div>

          {/* Main Content */}
          <div className="flex-grow p-4 bg-white">
                <MainContentSection title="Hard Disk Drives">
                    <Drive icon={myComputerIcons.hardDrive} label="Local Disk (C:)" description="Free Space: 10.0 GB, Total Size: 20.0 GB" />
                </MainContentSection>
                <MainContentSection title="Devices with Removable Storage">
                    <Drive icon={myComputerIcons.cd} label="CD Drive (D:)" description="CD-ROM" />
                </MainContentSection>
            </div>
        </div>
      </div>
    </Window>
  );
};

export default MyComputer;
