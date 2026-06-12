import React, { useContext, useEffect, useId, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { projects } from '../../data/projects';
import {
  identity,
  about,
  skills,
  journey,
  stats,
  contactMethods,
  socials,
  email,
  resumeUrl,
} from '../../data/profile';
import {
  BANNER,
  NEOFETCH_LOGO,
  TRAIN,
  COFFEE,
  cowsay,
  FORTUNES,
  JOKES,
} from './ascii';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CommandGroup = 'info' | 'navigation' | 'system' | 'fun';

export interface CommandContext {
  /** Tokens after the command word. */
  args: string[];
  /** The full, untrimmed line the user typed. */
  raw: string;
  /** The command word that was matched (lowercased). */
  command: string;
  navigate: (to: string) => void;
  scrollToSection: (id: string) => void;
  openLink: (url: string) => void;
  clear: () => void;
  close: () => void;
  setMatrix: (on: boolean) => void;
  setDoom: (on: boolean) => void;
  history: string[];
  listCommands: () => Command[];
  findCommand: (name: string) => Command | undefined;
}

export type CommandResult = React.ReactNode;

export interface Command {
  name: string;
  group: CommandGroup;
  summary: string;
  usage?: string;
  aliases?: string[];
  /** Hidden from `help`/autocomplete — used for easter eggs. */
  hidden?: boolean;
  run: (ctx: CommandContext) => CommandResult;
}

/**
 * Lets an animated output register itself as "running" so the terminal can hide
 * the input prompt until it finishes — like a real shell, where the prompt only
 * returns once the command completes. Each output passes a stable id (idempotent
 * begin/end, so it's safe under React StrictMode double-invocation).
 */
export interface BusyApi {
  begin: (id: string) => void;
  end: (id: string) => void;
}

export const TerminalBusyContext = React.createContext<BusyApi>({
  begin: () => {},
  end: () => {},
});

// ---------------------------------------------------------------------------
// Small inline helpers
// ---------------------------------------------------------------------------

const Err: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="term-error">{children}</span>
);

const Pre: React.FC<{ children: string; className?: string }> = ({
  children,
  className = '',
}) => <pre className={`term-pre ${className}`}>{children}</pre>;

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

const SECTIONS = ['home', 'about', 'projects', 'contact'];

// ---------------------------------------------------------------------------
// Output components
// ---------------------------------------------------------------------------

const HelpOutput: React.FC<{ ctx: CommandContext }> = ({ ctx }) => {
  const labels: Record<CommandGroup, string> = {
    info: 'portfolio',
    navigation: 'navigation',
    system: 'system',
    fun: 'fun & games',
  };
  const order: CommandGroup[] = ['info', 'navigation', 'system', 'fun'];
  const all = ctx.listCommands().filter((c) => !c.hidden);

  return (
    <div className="term-help">
      <p className="term-muted">
        commands — run <span className="term-accent">man &lt;cmd&gt;</span> for
        details, <span className="term-accent">Tab</span> to autocomplete.
      </p>
      {order.map((g) => {
        const cmds = all.filter((c) => c.group === g);
        if (!cmds.length) return null;
        return (
          <div key={g} className="term-help__group">
            <p className="term-help__heading"># {labels[g]}</p>
            <ul className="term-help__list">
              {cmds.map((c) => (
                <li key={c.name}>
                  <span className="term-accent">{c.name}</span>
                  <span className="term-muted">{c.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <p className="term-muted">psst — a few commands aren’t on this list. 🥚</p>
    </div>
  );
};

const ProjectDetail: React.FC<{ slug: string; ctx: CommandContext }> = ({
  slug,
  ctx,
}) => {
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return (
      <Err>
        no project '{slug}'. run <span className="term-accent">projects</span> to
        list them.
      </Err>
    );
  }
  return (
    <div className="term-block">
      <p>
        <span className="term-accent">{project.title}</span>
        <span className="term-muted"> — {project.tagline}</span>
      </p>
      <p className="term-para">{project.description}</p>
      <p className="term-muted"># stack</p>
      <p className="term-chips">
        {project.stack.map((s) => (
          <span key={s} className="term-chip">
            [{s}]
          </span>
        ))}
      </p>
      <p className="term-muted"># features</p>
      <ul className="term-list">
        {project.features.map((f) => (
          <li key={f}>▸ {f}</li>
        ))}
      </ul>
      <p className="term-muted"># challenges</p>
      <ul className="term-list">
        {project.challenges.map((c) => (
          <li key={c}>▸ {c}</li>
        ))}
      </ul>
      <p className="term-actions">
        {project.liveLink && (
          <button
            type="button"
            className="term-link"
            onClick={() => ctx.openLink(project.liveLink!)}
          >
            [ live demo ↗ ]
          </button>
        )}
        {project.githubLink && (
          <button
            type="button"
            className="term-link"
            onClick={() => ctx.openLink(project.githubLink!)}
          >
            [ source ↗ ]
          </button>
        )}
        <button
          type="button"
          className="term-link"
          onClick={() => {
            ctx.navigate(`/project/${project.slug}`);
            ctx.close();
          }}
        >
          [ open page → ]
        </button>
      </p>
    </div>
  );
};

const Neofetch: React.FC = () => {
  const langs = skills.find((s) => s.category === 'languages');
  const fields: [string, string][] = [
    ['OS', 'PortfolioOS 1.0 (terminal-edition)'],
    ['Host', `${identity.handle}@${identity.host}`],
    ['Shell', 'delin-sh 1.0'],
    ['Location', identity.location],
    ['Role', 'Front-end / Full-stack Developer'],
    ['Editor', 'vim (allegedly — try `vim`)'],
    ['Languages', (langs?.items ?? []).slice(0, 4).map((i) => i.name).join(', ')],
    ['Projects', `${projects.length} shipped`],
    ['Uptime', 'too many late nights'],
    ['Coffee', '∞ cups'],
  ];
  const palette = ['#0a0b0e', '#5ea2ff', '#5eff9e', '#ffd45e', '#ff5e6c', '#e9edf2'];
  return (
    <div className="term-neofetch">
      <pre className="term-pre term-accent term-neofetch__logo">{NEOFETCH_LOGO}</pre>
      <div className="term-neofetch__info">
        {fields.map(([k, v]) => (
          <p key={k}>
            <span className="term-accent">{k}</span>
            <span className="term-muted">: </span>
            {v}
          </p>
        ))}
        <p className="term-neofetch__palette">
          {palette.map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </p>
      </div>
    </div>
  );
};

/** Reveals lines one at a time; instant under reduced motion. */
const Reveal: React.FC<{
  lines: string[];
  intervalMs: number;
  className?: string;
}> = ({ lines, intervalMs, className = '' }) => {
  const reduced = useReducedMotion() ?? false;
  const busy = useContext(TerminalBusyContext);
  const id = useId();
  const [n, setN] = useState(reduced ? lines.length : 0);

  // hold the prompt back while the sequence is still typing itself out
  useEffect(() => {
    if (reduced) return;
    busy.begin(id);
    return () => busy.end(id);
  }, [id, reduced, busy]);

  useEffect(() => {
    if (reduced || n >= lines.length) {
      if (!reduced && n >= lines.length) busy.end(id); // done → prompt returns
      return;
    }
    const t = setTimeout(() => setN((v) => v + 1), intervalMs);
    return () => clearTimeout(t);
  }, [n, reduced, lines.length, intervalMs, busy, id]);

  return <pre className={`term-pre ${className}`}>{lines.slice(0, n).join('\n')}</pre>;
};

const HackSequence: React.FC<{ target: string }> = ({ target }) => {
  const lines = useMemo(
    () => [
      `> initializing exploit against ${target}...`,
      '> bypassing firewall [████████░░] 80%',
      '> injecting payload...',
      '> cracking root password: ********',
      '> escalating privileges...',
      '> ACCESS GRANTED ✅',
      '> ...just kidding. I only hack my own bugs. 😉',
    ],
    [target]
  );
  return <Reveal lines={lines} intervalMs={420} className="term-success" />;
};

const RmRf: React.FC = () => {
  const lines = useMemo(
    () => [
      'removing /bin...',
      'removing /etc...',
      'removing /home/delin...',
      'removing /usr...',
      'removing / (yes, everything)...',
      'undoing years of work...',
      '',
      'just kidding 😄 — nothing was harmed. (it’s all in git anyway)',
    ],
    []
  );
  return <Reveal lines={lines} intervalMs={220} className="term-danger" />;
};

const TrainRun: React.FC = () => {
  const reduced = useReducedMotion() ?? false;
  const busy = useContext(TerminalBusyContext);
  const id = useId();

  // keep the prompt hidden until the train has chugged off-screen (~3.4s anim)
  useEffect(() => {
    if (reduced) return;
    busy.begin(id);
    const t = window.setTimeout(() => busy.end(id), 3600);
    return () => {
      window.clearTimeout(t);
      busy.end(id);
    };
  }, [id, reduced, busy]);

  return (
    <div className="term-train-track">
      <pre className={`term-pre term-train${reduced ? '' : ' term-train--run'}`}>
        {TRAIN}
      </pre>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Command registry
// ---------------------------------------------------------------------------

export const COMMANDS: Command[] = [
  // ---- info ----
  {
    name: 'help',
    group: 'info',
    summary: 'list everything you can do here',
    run: (ctx) => <HelpOutput ctx={ctx} />,
  },
  {
    name: 'about',
    group: 'info',
    summary: 'who is Delin?',
    run: () => (
      <div className="term-block">
        {about.map((p, i) => (
          <p key={i} className="term-para">
            {p}
          </p>
        ))}
      </div>
    ),
  },
  {
    name: 'whoami',
    group: 'info',
    summary: 'the short version',
    run: () => (
      <p>
        <span className="term-accent">{identity.handle}</span> — {identity.role}
      </p>
    ),
  },
  {
    name: 'skills',
    group: 'info',
    summary: 'tech stack & superpowers',
    run: () => (
      <div className="term-tree">
        <p className="term-muted">~/skills</p>
        {skills.map((s) => (
          <div key={s.category} className="term-tree__group">
            <p className="term-accent">{s.category}/</p>
            <ul className="term-list">
              {s.items.map((i) => (
                <li key={i.name}>
                  <span className="term-muted">▸</span> {i.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'projects',
    group: 'info',
    summary: 'list projects · projects <slug> for detail',
    usage: 'projects [slug]',
    run: (ctx) => {
      if (ctx.args[0]) return <ProjectDetail slug={ctx.args[0]} ctx={ctx} />;
      return (
        <div className="term-block">
          <p className="term-muted">
            {projects.length} projects — type{' '}
            <span className="term-accent">projects &lt;slug&gt;</span> for detail
            or <span className="term-accent">open &lt;slug&gt;</span> for the page.
          </p>
          <ul className="term-projects">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <span className="term-accent">
                  {String(i + 1).padStart(2, '0')}.
                </span>{' '}
                {p.title}
                <span className="term-muted"> — {p.tagline}</span>
                <span className="term-dim"> ({p.slug})</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },
  {
    name: 'experience',
    group: 'info',
    summary: 'career timeline',
    aliases: ['journey'],
    run: () => (
      <div className="term-block">
        {journey.map((j) => (
          <div key={j.title} className="term-journey">
            <p>
              <span className="term-accent">* {j.year}</span> — {j.title}
            </p>
            <p className="term-para term-muted">{j.body}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'stats',
    group: 'info',
    summary: 'the numbers',
    run: () => (
      <ul className="term-list term-block">
        {stats.map((s) => (
          <li key={s.label}>
            <span className="term-accent">
              {s.value}
              {s.suffix}
            </span>{' '}
            {s.label}
          </li>
        ))}
      </ul>
    ),
  },
  {
    name: 'contact',
    group: 'info',
    summary: 'how to reach Delin',
    run: (ctx) => (
      <div className="term-block">
        {contactMethods.map((m) => (
          <p key={m.label}>
            <span className="term-muted">{m.label.padEnd(9)}</span>{' '}
            {m.label === 'email' ? (
              <button
                type="button"
                className="term-link"
                onClick={() => ctx.openLink(`mailto:${m.value}`)}
              >
                {m.value}
              </button>
            ) : (
              m.value
            )}
          </p>
        ))}
        <p className="term-muted">socials:</p>
        <p className="term-actions">
          {socials.map((s) => (
            <button
              key={s.label}
              type="button"
              className="term-link"
              onClick={() => ctx.openLink(s.href)}
            >
              [ {s.label} ↗ ]
            </button>
          ))}
        </p>
      </div>
    ),
  },
  {
    name: 'socials',
    group: 'info',
    summary: 'github / linkedin / twitter',
    aliases: ['links'],
    run: (ctx) => (
      <p className="term-actions">
        {socials.map((s) => (
          <button
            key={s.label}
            type="button"
            className="term-link"
            onClick={() => ctx.openLink(s.href)}
          >
            [ {s.label} ↗ ]
          </button>
        ))}
      </p>
    ),
  },
  {
    name: 'email',
    group: 'info',
    summary: 'open a mail draft',
    run: (ctx) => {
      ctx.openLink(`mailto:${email}`);
      return <p className="term-muted">opening your mail client → {email}</p>;
    },
  },

  // ---- navigation ----
  {
    name: 'goto',
    group: 'navigation',
    summary: 'scroll to a section',
    usage: 'goto <home|about|projects|contact>',
    run: (ctx) => {
      const target = (ctx.args[0] || '').toLowerCase();
      if (!SECTIONS.includes(target)) {
        return (
          <Err>
            usage: goto &lt;{SECTIONS.join(' | ')}&gt;
          </Err>
        );
      }
      ctx.scrollToSection(target);
      return <p className="term-muted">scrolling to #{target}…</p>;
    },
  },
  {
    name: 'open',
    group: 'navigation',
    summary: 'open a project page',
    usage: 'open <slug>',
    run: (ctx) => {
      const slug = ctx.args[0];
      if (!slug || !projects.some((p) => p.slug === slug)) {
        return (
          <Err>
            unknown project. run <span className="term-accent">projects</span> for
            valid slugs.
          </Err>
        );
      }
      ctx.navigate(`/project/${slug}`);
      ctx.close();
      return <p className="term-muted">opening /project/{slug} …</p>;
    },
  },
  {
    name: 'resume',
    group: 'navigation',
    summary: 'open / download the résumé',
    aliases: ['cv'],
    run: (ctx) => {
      ctx.openLink(resumeUrl);
      return (
        <p className="term-muted">
          opening résumé → <span className="term-accent">{resumeUrl}</span>
        </p>
      );
    },
  },

  // ---- system ----
  {
    name: 'clear',
    group: 'system',
    summary: 'clear the screen',
    aliases: ['cls'],
    run: (ctx) => {
      ctx.clear();
      return null;
    },
  },
  {
    name: 'echo',
    group: 'system',
    summary: 'print a line of text',
    usage: 'echo <text>',
    run: (ctx) => <p>{ctx.args.join(' ')}</p>,
  },
  {
    name: 'history',
    group: 'system',
    summary: 'show command history',
    run: (ctx) =>
      ctx.history.length ? (
        <ol className="term-history">
          {ctx.history.map((h, i) => (
            <li key={i}>
              <span className="term-dim">{String(i + 1).padStart(3, ' ')}</span>{' '}
              {h}
            </li>
          ))}
        </ol>
      ) : (
        <p className="term-muted">no history yet.</p>
      ),
  },
  {
    name: 'pwd',
    group: 'system',
    summary: 'print working directory',
    run: () => <p>/home/delin/portfolio</p>,
  },
  {
    name: 'ls',
    group: 'system',
    summary: 'list files',
    run: () => (
      <p className="term-ls">
        <span className="term-accent">about.md</span>{' '}
        <span className="term-accent">skills/</span>{' '}
        <span className="term-accent">projects/</span> journey.log contact.vcf{' '}
        resume.pdf
      </p>
    ),
  },
  {
    name: 'cat',
    group: 'system',
    summary: 'read a file',
    usage: 'cat <file>',
    run: (ctx) => {
      const file = (ctx.args[0] || '').toLowerCase();
      const map: Record<string, string> = {
        'about.md': 'about',
        'journey.log': 'experience',
        'contact.vcf': 'contact',
        'skills/': 'skills',
      };
      if (file === 'resume.pdf')
        return (
          <p className="term-muted">
            binary file — run <span className="term-accent">resume</span> to open
            it.
          </p>
        );
      const cmd = map[file];
      if (cmd) {
        const c = ctx.findCommand(cmd);
        return c ? c.run({ ...ctx, args: [] }) : null;
      }
      return <Err>cat: {ctx.args[0] || ''}: No such file</Err>;
    },
  },
  {
    name: 'cd',
    group: 'system',
    summary: 'change directory',
    run: () => (
      <p className="term-muted">
        this isn’t that kind of shell — try{' '}
        <span className="term-accent">goto &lt;section&gt;</span>.
      </p>
    ),
  },
  {
    name: 'man',
    group: 'system',
    summary: 'manual for a command',
    usage: 'man <cmd>',
    run: (ctx) => {
      const c = ctx.findCommand((ctx.args[0] || '').toLowerCase());
      if (!c) return <Err>no manual entry for '{ctx.args[0] || ''}'</Err>;
      return (
        <div className="term-block">
          <p>
            <span className="term-accent">{c.name}</span> — {c.summary}
          </p>
          <p className="term-muted">usage: {c.usage || c.name}</p>
          {c.aliases?.length ? (
            <p className="term-muted">aliases: {c.aliases.join(', ')}</p>
          ) : null}
        </div>
      );
    },
  },
  {
    name: 'date',
    group: 'system',
    summary: 'current date & time',
    run: () => <p>{new Date().toString()}</p>,
  },
  {
    name: 'exit',
    group: 'system',
    summary: 'minimize the terminal',
    aliases: ['close', 'quit'],
    run: (ctx) => {
      ctx.close();
      return <p className="term-muted">session minimized — press ` to return.</p>;
    },
  },

  // ---- fun & games ----
  {
    name: 'neofetch',
    group: 'fun',
    summary: 'system info, the cool way',
    run: () => <Neofetch />,
  },
  {
    name: 'banner',
    group: 'fun',
    summary: 'big ASCII name',
    run: () => <Pre className="term-accent">{BANNER.trim()}</Pre>,
  },
  {
    name: 'matrix',
    group: 'fun',
    summary: 'enter the matrix',
    run: (ctx) => {
      ctx.setMatrix(true);
      return (
        <p className="term-success">
          entering the matrix… press <span className="term-accent">Esc</span> or
          any key to wake up.
        </p>
      );
    },
  },
  {
    name: 'play',
    group: 'fun',
    summary: 'play a game (try: doom)',
    usage: 'play <game>',
    run: (ctx) => {
      const game = (ctx.args[0] || '').toLowerCase();
      if (game === 'doom') {
        ctx.setDoom(true);
        return (
          <p className="term-success">
            launching <span className="term-accent">doom.exe</span> — rip and
            tear. close it with the red dot.
          </p>
        );
      }
      if (!game) return <Err>usage: play &lt;game&gt; — available: doom</Err>;
      return <Err>unknown game: {game} — available: doom</Err>;
    },
  },
  {
    name: 'doom',
    group: 'fun',
    summary: '',
    hidden: true,
    run: (ctx) => {
      ctx.setDoom(true);
      return (
        <p className="term-success">
          launching <span className="term-accent">doom.exe</span> — rip and
          tear. close it with the red dot.
        </p>
      );
    },
  },
  {
    name: 'cowsay',
    group: 'fun',
    summary: 'a cow says your words',
    usage: 'cowsay <text>',
    run: (ctx) => <Pre>{cowsay(ctx.args.join(' '))}</Pre>,
  },
  {
    name: 'sl',
    group: 'fun',
    summary: 'you typed it wrong on purpose',
    run: () => <TrainRun />,
  },
  {
    name: 'fortune',
    group: 'fun',
    summary: 'a dose of dev wisdom',
    run: () => <p className="term-para">🥠 {pick(FORTUNES)}</p>,
  },
  {
    name: 'joke',
    group: 'fun',
    summary: 'tell me a joke',
    run: () => <p className="term-para">😄 {pick(JOKES)}</p>,
  },
  {
    name: 'coffee',
    group: 'fun',
    summary: 'brew a cup',
    run: () => (
      <div className="term-block">
        <Pre className="term-warning">{COFFEE}</Pre>
        <p className="term-muted">brewing… ☕ done. productivity +10.</p>
      </div>
    ),
  },
  {
    name: 'hack',
    group: 'fun',
    summary: 'definitely hack the mainframe',
    usage: 'hack [target]',
    run: (ctx) => <HackSequence target={ctx.args[0] || 'the.mainframe'} />,
  },
  {
    name: '42',
    group: 'fun',
    summary: 'the ultimate question',
    run: () => (
      <p className="term-para">
        The answer to life, the universe, and everything. (towel not included)
      </p>
    ),
  },
  {
    name: 'ping',
    group: 'fun',
    summary: 'ping the void',
    run: () => <p className="term-success">pong 🏓 — 0.42ms (suspiciously fast)</p>,
  },
  {
    name: 'weather',
    group: 'fun',
    summary: 'local forecast',
    run: () => (
      <p className="term-para">
        Trivandrum: ☀️ 32°C, humid, 100% chance of someone asking “is the site
        live yet?”
      </p>
    ),
  },

  // ---- hidden easter eggs ----
  {
    name: 'sudo',
    group: 'fun',
    summary: '',
    hidden: true,
    run: (ctx) => {
      if (ctx.raw.toLowerCase().includes('make me a sandwich')) {
        return <p className="term-success">Okay. 🥪</p>;
      }
      return (
        <Err>
          delin is not in the sudoers file. This incident will be reported.
        </Err>
      );
    },
  },
  {
    name: 'rm',
    group: 'fun',
    summary: '',
    hidden: true,
    run: (ctx) => {
      const flags = ctx.args.join(' ');
      if (/-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r/.test(flags) && /\/|\*/.test(flags)) {
        return <RmRf />;
      }
      return (
        <p className="term-muted">
          rm: nice try — everything here is read-only (and version-controlled).
        </p>
      );
    },
  },
  {
    name: 'vim',
    group: 'fun',
    summary: '',
    hidden: true,
    aliases: ['emacs', 'nano'],
    run: () => (
      <p className="term-para">
        To exit Vim you must first accept that you never will. (try{' '}
        <span className="term-accent">:q</span>… good luck)
      </p>
    ),
  },
  {
    name: ':(){',
    group: 'fun',
    summary: '',
    hidden: true,
    run: () => (
      <p className="term-muted">
        fork bomb detected — and politely declined. let’s keep your browser
        alive. 🙂
      </p>
    ),
  },
];

// ---------------------------------------------------------------------------
// Registry helpers
// ---------------------------------------------------------------------------

/** Map of every invocable name (including aliases) → command. */
export function buildCommandMap(): Map<string, Command> {
  const map = new Map<string, Command>();
  for (const cmd of COMMANDS) {
    map.set(cmd.name.toLowerCase(), cmd);
    for (const alias of cmd.aliases ?? []) {
      map.set(alias.toLowerCase(), cmd);
    }
  }
  return map;
}

/** Visible command + alias names for Tab autocomplete. */
export function completionNames(): string[] {
  const names: string[] = [];
  for (const cmd of COMMANDS) {
    if (cmd.hidden) continue;
    names.push(cmd.name);
    for (const alias of cmd.aliases ?? []) names.push(alias);
  }
  return names;
}
