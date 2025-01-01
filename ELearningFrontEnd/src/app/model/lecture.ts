import {Chapter} from "./chapter";

export interface Lecture{

    id: number | null;
    name: string | null;
    videoUrl: string | null;
    resourceUrl: string | null;
    preview: boolean | null;
    chapter: Chapter | null;
    activated: boolean | null,
    createdTime: Date | null,
    updatedTime: Date | null,
    approvalStatus: string | null,
    orderNumber: number | null
    videoDuration: number | null
}