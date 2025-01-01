import { Course } from "./course";

export interface UserCourse{

    course: Course;
    currentLectureId: number;
    lectures: [{lectureId: number}]
}