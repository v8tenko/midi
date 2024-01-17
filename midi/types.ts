import easymidi from 'easymidi';
import {Observable} from 'rxjs';

export type Note = number | easymidi.Note;
export type Chord = number[] | easymidi.Note[];

export const statuses = ['waiting', 'recording', 'playing'] as const;

export type Status = (typeof statuses)[number];
export type State =
    | {
          status: 'waiting';
          payload: undefined;
      }
    | {
          status: 'playing';
          payload: easymidi.Note[][];
      }
    | {
          status: 'recording';
          payload: undefined;
      };

export type NoteObservable = Observable<easymidi.Note>;
export type ChordObservable = Observable<easymidi.Note[]>;
