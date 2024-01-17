import easymidi from 'easymidi';

import {lastValueFrom, reduce, take, takeWhile} from 'rxjs';
import {ChordObservable} from '../types';
import {match} from '../chords';

export const record = (in$: ChordObservable) => {
    const result$ = in$.pipe(
        takeWhile((el) => match(el) !== 'end_record'),
        reduce((acc, curr) => [...acc, curr], [] as easymidi.Note[][]),
        take(1),
    );

    return lastValueFrom(result$);
};
