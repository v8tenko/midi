import fs from 'node:fs/promises';
import inquirer from 'inquirer';
import easymidi from 'easymidi';

import {logger} from './logger';

type Config = {
    channel: number;
    note: number;
    input: string;
    output: string;
}

const FILE = '.midi.config'

export const config = {} as Config;

export const initailize = async () => {
    const localConfig = 
        await fs.readFile(FILE)
            .catch(() => null)
            .then((content) => content && JSON.parse(content.toString()) as Config);

    if (localConfig) {
        Object.assign(config, localConfig);

        logger.info('Using local config file');

        return config;
    }

    const inputConfig = await requestUserConfig();

    Object.assign(config, inputConfig);

    await fs.writeFile(FILE, JSON.stringify(inputConfig, null, 4));

    return config;
}

const requestUserConfig = async () => {
    const inputSources = easymidi.getInputs();
    const outputSources = easymidi.getOutputs();

    if (!inputSources.length) {
        logger.error('No input source');
    }

    const {inputDevice, outputDevice, channel, note} = await inquirer.prompt([
        {
            type: 'list',
            name: 'inputDevice',
            message: 'Select input source',
            choices: inputSources,
        },
        {
            type: 'list',
            name: 'outputDevice',
            message: 'Select output source',
            choices: outputSources
        },
        {
            type: 'number',
            name: 'channel',
            message: 'Select MIDI channel',
        },
        {
            type: 'number',
            name: 'note',
            message: 'Select note playing on error',
        }
    ]);

    return {
        channel,
        input: inputDevice,
        output: outputDevice,
        note
    } as Config

}
