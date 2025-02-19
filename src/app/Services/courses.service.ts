import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Courses } from '../Models/courses.model'; // Import du modèle

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8089/pidev/Courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Courses[]> {
    return this.http.get<Courses[]>(`${this.apiUrl}/getAllCourses`); // Retourne la liste des cours
  }
}

