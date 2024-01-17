import sound from 'sound-play';
import easymidi from 'easymidi';

import {lastValueFrom} from 'rxjs';
import {logger} from '../logger';
import {ChordObservable, State} from '../types';
import {chordToString, equals} from '../utils';

export const play = (in$: ChordObservable, state: State, output: easymidi.Output) => {
    if (state.status !== 'playing') {
        logger.error('Status is not playing');

        return;
    }

    let lastCorrect = 0;

    const {payload} = state;

    in$.subscribe(async (chord) => {
        const expected = payload[lastCorrect];

        console.log(chord, expected);

        if (lastCorrect === payload.length) {
            lastCorrect = 0;
        }

        if (equals(chord, expected)) {
            lastCorrect++;

            return;
        } else {
            logger.warning(`Expected ${chordToString(expected)}; Got ${chordToString(chord)}`);

            // await sound.play('midi/assets/error.mp3');
            output.send('noteon', {
                channel: 0,
                note: 20,
                velocity: 100,
            });
        }
    });

    return lastValueFrom(in$) as any;
};
