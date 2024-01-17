import inquirer from 'inquirer';
import easymidi from 'easymidi';
import {logger} from './logger';
import {bufferTime, filter, fromEvent} from 'rxjs';
import {NoteObservable} from './types';
import {run} from './tick';

export const start = async () => {
    const inputSources = easymidi.getInputs();
    const outputSources = easymidi.getOutputs();

    if (!inputSources.length) {
        logger.error('No input source');
    }

    const {inputDevice, outputDevice} = await inquirer.prompt([
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
        }
    ]);

    const keyboard = new easymidi.Input(inputDevice);
    const output = new easymidi.Output(outputDevice);

    const noteOn$ = (fromEvent(keyboard, 'noteon') as NoteObservable).pipe(
        bufferTime(50),
        filter((chord) => chord.length !== 0),
    );

    logger.info(`Connected to device ${inputSources}`);

    run(noteOn$, output);
};
