/* eslint-disable no-console */
import chalk from 'chalk';

// https://github.com/chalk/chalk
export function printError(text, as_line = false) {
  if(as_line) {
    console.error(chalk.red(text));

  } else {
    console.error(chalk.bgRed(`\n ${text} \n`));
  }

}

export function printSuccess(text) {
  console.error(chalk.bgGreen(`\n ${text} \n`));
}

export function printLine(text, dim = false) {
  console.error(dim? chalk.yellow.dim(text) : chalk.yellow(text));
}
