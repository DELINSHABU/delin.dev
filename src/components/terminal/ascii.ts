// ASCII art + flavor text for the terminal's fun commands.
// Kept in one place so the heavier strings stay out of the command logic.

export const BANNER = String.raw`
██████╗ ███████╗██╗     ██╗███╗   ██╗
██╔══██╗██╔════╝██║     ██║████╗  ██║
██║  ██║█████╗  ██║     ██║██╔██╗ ██║
██║  ██║██╔══╝  ██║     ██║██║╚██╗██║
██████╔╝███████╗███████╗██║██║ ╚████║
╚═════╝ ╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝
`;

// Small mark shown next to the neofetch system card.
export const NEOFETCH_LOGO = String.raw`
        _____
       /     \
      | () () |
       \  ^  /     delin@dev
        |||||      ---------
        |||||
   >_   booting...
`;

// The classic steam locomotive — chugs across the screen on \`sl\`.
export const TRAIN = String.raw`
      ====        ________                ___________
  _D _|  |_______/        \__I_I_____===__|_________|
   |(_)---  |   H\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__
__/ =| o |=-~~\  /~~\  /~~\  /~~\ ____Y___________|__
 |/-=|___|=    ||    ||    ||    |_____/~\___/
  \_/      \O=====O=====O=====O_/      \_/
`;

// ASCII coffee for \`coffee\`.
export const COFFEE = String.raw`
      ( (
       ) )
    ........
    |      |]
    \      /
     \`----'
   ~ fresh, dark, terminal-grade ~
`;

// Shown on the konami-code unlock.
export const SECRET = String.raw`
  ★ ACHIEVEMENT UNLOCKED ★
  ┌───────────────────────────────┐
  │  KONAMI MASTER                │
  │  30 extra lives granted.      │
  │  (they were imaginary anyway) │
  └───────────────────────────────┘
`;

// cowsay <text> — wraps the message in a speech bubble above the cow.
export function cowsay(message: string): string {
  const text = message.trim() || 'mooo';
  const top = ' ' + '_'.repeat(text.length + 2);
  const bottom = ' ' + '-'.repeat(text.length + 2);
  return [
    top,
    `< ${text} >`,
    bottom,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ].join('\n');
}

export const FORTUNES: string[] = [
  'There are 10 kinds of people: those who understand binary and those who don’t.',
  '“It works on my machine.” — every developer, right before the demo.',
  'A SQL query walks into a bar, walks up to two tables and asks: “Can I join you?”',
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'To understand recursion, you must first understand recursion.',
  'Weeks of coding can save you hours of planning.',
  '99 little bugs in the code, 99 little bugs… take one down, patch it around, 127 little bugs in the code.',
  'A programmer’s wife says: “Buy a loaf of bread, and if they have eggs, get a dozen.” He came home with 12 loaves.',
  '“I’ll fix it later” is the most powerful spell in computer science.',
  'Real programmers count from 0.',
  'It’s not a bug — it’s an undocumented feature.',
  'There’s no place like 127.0.0.1.',
];

export const JOKES: string[] = [
  'Why did the developer go broke? Because he used up all his cache.',
  'How many programmers does it take to change a light bulb? None — that’s a hardware problem.',
  'I would tell you a UDP joke, but you might not get it.',
  'A byte walks into a bar looking miserable. The bartender asks: “What’s wrong?” “Parity error.” “Ah, that explains why you look a bit off.”',
  'Why was the JavaScript developer sad? Because he didn’t Node how to Express himself.',
  'There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors.',
];
