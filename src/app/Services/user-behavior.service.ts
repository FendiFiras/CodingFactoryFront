import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserBehaviorService {

  private behaviorData: any = {};

  constructor() { }

  // Méthode pour définir les données comportementales
  setBehaviorData(data: any): void {
    this.behaviorData = data;
  }

  // Méthode pour récupérer les données comportementales
  getBehaviorData(): any {
    return this.behaviorData;
  }

  // Méthode pour réinitialiser les données comportementales
  resetBehaviorData(): void {
    this.behaviorData = {};
  }
}
