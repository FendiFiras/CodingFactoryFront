export interface User {
  idUser?: number; // Optionnel car il est généré automatiquement
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: Date; // LocalDateTime en Java → string en TypeScript (ISO format)
  gender: string;
  email: string;
  phoneNumber: string;
  cv?: string; // Optionnel
  speciality?: string; // Optionnel
  companyName?: string; // Optionnel
  level?: string; // Optionnel
  grade?: string; // Optionnel
  address: string;
  image: string;
  role: string;
}