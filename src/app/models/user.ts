export class User {
  idUser?: number;
  firstName: string = '';  
  lastName: string = '';   
  dateOfBirth: string = ''; // Format string (ex: "2000-01-01")
  password: string = '';    
  gender: Gender = Gender.MALE; 
  email: string = '';       
  phoneNumber: string = '';  
  cv?: string;              
  speciality?: string;       
  companyName?: string;      
  level?: string;            
  grade?: string;            
  address: string = '';      
  image?: string;            
  role: Role = Role.STUDENT; 
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
