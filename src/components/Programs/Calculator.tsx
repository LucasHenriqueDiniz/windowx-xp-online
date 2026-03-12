
"use client";
import { useState } from "react";
import Window from "@/components/Window/Window";
import { WindowPropertiesProps } from "@/types/window-properties";

export default function Calculator({ id, isActive, isMaximized, isMinimized, zIndex, position, size }: WindowPropertiesProps) {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [resetOnNextInput, setResetOnNextInput] = useState(false);

  const handleNumberClick = (num: string) => {
    if (display.length >= 16) return; // Limit display length
    if (display === "0" || resetOnNextInput) {
      setDisplay(num);
      setResetOnNextInput(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimalClick = () => {
    if (resetOnNextInput) {
      setDisplay("0.");
      setResetOnNextInput(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperationClick = (op: string) => {
    const currentValue = parseFloat(display);
    if (prevValue !== null && operation) {
        const result = calculate(prevValue, currentValue, operation);
        setDisplay(String(result));
        setPrevValue(result);
    } else {
        setPrevValue(currentValue);
    }
    setOperation(op);
    setResetOnNextInput(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? Infinity : a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || operation === null) return;
    const currentValue = parseFloat(display);
    const result = calculate(prevValue, currentValue, operation);
    setDisplay(String(result));
    setPrevValue(result); // The result becomes the new prevValue for subsequent operations
    setOperation(null);
    setResetOnNextInput(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    setResetOnNextInput(false);
  };

  const handleClearEntry = () => {
    setDisplay("0");
    setResetOnNextInput(false);
  };

  const handleBackspace = () => {
    if (resetOnNextInput) {
      setDisplay("0");
      setResetOnNextInput(false);
      return;
    }
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };

  const handleMemoryStore = () => setMemory(parseFloat(display));
  const handleMemoryRecall = () => memory !== null && setDisplay(String(memory));
  const handleMemoryClear = () => setMemory(null);
  const handleMemoryAdd = () => setMemory((mem) => (mem || 0) + parseFloat(display));
  const handleMemorySubtract = () => setMemory((mem) => (mem || 0) - parseFloat(display));

  const handlePlusMinusToggle = () => setDisplay((d) => d.startsWith("-") ? d.substring(1) : "-" + d);
  const handleSquareRoot = () => setDisplay(String(Math.sqrt(parseFloat(display))));
  const handlePercentage = () => {
      if (prevValue !== null) {
        const percentageValue = (parseFloat(display) / 100) * prevValue;
        setDisplay(String(percentageValue));
      }
  };
  const handleInverse = () => setDisplay(String(1 / parseFloat(display)));

  const Button = ({ onClick, children, className, title }: { onClick: () => void, children: React.ReactNode, className?: string, title?: string }) => (
    <button 
      onClick={onClick} 
      className={`h-7 w-11/12 justify-self-center self-center border-t border-l border-b-2 border-r-2 border-gray-100 bg-[#E1E1E1] text-black focus:outline-none active:border-t-2 active:border-l-2 active:border-b active:border-r active:border-gray-800 ${className}`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <Window
      id={id}
      title="Calculator"
      icon="/assets/icons/calculator.png"
      isActive={isActive}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
      zIndex={zIndex}
      initialPosition={position || { x: 150, y: 150 }}
      initialSize={size || { width: 260, height: 250 }}
      minWidth={260}
      minHeight={250}
      resizable={false}
    >
      <div className="flex flex-col h-full bg-[#D4D0C8] p-1.5 font-sans">
        {/* Menu Bar - Simplified for XP look */}
        <div className="text-xs flex mb-1.5">
            <p className="px-2 hover:bg-blue-600 hover:text-white">View</p>
            <p className="px-2 hover:bg-blue-600 hover:text-white">Edit</p>
            <p className="px-2 hover:bg-blue-600 hover:text-white">Help</p>
        </div>

        {/* Display */}
        <div className="bg-white border-2 border-gray-500 p-1 text-right h-10 flex items-center justify-end mb-2 shadow-inner-custom">
          <span className="text-2xl font-mono tracking-wide">{display}</span>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-5 grid-rows-4 gap-y-1.5 gap-x-2 flex-grow">
          {/* Memory buttons */}
          <Button onClick={handleMemoryClear} className="text-red-600">MC</Button>
          <Button onClick={handleMemoryRecall} className="text-red-600">MR</Button>
          <Button onClick={handleMemoryStore} className="text-red-600">MS</Button>
          <Button onClick={handleMemoryAdd} className="text-red-600">M+</Button>
          <Button onClick={handleMemorySubtract} className="text-red-600">M-</Button>

          {/* Row 2 */}
          <Button onClick={handleBackspace} className="text-red-600">←</Button>
          <Button onClick={handleClearEntry} className="text-red-600">CE</Button>
          <Button onClick={handleClear} className="text-red-600">C</Button>
          <Button onClick={handlePlusMinusToggle} className="text-red-600">±</Button>
          <Button onClick={handleSquareRoot} className="text-red-600">√</Button>
          
          {/* Row 3 - Numbers & Operators */}
          <Button onClick={() => handleNumberClick("7")} className="text-blue-700 font-semibold">7</Button>
          <Button onClick={() => handleNumberClick("8")} className="text-blue-700 font-semibold">8</Button>
          <Button onClick={() => handleNumberClick("9")} className="text-blue-700 font-semibold">9</Button>
          <Button onClick={() => handleOperationClick("/")} className="text-red-600">/</Button>
          <Button onClick={handlePercentage} className="text-blue-700">%</Button>

          {/* Row 4 - Numbers & Operators */}
          <Button onClick={() => handleNumberClick("4")} className="text-blue-700 font-semibold">4</Button>
          <Button onClick={() => handleNumberClick("5")} className="text-blue-700 font-semibold">5</Button>
          <Button onClick={() => handleNumberClick("6")} className="text-blue-700 font-semibold">6</Button>
          <Button onClick={() => handleOperationClick("*")} className="text-red-600">*</Button>
          <Button onClick={handleInverse} className="text-blue-700">1/x</Button>

          {/* Row 5 - Numbers & Operators */}
          <div className="grid grid-cols-subgrid col-span-5">
            <div className="col-start-1 col-span-3 grid grid-cols-3 gap-x-2">
              <Button onClick={() => handleNumberClick("1")} className="text-blue-700 font-semibold">1</Button>
              <Button onClick={() => handleNumberClick("2")} className="text-blue-700 font-semibold">2</Button>
              <Button onClick={() => handleNumberClick("3")} className="text-blue-700 font-semibold">3</Button>
            </div>
            <div className="col-start-4 col-span-1">
               <Button onClick={() => handleOperationClick("-")} className="text-red-600">-</Button>
            </div>
            <div className="row-span-2 col-start-5 col-span-1">
                <Button onClick={handleEquals} className="text-red-600 h-full">=</Button>
            </div>
          </div>

           {/* Row 6 - Numbers & Operators */}
          <div className="grid grid-cols-subgrid col-span-5">
            <div className="col-start-1 col-span-2">
                <Button onClick={() => handleNumberClick("0")} className="text-blue-700 font-semibold w-full">0</Button>
            </div>
            <div className="col-start-3 col-span-1">
              <Button onClick={handleDecimalClick} className="text-blue-700 font-semibold">.</Button>
            </div>
             <div className="col-start-4 col-span-1">
               <Button onClick={() => handleOperationClick("+")} className="text-red-600">+</Button>
            </div>
          </div>

        </div>
      </div>
    </Window>
  );
}
