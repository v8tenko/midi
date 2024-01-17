import sound from 'sound-play';
import easymidi from 'easymidi';

import {lastValueFrom} from 'rxjs';
import {logger} from '../logger';
import {Chord, ChordObservable, State} from '../types';
import {chordToString, equals} from '../utils';
import {takeWhile} from 'rxjs';
import {match} from '../chords';

export const play = (in$: ChordObservable, state: State, output: easymidi.Output) => {
    if (state.status !== 'playing') {
        logger.error('Status is not playing');

        return;
    }

    let lastCorrect = 0;

    const {payload} = state;

    in$
    .pipe(
        takeWhile((chord: Chord) => match(chord) !== 'stop_playing')
    )
    .subscribe(async (chord) => {
        const expected = payload[lastCorrect];

        if (lastCorrect === payload.length) {
            lastCorrect = 0;
        }

        if (equals(chord, expected)) {
            lastCorrect++;

            return;
        } else {
            logger.warning(`Expected ${chordToString(expected)}; Got ${chordToString(chord)}`);

            output.send('noteon', {
                channel: 12,
                note: 20,
                velocity: 128,
            });
        }
    });

    return lastValueFrom(in$) as any;
};
