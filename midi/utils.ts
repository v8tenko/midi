import {isEqual} from 'lodash';
import {Chord, Note} from './types';

export const exctractor = (note: Note) => {
    return typeof note === 'number' ? note : note.note;
};

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const noteToString = (note: Note) => {
    const id = exctractor(note);
    const simple = id % 12;
    const octave = Math.floor(id / 12) - 1;

    return notes[simple] + octave;
};

export const chordToString = (chord: Chord) => {
    return chord.map(exctractor).join(' ');
};

export const equals = (a: Chord, b: Chord) => {
    return isEqual(a.map(exctractor).sort(), b.map(exctractor).sort());
};
