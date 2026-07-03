import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { projects } from '../../data/projects';
import { identity } from '../../data/profile';
import { BANNER, SECRET } from './ascii';
import {
  COMMANDS,
  buildCommandMap,
  completionNames,
  type Command,
  type CommandContext,
} from './commands';

export interface TerminalActions {
  navigate: (to: string) => void;
  scrollToSection: (id: string) => void;
  close: () => void;
  login: (username: string, password: string) => Promise<boolean>;
}

interface TermLine {
  id: number;
  node: React.ReactNode;
}

const HISTORY_KEY = 'delin.terminal.history';
const MAX_HISTORY = 100;
const SECTIONS = ['home', 'about', 'projects', 'contact'];
const PROMPT = `${identity.handle}@${identity.host}:~$`;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

function commonPrefix(words: string[]): string {
  if (!words.length) return '';
  let prefix = words[0];
  for (const w of words) {
    while (!w.startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (!prefix) break;
  }
  return prefix;
}

const PromptEcho: React.FC<{ command: string }> = ({ command }) =>
  React.createElement(
    'p',
    { className: 'term-echo' },
    React.createElement('span', { className: 'term-prompt' }, PROMPT),
    ' ',
    command
  );

const Welcome: React.FC = () =>
  React.createElement(
    'div',
    { className: 'term-welcome' },
    React.createElement('pre', { className: 'term-pre term-accent' }, BANNER.trim()),
    React.createElement(
      'p',
      { className: 'term-muted' },
      'delin-sh 1.0 — interactive portfolio shell'
    ),
    React.createElement(
      'p',
      null,
      'type ',
      React.createElement('span', { className: 'term-accent' }, 'help'),
      ' to see everything, or try ',
      React.createElement('span', { className: 'term-accent' }, 'about'),
      ', ',
      React.createElement('span', { className: 'term-accent' }, 'projects'),
      ', ',
      React.createElement('span', { className: 'term-accent' }, 'neofetch'),
      '.'
    )
  );

const SecretArt: React.FC = () =>
  React.createElement('pre', { className: 'term-pre term-warning' }, SECRET);

export function useTerminal(actions: TerminalActions) {
  const commandMap = useMemo(() => buildCommandMap(), []);
  const completions = useMemo(() => completionNames(), []);

  const [lines, setLines] = useState<TermLine[]>([]);
  const [input, setInput] = useState('');
  const [matrixOn, setMatrixOn] = useState(false);
  const [doomOn, setDoomOn] = useState(false);
  const [pendingInput, setPendingInput] = useState<{
    callback: (value: string) => void;
    hidden: boolean;
  } | null>(null);

  // "busy" = an animated output (hack, sl, rm -rf) is still running, so the
  // input prompt is hidden until it finishes — like a real shell. Tracked by a
  // set of ids so begin/end are idempotent (StrictMode-safe).
  const busyIdsRef = useRef<Set<string>>(new Set());
  const [busyCount, setBusyCount] = useState(0);
  const busyApi = useMemo(
    () => ({
      begin: (id: string) => {
        if (busyIdsRef.current.has(id)) return;
        busyIdsRef.current.add(id);
        setBusyCount(busyIdsRef.current.size);
      },
      end: (id: string) => {
        if (!busyIdsRef.current.has(id)) return;
        busyIdsRef.current.delete(id);
        setBusyCount(busyIdsRef.current.size);
      },
    }),
    []
  );

  const inputType = pendingInput?.hidden ? 'password' : 'text';

  const requestInput = useCallback(
    (callback: (value: string) => void, hidden = false) => {
      setPendingInput({ callback, hidden });
    },
    []
  );

  const idRef = useRef(0);
  const bootedRef = useRef(false);
  const historyRef = useRef<string[]>(loadHistory());
  const [history, setHistory] = useState<string[]>(historyRef.current);
  const historyIndexRef = useRef<number | null>(null);
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stickRef = useRef(true);
  const roRef = useRef<ResizeObserver | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Track whether the user is parked at the bottom; if they scroll up to read
  // history we stop force-following, and resume once they return to the bottom.
  const onBodyScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  }, []);

  // Callback ref: attach a ResizeObserver the moment the (conditionally rendered)
  // content node mounts, so the view follows animated output (hack, sl, rm -rf)
  // as it grows — that growth changes the element's size, not the `lines` array.
  const setContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      roRef.current?.disconnect();
      roRef.current = null;
      if (node && typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
          if (stickRef.current) scrollToBottom();
        });
        ro.observe(node);
        roRef.current = ro;
      }
    },
    [scrollToBottom]
  );

  const pushLine = useCallback((node: React.ReactNode) => {
    idRef.current += 1;
    const id = idRef.current; // capture now — the updater runs later, after more increments
    setLines((prev) => [...prev, { id, node }]);
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const exitMatrix = useCallback(() => setMatrixOn(false), []);
  const exitDoom = useCallback(() => setDoomOn(false), []);
  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const openLink = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const run = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      stickRef.current = true; // running a command always follows its output
      pushLine(React.createElement(PromptEcho, { command: rawInput }));

      if (trimmed) {
        const next = [...historyRef.current, trimmed].slice(-MAX_HISTORY);
        historyRef.current = next;
        setHistory(next);
        saveHistory(next);
      }
      historyIndexRef.current = null;
      if (!trimmed) return;

      const tokens = trimmed.split(/\s+/);
      const name = tokens[0].toLowerCase();
      const args = tokens.slice(1);
      const cmd = commandMap.get(name);

      if (!cmd) {
        pushLine(
          React.createElement(
            'span',
            { className: 'term-error' },
            `command not found: ${tokens[0]} — type `,
            React.createElement('span', { className: 'term-accent' }, 'help')
          )
        );
        return;
      }

      const ctx: CommandContext = {
        args,
        raw: trimmed,
        command: name,
        navigate: (to) => actionsRef.current.navigate(to),
        scrollToSection: (id) => actionsRef.current.scrollToSection(id),
        openLink,
        clear,
        close: () => actionsRef.current.close(),
        setMatrix: setMatrixOn,
        setDoom: setDoomOn,
        history: historyRef.current,
        listCommands: () => COMMANDS,
        findCommand: (n) => commandMap.get(n.toLowerCase()),
        requestInput,
        pushLine,
        login: actionsRef.current.login,
      };

      const result = cmd.run(ctx);
      if (result !== null && result !== undefined) pushLine(result);
    },
    [pushLine, commandMap, openLink, clear, requestInput]
  );

  const recallHistory = useCallback((direction: -1 | 1) => {
    const h = historyRef.current;
    if (!h.length) return;
    let idx = historyIndexRef.current;
    if (direction === -1) {
      idx = idx === null ? h.length - 1 : Math.max(0, idx - 1);
    } else {
      if (idx === null) return;
      idx += 1;
      if (idx >= h.length) {
        historyIndexRef.current = null;
        setInput('');
        return;
      }
    }
    historyIndexRef.current = idx;
    setInput(h[idx]);
  }, []);

  const autocomplete = useCallback(() => {
    if (!input.trim()) return;
    const parts = input.split(/\s+/);
    const last = parts[parts.length - 1].toLowerCase();

    let pool = completions;
    if (parts.length > 1) {
      const first = parts[0].toLowerCase();
      if (first === 'open' || first === 'projects') {
        pool = projects.map((p) => p.slug);
      } else if (first === 'goto') {
        pool = SECTIONS;
      } else if (first === 'play') {
        pool = ['doom'];
      } else if (first === 'man') {
        pool = completions;
      } else {
        return;
      }
    }

    const matches = pool.filter((c) => c.startsWith(last));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      setInput(parts.join(' ') + (parts.length === 1 ? ' ' : ''));
    } else if (matches.length > 1) {
      const common = commonPrefix(matches);
      if (common.length > last.length) {
        parts[parts.length - 1] = common;
        setInput(parts.join(' '));
      }
      pushLine(
        React.createElement(
          'span',
          { className: 'term-muted' },
          matches.join('   ')
        )
      );
    }
  }, [input, completions, pushLine]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Interactive prompt mode — route Enter to the pending callback.
      if (pendingInput) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const value = input;
          const { callback } = pendingInput;
          setPendingInput(null);
          setInput('');
          callback(value);
        } else if (
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'Tab'
        ) {
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const value = input;
        setInput('');
        run(value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        recallHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        recallHistory(1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        autocomplete();
      }
    },
    [input, pendingInput, run, recallHistory, autocomplete]
  );

  const boot = useCallback(() => {
    setPendingInput(null); // clear any stale interactive prompt
    if (bootedRef.current) return;
    bootedRef.current = true;
    pushLine(React.createElement(Welcome));
  }, [pushLine]);

  const printSecret = useCallback(() => {
    pushLine(React.createElement(SecretArt));
  }, [pushLine]);

  // pin to bottom when new lines are pushed (after layout settles); the
  // ResizeObserver wired via setContentRef handles growth *within* a line node.
  useEffect(() => {
    if (!stickRef.current) return;
    const raf = window.requestAnimationFrame(scrollToBottom);
    return () => window.cancelAnimationFrame(raf);
  }, [lines, scrollToBottom]);

  return {
    lines,
    input,
    setInput,
    onInputKeyDown,
    run,
    boot,
    clear,
    history,
    matrixOn,
    exitMatrix,
    doomOn,
    exitDoom,
    printSecret,
    busy: busyCount > 0,
    busyApi,
    scrollRef,
    setContentRef,
    onBodyScroll,
    inputRef,
    focusInput,
    prompt: PROMPT,
    requestInput,
    inputType,
    pushLine,
  };
}

export type UseTerminal = ReturnType<typeof useTerminal>;
export type { Command };
