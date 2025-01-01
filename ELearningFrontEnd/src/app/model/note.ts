import {Lecture} from "./lecture";

export interface Note{

    id: number;
    title: string;
    duration: number;
    lecture: Lecture;
}