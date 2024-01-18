import easymidi from 'easymidi';
import {logger} from './logger';
import {bufferTime, filter, fromEvent} from 'rxjs';
import {NoteObservable} from './types';
import {run} from './tick';
import {initailize} from './config';

export const start = async () => {
    const {input: inputDevice, output: outputDevice} = await initailize()

    const keyboard = new easymidi.Input(inputDevice);
    const output = new easymidi.Output(outputDevice);

    const noteOn$ = (fromEvent(keyboard, 'noteon') as NoteObservable).pipe(
        bufferTime(50),
        filter((chord) => chord.length !== 0),
    );

    logger.info(`Connected to device ${inputDevice}`);

    run(noteOn$, output);
};
