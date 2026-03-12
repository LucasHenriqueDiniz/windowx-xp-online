import React, { useState } from 'react';
import Image from 'next/image';
import './StartMenu.css';
import { AllPrograms, ConnectTo, MyRecentDocuments, StartMenuItem } from './StartMenuData';

interface SubMenuProps {
  items: StartMenuItem[];
  onClick: (text: string) => void;
  left?: string;
  bottom?: string;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, onClick, left, bottom }) => {
  const style: React.CSSProperties = {};
  if (left) style.left = left;
  if (bottom) style.bottom = bottom;

  return (
    <div className="sub_menu" style={style}>
      {items.map((item, i) => {
        if (item.type === 'separator') {
          return <div key={i} className="menu__separator" />;
        }
        return <Item key={i} text={item.text} icon={item.icon} onClick={onClick} />;
      })}
    </div>
  );
};

interface ItemProps {
  style?: React.CSSProperties;
  text: string | React.ReactNode;
  icon: string;
  onClick?: (text: string) => void;
  children?: React.ReactNode;
}

const Item: React.FC<ItemProps> = ({ style, text, icon, onClick = () => {}, children }) => {
  function _onClick() {
    if (typeof text === 'string') {
      onClick(text);
    }
  }

  return (
    <div className="menu__item" style={style} onClick={_onClick}>
      <Image className="menu__item__img" src={icon} alt={typeof text === 'string' ? text : ''} width={30} height={30} />
      <div className="menu__item__texts">
        <div className="menu__item__text ">{text}</div>
        {children}
      </div>
    </div>
  );
};

interface ItemsProps {
  items: { icon: string; text: string }[];
  onClick: (text: string) => void;
}

const Items: React.FC<ItemsProps> = ({ items, onClick }) => {
  return <>{items.map((item, i) => <Item key={i} {...item} onClick={onClick} />)}</>;
};

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const [hovering, setHovering] = useState('');

  function onMouseOver(e: React.MouseEvent) {
    const item = (e.target as HTMLElement).closest('.menu__item');
    if (!item) return;
    const textElement = item.querySelector('.menu__item__text');
    if (textElement) {
      setHovering(textElement.textContent || '');
    }
  }

  const onClick = (text: string) => {
    console.log(text);
    onClose();
  };

  return (
    <div className="start-menu">
      <header className="start-menu-header">
        <Image className="header__img" src="/assets/windowsIcons/user.png" alt="avatar" width={42} height={42} />
        <span className="header__text">User</span>
      </header>
      <section className="menu" onMouseOver={onMouseOver}>
        <hr className="orange-hr" />
        <div className="menu__left">
          <Item onClick={onClick} text="Internet" icon={'/assets/windowsIcons/ie.png'}>
            <div className="menu__item__subtext">Internet Explorer</div>
          </Item>
          <Item onClick={onClick} text="E-mail" icon={'/assets/windowsIcons/887(32x32).png'}>
            <div className="menu__item__subtext">Outlook Express</div>
          </Item>
          <div className="menu__separator" />
          <Items
            onClick={onClick}
            items={[
              { icon: '/assets/minesweeper/mine-icon.png', text: 'Minesweeper' },
              { icon: '/assets/windowsIcons/327(32x32).png', text: 'Notepad' },
              { icon: '/assets/windowsIcons/winamp.png', text: 'Winamp' },
              { icon: '/assets/windowsIcons/680(32x32).png', text: 'Paint' },
              { icon: '/assets/windowsIcons/846(32x32).png', text: 'Windows Media Player' },
              { icon: '/assets/windowsIcons/msn.png', text: 'Windows Messenger' },
            ]}
          />
          <div style={{ flex: 1 }} />
          <div className="menu__separator" />
          <Item
            style={hovering === 'All Programs' ? { backgroundColor: '#2f71cd', color: '#FFF' } : {}}
            text={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                All Programs
                <Image src={'/assets/windowsIcons/all-programs.ico'} alt="" width={18} height={18} style={{ marginLeft: '5px' }} />
              </div>
            }
            icon={'/assets/empty.png'}
          >
            {hovering === 'All Programs' && <SubMenu items={AllPrograms} onClick={onClick} />}
          </Item>
        </div>
        <div className="menu__right">
          <Item text="My Documents" icon={'/assets/windowsIcons/308(32x32).png'} onClick={onClick} />
          <Item
            style={hovering === 'My Recent Documents' ? { backgroundColor: '#2f71cd', color: '#FFF' } : {}}
            text="My Recent Documents"
            icon={'/assets/windowsIcons/301(32x32).png'}
          >
            <div style={{ borderLeftColor: hovering === 'My Recent Documents' ? '#FFF' : '#00136b' }} className="menu__arrow" />
            {hovering === 'My Recent Documents' && <SubMenu left="153px" items={MyRecentDocuments} onClick={onClick} />}
          </Item>
          <Items
            onClick={onClick}
            items={[
              { icon: '/assets/windowsIcons/307(32x32).png', text: 'My Pictures' },
              { icon: '/assets/windowsIcons/550(32x32).png', text: 'My Music' },
              { icon: '/assets/windowsIcons/676(32x32).png', text: 'My Computer' },
            ]}
          />
          <div className="menu__separator" />
          <Items
            onClick={onClick}
            items={[
              { icon: '/assets/windowsIcons/300(32x32).png', text: 'Control Panel' },
              { icon: '/assets/windowsIcons/227(32x32).png', text: 'Set Program Access and Defaults' },
            ]}
          />
          <Item
            style={hovering === 'Connect To' ? { backgroundColor: '#2f71cd', color: '#FFF' } : {}}
            text="Connect To"
            icon={'/assets/windowsIcons/309(32x32).png'}
          >
            <div style={{ borderLeftColor: hovering === 'Connect To' ? '#FFF' : '#00136b' }} className="menu__arrow" />
            {hovering === 'Connect To' && <SubMenu left="153px" items={ConnectTo} onClick={onClick} />}
          </Item>
          <Item onClick={onClick} text="Printers and Faxes" icon={'/assets/windowsIcons/549(32x32).png'} />
          <div className="menu__separator" />
          <Items
            onClick={onClick}
            items={[
              { icon: '/assets/windowsIcons/747(32x32).png', text: 'Help and Support' },
              { icon: '/assets/windowsIcons/299(32x32).png', text: 'Search' },
              { icon: '/assets/windowsIcons/743(32x32).png', text: 'Run...' },
            ]}
          />
        </div>
      </section>
      <footer className="start-menu-footer">
        <div className="footer__item" onClick={() => onClick('Log Off')}>
          <Image className="footer__item__img" src={'/assets/windowsIcons/546(32x32).png'} alt="" width={22} height={22} />
          <span>Log Off</span>
        </div>
        <div className="footer__item" onClick={() => onClick('Turn Off Computer')}>
          <Image className="footer__item__img" src={'/assets/windowsIcons/310(32x32).png'} alt="" width={22} height={22} />
          <span>Turn Off Computer</span>
        </div>
      </footer>
    </div>
  );
};

export default StartMenu;
