import { svg_to_symbols } from './svg-to-symbols.mjs';
import { svg_to_jsx } from './svg-to-jsx.mjs';
import { svg_to_optimized } from './svg-to-optimized.mjs';
import { svg_to_scss } from './svg-to-scss.mjs';
// import * as fs from 'fs';
// import { configManager } from './config-manager.mjs';

import { printLine, printSuccess } from './print-result.mjs';

export function start() {


  printLine('SVG-ICONS-TOOLS start...');

  svg_to_jsx();
  svg_to_optimized();
  svg_to_symbols();
  svg_to_scss();

  printSuccess('SVG-ICONS-TOOLS end');


}
