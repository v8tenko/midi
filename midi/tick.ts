import easymidi from 'easymidi';
import {play, record, waitForChord} from './commands';
import {logger} from './logger';
import {ChordObservable, NoteObservable, State, Status, statuses} from './types';

let indexOfStatus = 0;
let state: State = {status: 'waiting', payload: undefined};

export const tick = (in$: ChordObservable, output: easymidi.Output) => {
    switch (state.status) {
        case 'waiting':
            return waitForChord(in$);
        case 'recording':
            return record(in$);
        case 'playing':
            return play(in$, state, output);
    }
};

export const next = () => {
    const nextIndex = ++indexOfStatus % statuses.length;

    return statuses[nextIndex];
};

export const run = async (in$: ChordObservable, output: easymidi.Output) => {
    logger.info('Starting application');

    while (true) {
        logger.info(`Status: ${state.status}`);

        const payload = await tick(in$, output);

        const status = next();

        state = {
            status,
            payload,
        };
    }
};
