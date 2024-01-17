import {
    buffer,
    bufferTime,
    connect,
    debounceTime,
    filter,
    lastValueFrom,
    map,
    skipWhile,
    take,
} from 'rxjs';
import {ChordObservable, NoteObservable} from '../types';
import {match} from '../chords';

export const waitForChord = async (in$: ChordObservable) => {
    const result$ = in$.pipe(
        skipWhile((chord) => match(chord) !== 'start'),
        take(1),
    );

    return lastValueFrom(result$);
};
