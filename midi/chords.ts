import {isEqual} from 'lodash';
import {Chord} from './types';
import {exctractor} from './utils';

export type Commands = 'start' | 'end_record' | 'stop_playing';

/* did chord mathces */
export type ChordMatcher = (chord: Chord) => boolean;

const matcherFactory = (targetChord: Chord) => {
    const sorted = targetChord.map(exctractor).sort();

    return (value: Chord) => isEqual(sorted, value.map(exctractor).sort());
};

const chrods: Record<Commands, ChordMatcher> = {
    start: matcherFactory([36, 38]),
    end_record: matcherFactory([38, 40]),
    stop_playing: matcherFactory([36, 40]),
};

export const match = (chord: Chord): Commands | undefined => {
    const matcher = Object.entries(chrods).find(([, matcher]) => {
        return matcher(chord);
    });

    return matcher?.[0] as Commands | undefined;
};
