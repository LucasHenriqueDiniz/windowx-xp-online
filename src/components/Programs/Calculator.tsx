"use client";
import { useState } from "react";
import Window from "../Window";
import { WindowPropertiesProps } from "@/types/window-properties";

export default function Calculator({ id, isActive, isMaximized, isMinimized, zIndex, position, size }: WindowPropertiesProps) {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [resetOnNextInput, setResetOnNextInput] = useState(false);

  const handleNumberClick = (num: string) => {
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

    if (prevValue === null) {
      setPrevValue(currentValue);
    } else if (operation) {
      const result = calculate(prevValue, currentValue, operation);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setOperation(op);
    setResetOnNextInput(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || operation === null) return;

    const currentValue = parseFloat(display);
    const result = calculate(prevValue, currentValue, operation);
    setDisplay(String(result));
    setPrevValue(null);
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
    if (display.length === 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleMemoryStore = () => {
    setMemory(parseFloat(display));
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory));
      setResetOnNextInput(false);
    }
  };

  const handleMemoryClear = () => {
    setMemory(null);
  };

  const handleMemoryAdd = () => {
    if (memory !== null) {
      setMemory(memory + parseFloat(display));
    } else {
      setMemory(parseFloat(display));
    }
  };

  const handleMemorySubtract = () => {
    if (memory !== null) {
      setMemory(memory - parseFloat(display));
    } else {
      setMemory(-parseFloat(display));
    }
  };

  const handlePlusMinusToggle = () => {
    if (display !== "0") {
      if (display.startsWith("-")) {
        setDisplay(display.substring(1));
      } else {
        setDisplay("-" + display);
      }
    }
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      const result = Math.sqrt(value);
      setDisplay(String(result));
      setResetOnNextInput(true);
    }
  };

  const handlePercentage = () => {
    if (prevValue !== null) {
      const result = (parseFloat(display) / 100) * prevValue;
      setDisplay(String(result));
    } else {
      const result = parseFloat(display) / 100;
      setDisplay(String(result));
    }
  };

  const handleInverse = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      const result = 1 / value;
      setDisplay(String(result));
      setResetOnNextInput(true);
    }
  };

  // Calculator button styles
  const numButtonClass = "border border-gray-400 bg-white hover:bg-gray-100 active:bg-gray-200 py-1";
  const opButtonClass = "border border-gray-400 bg-[#ECE9D8] hover:bg-gray-100 active:bg-gray-200 py-1";
  const memButtonClass = "border border-gray-400 bg-[#ECE9D8] hover:bg-gray-100 active:bg-gray-200 py-1 text-xs";
  const equalButtonClass = "border border-gray-400 bg-[#B8C7E0] hover:bg-[#A1B4D4] active:bg-[#8CA1C8] py-1";

  return (
    <Window
      id={id}
      title="Calculator"
      icon="/assets/icons/calculator.png"
      isActive={isActive}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
      zIndex={zIndex}
      initialPosition={position || { x: 100, y: 100 }}
      initialSize={size || { width: 220, height: 300 }}
      minWidth={220}
      minHeight={300}
      resizable={false}
    >
      <div className="flex flex-col h-full bg-[#ECE9D8] p-1">
        {/* Menu Bar */}
        <div className="mb-2 text-xs">
          <div className="flex">
            <button className="px-2 py-0.5 hover:bg-[#B8C7E0]">View</button>
            <button className="px-2 py-0.5 hover:bg-[#B8C7E0]">Edit</button>
            <button className="px-2 py-0.5 hover:bg-[#B8C7E0]">Help</button>
          </div>
        </div>

        {/* Display */}
        <div className="p-1 mb-2">
          <div className="bg-white border border-gray-400 p-1 text-right h-8 flex items-center justify-end">
            <span className="text-lg font-mono">{display}</span>
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-6 gap-1 flex-grow">
          {/* Row 1 - Memory Buttons */}
          <button
            className={memButtonClass}
            onClick={handleMemoryClear}
            title="Memory Clear"
          >
            MC
          </button>
          <button
            className={memButtonClass}
            onClick={handleMemoryRecall}
            title="Memory Recall"
          >
            MR
          </button>
          <button
            className={memButtonClass}
            onClick={handleMemoryStore}
            title="Memory Store"
          >
            MS
          </button>
          <button
            className={memButtonClass}
            onClick={handleMemoryAdd}
            title="Memory Add"
          >
            M+
          </button>
          <button
            className={memButtonClass}
            onClick={handleMemorySubtract}
            title="Memory Subtract"
          >
            M-
          </button>
          <button
            className={opButtonClass}
            onClick={handleBackspace}
            title="Backspace"
          >
            ←
          </button>
          {/* Row 2 */}
          <button
            className={opButtonClass}
            onClick={handleClearEntry}
            title="Clear Entry"
          >
            CE
          </button>
          <button
            className={opButtonClass}
            onClick={handleClear}
            title="Clear All"
          >
            C
          </button>
          <button
            className={opButtonClass}
            onClick={handlePlusMinusToggle}
            title="Change Sign"
          >
            ±
          </button>
          <button
            className={opButtonClass}
            onClick={handleSquareRoot}
            title="Square Root"
          >
            √
          </button>
          <button
            className={opButtonClass}
            onClick={() => handleOperationClick("÷")}
            title="Divide"
          >
            ÷
          </button>
          <button
            className={opButtonClass}
            onClick={handlePercentage}
            title="Percentage"
          >
            %
          </button>
          {/* Row 3 */}
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("7")}
          >
            7
          </button>
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("8")}
          >
            8
          </button>
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("9")}
          >
            9
          </button>
          <button
            className={opButtonClass}
            onClick={() => handleOperationClick("×")}
            title="Multiply"
          >
            ×
          </button>
          <button
            className={opButtonClass}
            onClick={handleInverse}
            title="Inverse"
          >
            1/x
          </button>
          <div></div> {/* Empty cell for layout */}
          {/* Row 4 */}
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("4")}
          >
            4
          </button>
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("5")}
          >
            5
          </button>
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("6")}
          >
            6
          </button>
          <button
            className={opButtonClass}
            onClick={() => handleOperationClick("-")}
            title="Subtract"
          >
            -
          </button>
          <div></div> {/* Empty cell for layout */}
          <div></div> {/* Empty cell for layout */}
          {/* Row 5 */}
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("1")}
          >
            1
          </button>
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("2")}
          >
            2
          </button>
          <button
            className={numButtonClass}
            onClick={() => handleNumberClick("3")}
          >
            3
          </button>
          <button
            className={opButtonClass}
            onClick={() => handleOperationClick("+")}
            title="Add"
          >
            +
          </button>
          <div></div> {/* Empty cell for layout */}
          <div></div> {/* Empty cell for layout */}
          {/* Row 6 */}
          <button
            className={`${numButtonClass} col-span-2`}
            onClick={() => handleNumberClick("0")}
          >
            0
          </button>
          <button
            className={numButtonClass}
            onClick={handleDecimalClick}
            title="Decimal Point"
          >
            .
          </button>
          <button
            className={`${equalButtonClass} col-span-2`}
            onClick={handleEquals}
            title="Equals"
          >
            =
          </button>
          <div></div> {/* Empty cell for layout */}
        </div>
      </div>
    </Window>
  );
}
