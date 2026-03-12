
"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Window from '@/components/Window/Window';
import { WindowPropertiesProps } from '@/types/window-properties';
import GoogleSearchPage from './GoogleSearchPage';

const ieIcons = {
    back: '/assets/winXPassets/internetexplorer/back.png',
    forward: '/assets/winXPassets/internetexplorer/forward.png',
    stop: '/assets/winXPassets/internetexplorer/stop.png',
    refresh: '/assets/winXPassets/internetexplorer/refresh.png',
    home: '/assets/winXPassets/internetexplorer/home.png',
    search: '/assets/winXPassets/internetexplorer/search.png',
    favorites: '/assets/winXPassets/internetexplorer/favorites.png',
    history: '/assets/winXPassets/internetexplorer/history.png',
    mail: '/assets/winXPassets/internetexplorer/mail.png',
    printer: '/assets/winXPassets/internetexplorer/printer.png',
    edit: '/assets/winXPassets/internetexplorer/edit.png',
    msn: '/assets/winXPassets/internetexplorer/msn.png',
    go: '/assets/winXPassets/internetexplorer/go.png',
    iePaper: '/assets/winXPassets/internetexplorer/ie-paper.png',
    windows: '/assets/winXPassets/internetexplorer/windows.png',
    dropdown: '/assets/winXPassets/internetexplorer/dropdown.png',
    links: '/assets/winXPassets/internetexplorer/links.png',
    earth: '/assets/winXPassets/internetexplorer/earth.png',
};

const InternetExplorer: React.FC<WindowPropertiesProps> = (props) => {
  const [url, setUrl] = useState('google'); // 'google' or a real URL
  const [history, setHistory] = useState<string[]>(['google']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (newUrl: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setUrl(newUrl);
  };

  const handleGo = () => {
    const input = document.getElementById('address-bar-input') as HTMLInputElement;
    if (input) {
      let newUrl = input.value;
      if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
          newUrl = 'https://' + newUrl;
      }
      navigate(newUrl);
    }
  };
  
  const handleSearch = (query: string) => {
      navigate(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setUrl(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setUrl(history[historyIndex + 1]);
    }
  };

  const refresh = () => {
      if (url === 'google') {
          // Reset Google page state if needed
      } else if (iframeRef.current) {
          iframeRef.current.src = url;
      }
  };

  const goHome = () => navigate('google');

  const Button = ({ icon, text, onClick, disabled = false, hasArrow = false }) => (
    <button 
        onClick={onClick} 
        disabled={disabled} 
        className={`flex items-center h-full px-1 border border-transparent rounded-sm hover:border-gray-400 hover:shadow-inner-light ${disabled ? 'opacity-50 grayscale' : ''}`}>
      <Image src={icon} alt={text || ''} width={20} height={20}/>
      {text && <span className="ml-1 text-xs">{text}</span>}
      {hasArrow && <div className="w-2 h-2 border-t-2 border-l-2 border-black transform rotate-45 ml-1"/>}
    </button>
  );

  return (
    <Window {...props} title="Internet Explorer" icon={ieIcons.iePaper}>
      <div className="flex flex-col h-full bg-[#f0f0f0] text-sm">
        {/* Menu Bar */}
        <div className="flex bg-[#f0f0f0] border-b border-gray-400 select-none">
            {/* Dummy menu items */}
            <div className="px-2 py-0.5 hover:bg-blue-600 hover:text-white">File</div>
            <div className="px-2 py-0.5 hover:bg-blue-600 hover:text-white">Edit</div>
            <div className="px-2 py-0.5 hover:bg-blue-600 hover:text-white">View</div>
            <div className="px-2 py-0.5 hover:bg-blue-600 hover:text-white">Favorites</div>
            <div className="px-2 py-0.5 hover:bg-blue-600 hover:text-white">Tools</div>
            <div className="px-2 py-0.5 hover:bg-blue-600 hover:text-white">Help</div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center h-10 px-1 border-b border-gray-300 shadow-sm">
            <Button icon={ieIcons.back} text="Back" onClick={goBack} disabled={historyIndex === 0} hasArrow />
            <Button icon={ieIcons.forward} text="Forward" onClick={goForward} disabled={historyIndex === history.length - 1} hasArrow />
            <Button icon={ieIcons.stop} text="" onClick={() => {}} />
            <Button icon={ieIcons.refresh} text="" onClick={refresh} />
            <Button icon={ieIcons.home} text="" onClick={goHome} />
            <div className="h-full w-px bg-gray-400 mx-1" />
            <Button icon={ieIcons.search} text="Search" onClick={() => {}} />
            <Button icon={ieIcons.favorites} text="Favorites" onClick={() => {}} />
            <Button icon={ieIcons.history} text="History" onClick={() => {}} />
            <div className="h-full w-px bg-gray-400 mx-1" />
            <Button icon={ieIcons.mail} text="" onClick={() => {}} />
            <Button icon={ieIcons.printer} text="" onClick={() => {}} />
            <Button icon={ieIcons.edit} text="" onClick={() => {}} />
            <Button icon={ieIcons.msn} text="" onClick={() => {}} />
        </div>

        {/* Address Bar */}
        <div className="flex items-center h-7 px-1 bg-[#f0f0f0] border-b border-gray-300">
            <span className="text-gray-500 mr-1">Address</span>
            <div className="flex-grow flex items-center bg-white border border-gray-400 h-6">
                <Image src={ieIcons.iePaper} alt="Page Icon" width={16} height={16} className="mx-1" />
                <input 
                  id="address-bar-input"
                  type="text" 
                  defaultValue={url === 'google' ? '' : url}
                  onKeyDown={(e) => e.key === 'Enter' && handleGo()}
                  className="flex-grow h-full outline-none text-sm" />
            </div>
            <button onClick={handleGo} className="flex items-center h-6 px-2 ml-1 border border-gray-300 rounded-sm bg-gray-100 hover:bg-gray-200">
                <Image src={ieIcons.go} alt="" width={16} height={16} className="mr-1"/> Go
            </button>
        </div>

        {/* Content */}
        <div className="flex-grow bg-white border-t border-gray-500">
          {url === 'google' ? (
            <GoogleSearchPage onSearch={handleSearch} />
          ) : (
            <iframe
              ref={iframeRef}
              src={url}
              className="w-full h-full border-none"
              title="Internet Explorer"
              sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
              referrerPolicy="no-referrer"
            ></iframe>
          )}
        </div>
        {/* Status Bar */}
        <div className="flex items-center h-5 px-1 bg-[#f0f0f0] border-t border-gray-300 text-xs">
            <Image src={ieIcons.earth} alt="Internet Icon" width={16} height={16} className="mr-1"/>
            <span>Internet</span>
        </div>
      </div>
    </Window>
  );
};

export default InternetExplorer;
