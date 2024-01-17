import chalk from 'chalk';

export const logger = {
    info(message: string) {
        console.log(chalk.cyan(message));
    },
    error(message: string, error = new Error(message)) {
        console.log(chalk.red(message));

        throw error;
    },
    warning(message: string) {
        console.log(chalk.yellowBright(message));
    },
};
