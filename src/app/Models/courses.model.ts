export class Courses {

        courseId: number;
        courseName: string;
        courseDescription: string;
        difficulty:string;
        fileUrls!: string[]; // ✅ Correction ici : doit être un tableau
    }

export enum CourseDifficulty {
    EASY,
    MEDIUM,
    DIFFICULT,
    ADVANCED
}
  
