import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Courses } from '../Models/courses.model'; // Import du modèle

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8089/pidev/Courses'; // URL de l'API

  constructor(private http: HttpClient) {}

  // Récupérer tous les cours
  getCourses(): Observable<Courses[]> {
    return this.http.get<Courses[]>(`${this.apiUrl}/getAllCourses`);
  }

  // Récupérer un cours par son ID
  getCourseById(id: number): Observable<Courses> {
    return this.http.get<Courses>(`${this.apiUrl}/getCourse/${id}`);
  }

  addCourse(course: Courses, trainingId: number): Observable<Courses> {
    return this.http.post<Courses>(`${this.apiUrl}/add_courses/${trainingId}`, course);
  }
  

  updateCourse(course: Courses): Observable<Courses> {
    return this.http.put<Courses>(`${this.apiUrl}/updateCourse`, course);
  }
  

  // Supprimer un cours
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCourse/${id}`);
  }

  
}
