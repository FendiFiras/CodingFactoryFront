import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {

  private themeLink: HTMLLinkElement;

  constructor() {
    // Crée un élément <link> pour ajouter dynamiquement le CSS
    this.themeLink = document.createElement('link');
    this.themeLink.rel = 'stylesheet';
    document.head.appendChild(this.themeLink);
  }

  // Méthode pour appliquer le thème basé sur la valeur passée
  setTheme(theme: string) {
    if (theme === 'dark') {
      this.themeLink.href = 'assets1/css/eduact-dark.css'; // Lien vers le CSS du mode sombre
      localStorage.setItem('theme', 'dark');
    } else {
      this.themeLink.href = ''; // Retire le CSS du mode sombre (donc utilisation du mode clair)
      localStorage.setItem('theme', 'light');
    }
  }

  // Méthode pour basculer entre les modes
  toggleTheme() {
    const currentTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    this.setTheme(currentTheme);
  }
}