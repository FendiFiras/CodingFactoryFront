export class User {
    idUser?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    password?: string;
    gender?: Gender;
    email?: string;
    phoneNumber?: string;
    cv?: string;
    speciality?: string;
    companyName?: string;
    level?: string;
    grade?: string;
    address?: string;
    image?: string;
    role?: Role;
    
  
  }
  export enum Gender {
      MALE = 'MALE',
      FEMALE = 'FEMALE'
    }
  
    export enum Role {
      ADMIN = 'ADMIN',
      STUDENT = 'STUDENT',
      INSTRUCTOR = 'INSTRUCTOR',
      COMPANYREPRESENTIVE = 'COMPANYREPRESENTIVE'
    }