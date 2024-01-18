import easymidi from 'easymidi';

import {connect, lastValueFrom, share, shareReplay, take, tap, toArray} from 'rxjs';
import {logger} from '../logger';
import {Chord, ChordObservable, State} from '../types';
import {chordToString, equals} from '../utils';
import {takeWhile} from 'rxjs';
import {match} from '../chords';
import { config } from '../config';

export const play = (in$: ChordObservable, state: State, output: easymidi.Output) => {
    if (state.status !== 'playing') {
        logger.error('Status is not playing');

        return Promise.resolve(undefined);
    }

    let lastCorrect = 0;

    const {payload} = state;

    const result$ = in$.pipe(
        takeWhile((chord: Chord) => match(chord) !== 'stop_playing'),
    )
    
    result$.subscribe((chord) => {
        if (lastCorrect === payload.length) {
            lastCorrect = 0;
        }

        const expected = payload[lastCorrect];

        if (equals(chord, expected)) {
            lastCorrect++;

            return;
        } else {
            logger.warning(`Expected ${chordToString(expected)}; Got ${chordToString(chord)}`);

            output.send('noteon', {
                /* accepts only [0;12] value */
                channel: config.channel as 0,
                note: config.note,
                velocity: 127,
            });
        }
    })
    

    return lastValueFrom(result$).then(() => undefined);
};
