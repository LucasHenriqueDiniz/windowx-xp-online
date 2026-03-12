export interface MenuItem {
    type: 'item';
    icon: string;
    text: string;
    onClick?: () => void;
  }
  
  export interface MenuSeparator {
    type: 'separator';
  }
  
  export interface SubMenu {
    type: 'menu';
    icon: string;
    text: string;
    items: (MenuItem | MenuSeparator | SubMenu)[];
    bottom?: 'initial';
  }
  
  export type StartMenuItem = MenuItem | MenuSeparator | SubMenu;
  
  const empty = '/assets/empty.png';
  const backup = '/assets/windowsIcons/23(16x16).png';
  const keyboard = '/assets/windowsIcons/58(16x16).png';
  const cmd = '/assets/windowsIcons/56(16x16).png';
  const calculator = '/assets/windowsIcons/74(16x16).png';
  const utility = '/assets/windowsIcons/119(16x16).png';
  const volume = '/assets/windowsIcons/120(16x16).png';
  const characterMap = '/assets/windowsIcons/127(16x16).png';
  const cleanDisk = '/assets/windowsIcons/128(16x16).png';
  const wordPad = '/assets/windowsIcons/153(16x16).png';
  const winExplorer = '/assets/windowsIcons/156(16x16).png';
  const MSN = '/assets/windowsIcons/159(16x16).png';
  const sync = '/assets/windowsIcons/182(16x16).png';
  const security = '/assets/windowsIcons/214(16x16).png';
  const access = '/assets/windowsIcons/227(16x16).png';
  const wireless = '/assets/windowsIcons/234(16x16).png';
  const accessibility = '/assets/windowsIcons/238(16x16).png';
  const connection = '/assets/windowsIcons/309(16x16).png';
  const update = '/assets/windowsIcons/322(16x16).png';
  const notepad = '/assets/windowsIcons/327(16x16).png';
  const networkAssistance = '/assets/windowsIcons/357(16x16).png';
  const menu = '/assets/windowsIcons/358(16x16).png';
  const transfer = '/assets/windowsIcons/367(16x16).png';
  const defragmenter = '/assets/windowsIcons/374(16x16).png';
  const catalog = '/assets/windowsIcons/392(16x16).png';
  const networkConnection = '/assets/windowsIcons/404(16x16).png';
  const info = '/assets/windowsIcons/505(16x16).png';
  const address = '/assets/windowsIcons/554(16x16).png';
  const connectionWizard = '/assets/windowsIcons/663(16x16).png';
  const networkSetup = '/assets/windowsIcons/664(16x16).png';
  const hyperCmd = '/assets/windowsIcons/669(16x16).png';
  const painter = '/assets/windowsIcons/680(16x16).png';
  const sound = '/assets/windowsIcons/690(16x16).png';
  const recent = '/assets/windowsIcons/716(16x16).png';
  const compatibility = '/assets/windowsIcons/747(16x16).png';
  const magnifier = '/assets/windowsIcons/817(16x16).png';
  const mediaPlayer = '/assets/windowsIcons/846(16x16).png';
  const tour = '/assets/windowsIcons/853(32x32).png';
  const outlook = '/assets/windowsIcons/887(16x16).png';
  const spade = '/assets/windowsIcons/888(16x16).png';
  const reversi = '/assets/windowsIcons/889(16x16).png';
  const onlineHeart = '/assets/windowsIcons/890(16x16).png';
  const checker = '/assets/windowsIcons/891(16x16).png';
  const backgammon = '/assets/windowsIcons/892(16x16).png';
  const movieMaker = '/assets/windowsIcons/894(16x16).png';
  const ie = '/assets/windowsIcons/896(16x16).png';
  const messenger = '/assets/windowsIcons/msn.png';
  const spider = '/assets/windowsIcons/spider.png';
  const freecell = '/assets/windowsIcons/freecell.png';
  const heart = '/assets/windowsIcons/heart.png';
  const rdp = '/assets/windowsIcons/rdp.png';
  const solitaire = '/assets/windowsIcons/solitaire.png';
  const narrator = '/assets/windowsIcons/narrator.ico';
  const pinball = '/assets/windowsIcons/pinball.png';
  const restore = '/assets/windowsIcons/restore.ico';
  const mine = '/assets/minesweeper/mine-icon.png';
  
  export const MyRecentDocuments: StartMenuItem[] = [
    {
      type: 'item',
      icon: empty,
      text: '(Empty)',
    },
  ];
  export const ConnectTo: StartMenuItem[] = [
    {
      type: 'item',
      icon: MSN,
      text: 'MSN',
    },
    {
      type: 'item',
      icon: connection,
      text: 'Show all connections',
    },
  ];
  export const AllPrograms: StartMenuItem[] = [
    {
      type: 'item',
      icon: access,
      text: 'Set Program Access and Defaults',
    },
    {
      type: 'item',
      icon: catalog,
      text: 'Windows Catalog',
    },
    {
      type: 'item',
      icon: update,
      text: 'Windows Update',
    },
    {
      type: 'separator',
    },
    {
      type: 'menu',
      icon: menu,
      text: 'Accessories',
      items: [
        {
          type: 'menu',
          icon: menu,
          text: 'Accessibility',
          bottom: 'initial',
          items: [
            {
              type: 'item',
              icon: accessibility,
              text: 'Accessibility Wizard',
            },
            {
              type: 'item',
              icon: magnifier,
              text: 'Magnifier',
            },
            {
              type: 'item',
              icon: narrator,
              text: 'Narrator',
            },
            {
              type: 'item',
              icon: keyboard,
              text: 'On-Screen Keyboard',
            },
            {
              type: 'item',
              icon: utility,
              text: 'Utility Manager',
            },
          ],
        },
        {
          type: 'menu',
          icon: menu,
          text: 'Communications',
          bottom: 'initial',
          items: [
            {
              type: 'item',
              icon: hyperCmd,
              text: 'HyperTerminal',
            },
            {
              type: 'item',
              icon: networkConnection,
              text: 'Network Connections',
            },
            {
              type: 'item',
              icon: networkSetup,
              text: 'Network Setup Wizard',
            },
            {
              type: 'item',
              icon: connectionWizard,
              text: 'New Connection Wizard',
            },
            {
              type: 'item',
              icon: wireless,
              text: 'Wireless Network Setup Wizard',
            },
          ],
        },
        {
          type: 'menu',
          icon: menu,
          text: 'Entertainment',
          bottom: 'initial',
          items: [
            {
              type: 'item',
              icon: sound,
              text: 'Sound Recorder',
            },
            {
              type: 'item',
              icon: volume,
              text: 'Volume Control',
            },
            {
              type: 'item',
              icon: mediaPlayer,
              text: 'Windows Media Player',
            },
          ],
        },
        {
          type: 'menu',
          icon: menu,
          text: 'System Tools',
          bottom: 'initial',
          items: [
            {
              type: 'item',
              icon: backup,
              text: 'Backup',
            },
            {
              type: 'item',
              icon: characterMap,
              text: 'Character Map',
            },
            {
              type: 'item',
              icon: cleanDisk,
              text: 'Disk Cleanup',
            },
            {
              type: 'item',
              icon: defragmenter,
              text: 'Disk Defragmenter',
            },
            {
              type: 'item',
              icon: transfer,
              text: 'Files and Settings Transfer Wizard',
            },
            {
              type: 'item',
              icon: recent,
              text: 'Scheduled Tasks',
            },
            {
              type: 'item',
              icon: security,
              text: 'Security Center',
            },
            {
              type: 'item',
              icon: info,
              text: 'System Information',
            },
            {
              type: 'item',
              icon: restore,
              text: 'System Restore',
            },
          ],
        },
        {
          type: 'item',
          icon: address,
          text: 'Address Book',
        },
        {
          type: 'item',
          icon: cmd,
          text: 'Command Prompt',
        },
        {
          type: 'item',
          icon: notepad,
          text: 'Notepad',
        },
        {
          type: 'item',
          icon: painter,
          text: 'Paint',
        },
        {
          type: 'item',
          icon: calculator,
          text: 'Calculator',
        },
        {
          type: 'item',
          icon: compatibility,
          text: 'Program Compatibility Wizard',
        },
        {
          type: 'item',
          icon: rdp,
          text: 'Remote Desktop Connection',
        },
        {
          type: 'item',
          icon: sync,
          text: 'Synchronize',
        },
        {
          type: 'item',
          icon: tour,
          text: 'Tour Windows XP',
        },
        {
          type: 'item',
          icon: winExplorer,
          text: 'Windows Explorer',
        },
        {
          type: 'item',
          icon: wordPad,
          text: 'WordPad',
        },
      ],
    },
    {
      type: 'menu',
      icon: menu,
      text: 'Games',
      items: [
        {
          type: 'item',
          icon: freecell,
          text: 'FreeCell',
        },
        {
          type: 'item',
          icon: heart,
          text: 'Hearts',
        },
        {
          type: 'item',
          icon: backgammon,
          text: 'Internet Backgammon',
        },
        {
          type: 'item',
          icon: checker,
          text: 'Internet Checkers',
        },
        {
          type: 'item',
          icon: onlineHeart,
          text: 'Internet Hearts',
        },
        {
          type: 'item',
          icon: reversi,
          text: 'Internet Reversi',
        },
        {
          type: 'item',
          icon: spade,
          text: 'Internet Spades',
        },
        {
          type: 'item',
          icon: mine,
          text: 'Minesweeper',
        },
        {
          type: 'item',
          icon: pinball,
          text: 'Pinball',
        },
        {
          type: 'item',
          icon: solitaire,
          text: 'Solitaire',
        },
        {
          type: 'item',
          icon: spider,
          text: 'Spider Solitaire',
        },
      ],
    },
    {
      type: 'menu',
      icon: menu,
      text: 'Startup',
      items: [
        {
          type: 'item',
          icon: empty,
          text: '(Empty)',
        },
      ],
    },
    {
      type: 'item',
      icon: ie,
      text: 'Internet Explorer',
    },
    {
      type: 'item',
      icon: outlook,
      text: 'Outlook Express',
    },
    {
      type: 'item',
      icon: networkAssistance,
      text: 'Remote Assistance',
    },
    {
      type: 'item',
      icon: mediaPlayer,
      text: 'Windows Media Player',
    },
    {
      type: 'item',
      icon: messenger,
      text: 'Windows Messenger',
    },
    {
      type: 'item',
      icon: movieMaker,
      text: 'Windows Movie Maker',
    },
  ];
  