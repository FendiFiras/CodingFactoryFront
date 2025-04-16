import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class userFService {
  // Liste statique des utilisateurs
  private users = [
    { userId: 1, first_name: 'John' },
    { userId: 2, first_name: 'Alice' },
    { userId: 3, first_name: 'Bob' },
    // Ajoutez d'autres utilisateurs ici
  ];

  constructor() {}

  // Méthode pour récupérer le nom d'utilisateur par userId
  getUserNameById(userId: number): string {
    console.log('Recherche de l\'utilisateur avec userId:', userId);
    console.log('Liste des utilisateurs:', this.users);
    const user = this.users.find((u) => u.userId === userId);
    return user ? user.first_name : 'Inconnu';
  }
}