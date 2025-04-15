import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Courses } from '../Models/courses.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8089/pidev/Courses'; // Base URL de l'API

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les cours
  getCourses(): Observable<Courses[]> {
    return this.http.get<Courses[]>(`${this.apiUrl}/getAllCourses`);
  }

  // ✅ Récupérer un cours par ID
  getCourseById(id: number): Observable<Courses> {
    return this.http.get<Courses>(`${this.apiUrl}/getCourse/${id}`);
  }

  addCourse(formData: FormData, trainingId: number): Observable<Courses> {
    return this.http.post<Courses>(`${this.apiUrl}/add_courses/${trainingId}`, formData);
}


updateCourse(formData: FormData): Observable<Courses> {
  return this.http.put<Courses>(`${this.apiUrl}/update_course`, formData);
}

  // ✅ Supprimer un cours
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCourse/${id}`);
  }

  // ✅ Ouvrir un fichier en appelant l'API Spring Boot
  openFile(filename: string): void {
    const fileUrl = `${this.apiUrl}/Courses/${filename}`;
    window.open(fileUrl, '_blank'); // Ouvre le fichier dans un nouvel onglet
  }

  // ✅ Récupérer les cours associés à une formation
  getCoursesByTraining(trainingId: number): Observable<Courses[]> {
    return this.http.get<Courses[]>(`${this.apiUrl}/training/${trainingId}/courses`);
  }
  getPdfUrl(filename: string): Observable<Blob> {
    return this.http.get(`http://localhost:8089/Courses/${filename}`, { responseType: 'blob' });
  }




}
