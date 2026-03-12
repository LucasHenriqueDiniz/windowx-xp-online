"use client";
import React, { useEffect, useReducer } from 'react';
import Image from 'next/image';
import Window from '@/components/Window/Window';
import { WindowPropertiesProps } from '@/types/window-properties';

const mineImages = {
    smile: '/assets/winXPassets/minesweeper/smile.png',
    dead: '/assets/winXPassets/minesweeper/dead.png',
    win: '/assets/winXPassets/minesweeper/win.png',
    ohh: '/assets/winXPassets/minesweeper/ohh.png',
    flag: '/assets/winXPassets/minesweeper/flag.png',
    mine: '/assets/winXPassets/minesweeper/mine-ceil.png',
    mineDeath: '/assets/winXPassets/minesweeper/mine-death.png',
    misFlagged: '/assets/winXPassets/minesweeper/misflagged.png',
    question: '/assets/winXPassets/minesweeper/question.png',
    open: (i: number) => `/assets/winXPassets/minesweeper/open${i}.png`,
};

const difficultySettings = {
    Beginner: { rows: 9, columns: 9, mines: 10 },
    Intermediate: { rows: 16, columns: 16, mines: 40 },
    Expert: { rows: 16, columns: 30, mines: 99 },
};

type Difficulty = keyof typeof difficultySettings;
type Status = 'new' | 'started' | 'died' | 'won';
type CellState = 'cover' | 'flag' | 'unknown' | 'open' | 'die' | 'misflagged' | 'mine';

interface Cell {
    state: CellState;
    minesAround: number; 
}

interface GameState {
    difficulty: Difficulty;
    status: Status;
    rows: number;
    columns: number;
    mines: number;
    cells: Cell[];
    remainMines: number;
    seconds: number;
}

const getInitialState = (difficulty: Difficulty = 'Beginner'): GameState => {
    const settings = difficultySettings[difficulty];
    return {
        difficulty,
        status: 'new',
        ...settings,
        cells: Array(settings.rows * settings.columns).fill({}).map(() => ({ state: 'cover', minesAround: 0 } as Cell)),
        remainMines: settings.mines,
        seconds: 0,
    };
};

const Minesweeper: React.FC<WindowPropertiesProps> = (props) => {

    const reducer = (state: GameState, action): GameState => {
        switch (action.type) {
            case 'RESTART':
                return getInitialState(action.difficulty || state.difficulty);
            case 'START': {
                const { cells, mines } = placeMines(state.cells, state.rows, state.columns, state.mines, action.startIndex);
                return { ...state, status: 'started', cells, remainMines: mines };
            }
            case 'OPEN_CELL':
                return openCell(state, action.index);
            case 'TOGGLE_FLAG':
                return toggleFlag(state, action.index);
            case 'SET_STATUS':
                return { ...state, status: action.status };
            case 'TICK':
                return { ...state, seconds: state.seconds + 1 };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, getInitialState());

    useEffect(() => {
        let timer;
        if (state.status === 'started') {
            timer = setInterval(() => dispatch({ type: 'TICK' }), 1000);
        } 
        return () => clearInterval(timer);
    }, [state.status]);

    const placeMines = (cells: Cell[], rows: number, columns: number, mines: number, startIndex: number): { cells: Cell[], mines: number } => {
        const newCells = cells.map(c => ({...c}));
        let minesPlaced = 0;
        const totalCells = rows * columns;

        while (minesPlaced < mines) {
            const index = Math.floor(Math.random() * totalCells);
            if (index !== startIndex && newCells[index].minesAround !== -1) {
                newCells[index].minesAround = -1; 
                minesPlaced++;
                getNeighbors(index, rows, columns).forEach(n => {
                    if (newCells[n].minesAround !== -1) newCells[n].minesAround++;
                });
            }
        }
        return { cells: newCells, mines };
    };

    const getNeighbors = (index: number, rows: number, columns: number) => {
        const neighbors = [];
        const r = Math.floor(index / columns);
        const c = index % columns;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newR = r + i;
                const newC = c + j;
                if (newR >= 0 && newR < rows && newC >= 0 && newC < columns) {
                    neighbors.push(newR * columns + newC);
                }
            }
        }
        return neighbors;
    };

    const openCell = (currentState: GameState, index: number): GameState => {
        const state = {...currentState, cells: currentState.cells.map(c => ({...c})) };

        if (state.cells[index].state !== 'cover') return state;

        if (state.cells[index].minesAround === -1) {
            state.status = 'died';
            state.cells[index].state = 'die';
            state.cells.forEach((cell) => {
                if(cell.minesAround === -1 && cell.state !== 'die') cell.state = 'mine';
                if(cell.state === 'flag' && cell.minesAround !== -1) cell.state = 'misflagged';
            });
            return state;
        }
        
        const open = (idx: number) => {
            if (state.cells[idx].state !== 'cover') return;
            state.cells[idx].state = 'open';
            if (state.cells[idx].minesAround === 0) {
                getNeighbors(idx, state.rows, state.columns).forEach(n => open(n));
            }
        };

        open(index);
        
        const won = state.cells.every(c => c.state === 'open' || c.minesAround === -1);
        if(won) state.status = 'won';

        return state;
    };

    const toggleFlag = (currentState: GameState, index: number): GameState => {
        const state = {...currentState, cells: currentState.cells.map(c => ({...c})) };
        const cell = state.cells[index];

        if (cell.state === 'cover') {
            cell.state = 'flag';
            state.remainMines--;
        } else if (cell.state === 'flag') {
            cell.state = 'unknown';
            state.remainMines++;
        } else if (cell.state === 'unknown') {
            cell.state = 'cover';
        }

        return state;
    }

    const handleCellClick = (index: number) => {
        if (state.status === 'died' || state.status === 'won') return;
        if (state.status === 'new') {
            dispatch({ type: 'START', startIndex: index });
        }
        dispatch({ type: 'OPEN_CELL', index });
    };

    const handleCellContextMenu = (e, index: number) => {
        e.preventDefault();
        if (state.status === 'died' || state.status === 'won') return;
        if (state.status === 'new') return;
        dispatch({ type: 'TOGGLE_FLAG', index });
    };

    const getFace = () => {
        switch (state.status) {
            case 'died': return mineImages.dead;
            case 'won': return mineImages.win;
            default: return mineImages.smile;
        }
    };

    const renderCell = (cell: Cell, index: number) => {
        let image = null;
        let backgroundClass = 'bg-gray-400 border-2 border-r-gray-500 border-b-gray-500';

        switch(cell.state) {
            case 'open':
                 backgroundClass = 'bg-gray-300 border-gray-400';
                if (cell.minesAround > 0) image = mineImages.open(cell.minesAround);
                break;
            case 'flag': image = mineImages.flag; break;
            case 'unknown': image = mineImages.question; break;
            case 'die': image = mineImages.mineDeath; backgroundClass = 'bg-red-500'; break;
            case 'mine': image = mineImages.mine; break;
            case 'misflagged': image = mineImages.misFlagged; break;
        }

        return (
            <div 
                key={index} 
                className={`w-6 h-6 flex justify-center items-center ${backgroundClass}`}
                onClick={() => handleCellClick(index)}
                onContextMenu={(e) => handleCellContextMenu(e, index)}
            >
                {image && <Image src={image} alt="" width={16} height={16} />}
            </div>
        )
    }

    return (
        <Window {...props} title="Minesweeper">
            <div className="bg-gray-300 p-2">
                <div className="flex justify-between items-center mb-2 p-1 bg-gray-400 border-2 border-r-gray-500 border-b-gray-500">
                    <div className="bg-black text-red-500 font-mono text-2xl px-1">{String(state.remainMines).padStart(3, '0')}</div>
                    <button onClick={() => dispatch({type: 'RESTART'})} className="w-8 h-8">
                        <Image src={getFace()} alt="face" width={32} height={32} />
                    </button>
                    <div className="bg-black text-red-500 font-mono text-2xl px-1">{String(state.seconds).padStart(3, '0')}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${state.columns}, 1.5rem)`}}>
                    {state.cells.map(renderCell)}
                </div>
            </div>
        </Window>
    );
};

export default Minesweeper;
