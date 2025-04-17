import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Material } from '../Models/material';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private readonly API_URL = 'http://localhost:8082/materials';

  constructor(private http: HttpClient) { }

  getAllMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.API_URL);
  }

  getMaterialById(id: number): Observable<Material> {
    return this.http.get<Material>(`${this.API_URL}/${id}`);
  }

  addMaterial(material: Material): Observable<Material> {
    return this.http.post<Material>(this.API_URL, material);
  }

  updateMaterial(material: Material): Observable<Material> {
    return this.http.put<Material>(this.API_URL, material);
  }

  deleteMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
