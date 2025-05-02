// Index file for Windows XP games
// Basic structure to allow lazy loading of game assets

// Solitaire
export const solitaire = {
  name: "Solitaire",
  icon: "/assets/icons/Solitaire.png",
  path: "/assets/games/solitaire",
  description: "Arrange all cards in descending order alternating colors to win.",
  assets: {
    // Will be populated with card images and other game assets
    cardBack: "/assets/games/solitaire/card_back.png",
    // More assets can be added as needed
  },
};

// Minesweeper
export const minesweeper = {
  name: "Minesweeper",
  icon: "/assets/icons/minesweeper.png",
  path: "/assets/games/minesweeper",
  description: "Clear the board without detonating any mines.",
};

// FreeCell
export const freeCell = {
  name: "FreeCell",
  icon: "/assets/icons/FreeCell.png",
  path: "/assets/games/freecell",
  description: "Move all cards to the home cells using the free cells as placeholders.",
};

// Hearts
export const hearts = {
  name: "Hearts",
  icon: "/assets/icons/Hearts.png",
  path: "/assets/games/hearts",
  description: "Avoid taking hearts and the queen of spades.",
};

// Spider Solitaire
export const spiderSolitaire = {
  name: "Spider Solitaire",
  icon: "/assets/icons/Spider Solitaire.png",
  path: "/assets/games/spider-solitaire",
  description: "Build sequences and remove them from the table.",
};

// Export all games in a collection
export const games = {
  solitaire,
  minesweeper,
  freeCell,
  hearts,
  spiderSolitaire,
};
