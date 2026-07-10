import React from 'react';

interface DotAction {
  label: string;
  onClick: () => void;
}

const DOT_COLORS = ['red', 'yellow', 'green'] as const;

interface WindowBarProps {
  title: React.ReactNode;
  /** Dots render as buttons when given an action, decorative spans otherwise. */
  red?: DotAction;
  yellow?: DotAction;
  green?: DotAction;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

/**
 * Shared macOS-style window chrome (three dots + title) used by the page
 * "windows" and the floating terminal/doom windows. Interactive bars keep the
 * extra `term-bar` classes so the existing CSS applies unchanged.
 */
const WindowBar: React.FC<WindowBarProps> = ({
  title,
  red,
  yellow,
  green,
  onPointerDown,
}) => {
  const actions = { red, yellow, green };
  const interactive = Boolean(red || yellow || green);

  return (
    <div
      className={
        interactive ? 'terminal-window__bar term-bar' : 'terminal-window__bar'
      }
      onPointerDown={onPointerDown}
    >
      {DOT_COLORS.map((color) => {
        const action = actions[color];
        return action ? (
          <button
            key={color}
            type="button"
            className={`dot dot--${color}`}
            aria-label={action.label}
            onClick={action.onClick}
          />
        ) : (
          <span key={color} className={`dot dot--${color}`} />
        );
      })}
      <span
        className={
          interactive
            ? 'terminal-window__title term-bar__title'
            : 'terminal-window__title'
        }
      >
        {title}
      </span>
    </div>
  );
};

export default WindowBar;
