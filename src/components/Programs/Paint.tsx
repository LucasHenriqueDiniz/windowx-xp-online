
import React from 'react';
import Window from '@/components/Window/Window';

// The reference implementation uses an iframe to embed jspaint.app
// This is a faithful recreation of the classic MS Paint application.
// We will adopt the same strategy.

const Paint: React.FC<{ isFocus?: boolean }> = ({ isFocus }) => {
  return (
    <Window title="Paint" icon="/assets/icons/paint.png">
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'rgb(192,192,192)', // XP's classic grey background
        }}
      >
        <iframe
          src="https://jspaint.app"
          frameBorder="0"
          title="Paint"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />
        {/* Overlay to prevent interaction when the window is not in focus */}
        {!isFocus && (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        )}
      </div>
    </Window>
  );
};

export default Paint;
