import React from 'react';
import './HeaderButtons.css';

interface HeaderButtonsProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  maximized: boolean;
  resizable: boolean;
  isFocus: boolean;
}

const HeaderButtons: React.FC<HeaderButtonsProps> = ({ onMinimize, onMaximize, onClose, maximized, resizable, isFocus }) => {
  return (
    <div className="header-buttons" style={{ opacity: isFocus ? 1 : 0.6 }}>
        <button
            key="minimize"
            className="header__button header__button--minimize"
            onMouseUp={onMinimize}
        />
        <button
            key="maximize"
            className={`header__button ${
                maximized ? 'header__button--maximized' : 'header__button--maximize'
            } ${resizable ? '' : 'header__button--disable'}`}
            onMouseUp={onMaximize}
        />
        <button
            key="button"
            className="header__button header__button--close"
            onMouseUp={onClose}
        />
    </div>
  );
};

export default HeaderButtons;
