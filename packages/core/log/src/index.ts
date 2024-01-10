import { isNode } from '@gecut/utilities/browser-or-node';
import { env } from '@gecut/utilities/env';

let globalIndex = 0;

const NODE_MODE = isNode();

const DEV_MODE =
  (NODE_MODE === false
    ? localStorage?.getItem('DEBUG') ?? '0'
    : env('DEBUG', '0', 'string')) === '1';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DebugFunctionType = (...args: any[]) => void;

export class GecutLog {
  constructor(domain: string, devMode = DEV_MODE) {
    this.domain = GecutLog.stabilizeDomain(domain);
    this.devMode = devMode;
    this.style = GecutLog.style.scope.replaceAll(
      '{{color}}',
      ColorManager.color,
    );

    this.index = ++globalIndex;

    this.initial();

    if (DEV_MODE) {
      this.initialDevelopments();
    }
  }

  private static keySection = NODE_MODE ? '%s%s%s%s%s' : '%c%s%c%s%c';
  private static style = {
    scope: NODE_MODE ? '\x1b[{{color}}m' : 'color: {{color}};',
    reset: NODE_MODE ? '\x1b[0m' : 'color: inherit;',
    dim: NODE_MODE ? '\x1b[2m' : 'color:#888;',
  };

  index: number;
  domain: string;
  devMode: boolean;
  style: string;

  property?: (property: string, value: unknown) => void;
  method?: (method: string) => void;
  methodArgs?: (method: string, args: unknown) => void;
  methodFull?: (method: string, args: unknown, result: unknown) => void;
  other?: (...args: unknown[]) => void;

  warning!: (
    method: string,
    code: string,
    desc: string,
    ...args: unknown[]
  ) => void;
  error!: (method: string, code: string, ...args: unknown[]) => void;

  time?: (label: string) => void;
  timeEnd?: (label: string) => void;

  sub(domain: string, _devMode = this.devMode) {
    return new GecutLog(`${this.domain} ⬅️ ${domain}`, _devMode);
  }

  private static stabilizeDomain(domain: string): string {
    domain = domain.trim();

    const first = domain.charAt(0);
    if (first !== '[' && first !== '{' && first !== '<') {
      domain = `[${domain}]`;
    }

    return domain;
  }

  private initial() {
    this.error = NODE_MODE
      ? console.error.bind(
          console,
          `${GecutLog.style.dim}[${this.index}] ${this.style}❌ \n%s\x1b[31m.%s() Error \`%s\`${GecutLog.style.reset}\n`,
          this.domain,
        )
      : console.error.bind(
          console,
          '%c%s%c.%s() Error `%s`\n',
          this.style,
          this.domain,
          GecutLog.style.reset,
        );

    this.warning = NODE_MODE
      ? console.warn.bind(
          console,
          `${GecutLog.style.dim}[${this.index}] ${this.style}⚠️ \n%s\x1b[33m.%s() Accident \`%s\` %s!${GecutLog.style.reset}`,
          this.domain,
        )
      : console.warn.bind(
          console,
          '%c%s%c.%s() Warn `%s` %s!',
          this.style,
          this.domain,
          GecutLog.style.reset,
        );
  }

  private initialDevelopments() {
    this.time = (label: string) =>
      console.time(
        `[${this.index}] ${this.domain} ${label} duration`,
      );

    this.timeEnd = (label: string) =>
      console.timeEnd(
        `[${this.index}] ${this.domain} ${label} duration`,
      );

    this.property = console.debug.bind(
      console,
      GecutLog.keySection + '.%s = %o;',
      GecutLog.style.dim,
      '[' + this.index + '] ',
      this.style,
      this.domain,
      GecutLog.style.reset,
    );

    this.method = console.debug.bind(
      console,
      GecutLog.keySection + '.%s();',
      GecutLog.style.dim,
      '[' + this.index + '] ',
      this.style,
      this.domain,
      GecutLog.style.reset,
    );

    this.methodArgs = console.debug.bind(
      console,
      GecutLog.keySection + '.%s(%o);',
      GecutLog.style.dim,
      '[' + this.index + '] ',
      this.style,
      this.domain,
      GecutLog.style.reset,
    );

    this.methodFull = console.debug.bind(
      console,
      GecutLog.keySection + '.%s(%o) => %o',
      GecutLog.style.dim,
      '[' + this.index + '] ',
      this.style,
      this.domain,
      GecutLog.style.reset,
    );

    this.other = console.debug.bind(
      console,
      GecutLog.keySection,
      GecutLog.style.dim,
      '[' + this.index + '] ',
      this.style,
      this.domain,
      GecutLog.style.reset,
    );
  }
}

class ColorManager {
  private static colors = {
    browsers: {
      RED: '#EF5350',
      PINK: '#F06292',
      PURPLE: '#AB47BC',
      DEEP_PURPLE: '#7E57C2',
      INDIGO: '#5C6BC0',
      BLUE: '#42A5F5',
      LIGHT_BLUE: '#03A9F4',
      CYAN: '#26C6DA',
      TEAL: '#009688',
      GREEN: '#4CAF50',
      LIGHT_GREEN: '#8BC34A',
      LIME: '#CDDC39',
      YELLOW: '#FDD835',
      AMBER: '#FFC107',
      ORANGE: '#FF9800',
    },
    node: ['0;36', '0;35', '0;34', '0;33', '0;32'],
  };
  private static colorsList = NODE_MODE
    ? this.colors.node
    : Object.values(this.colors.browsers);

  private static index = 0;

  static get color(): string {
    const color = this.colorsList[this.index];

    this.index++;

    if (this.index >= this.colorsList.length) {
      this.index = 0;
    }

    return color;
  }
}
