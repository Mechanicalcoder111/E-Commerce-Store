import TransportStream from 'winston-transport';
import colors from 'colors/safe.js';
import type { Logform } from 'winston';

interface CustomConsoleTransportOptions extends TransportStream.TransportStreamOptions {
  name?: string;
}

export class CustomConsoleTransport extends TransportStream {
  private readonly name: string;

  constructor(opts: CustomConsoleTransportOptions) {
    super(opts);
    this.name = opts.name || 'customConsoleTransport';
  }

  override log(info: Logform.TransformableInfo & { message: string }, callback: () => void): void {
    // Emit before doing anything (this is required for Winston to recognize the log as complete)
    setImmediate(() => this.emit('logged', info));

    // Destructure safely
    const { level, message} = info;

    // Format output
    let label: string;
    switch (level) {
      case 'error':
        label = colors.red('ERROR');
        break;
      case 'warn':
        label = colors.yellow('WARN');
        break;
      case 'info':
        label = colors.blue('INFO');
        break;
      case 'debug':
        label = colors.cyan('DEBUG');
        break;
      case 'silly':
        label = colors.magenta('SILLY');
        break;
      default:
        label = colors.green(level.toUpperCase());
        break;
    }

    console.log(`${colors.gray('[')}${label}${colors.gray(']')} ${colors.white(message)}`);
    // Required for async logging systems to proceed
    callback();
  }
}
