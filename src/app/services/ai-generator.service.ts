// ai-generator.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AIGeneratorService {
  private topicSets = [
    [
      "Spring Boot : Optimisation des performances",
      "Angular : Détection des changements avancée",
      "Docker : Réduction de la taille des images"
    ],
    [
      "Java 21 : Les nouveautés",
      "React vs Angular : Comparatif 2024",
      "Kubernetes pour les petites équipes"
    ],
    [
      "Microservices : Patterns de communication",
      "Tests unitaires en JavaScript",
      "CI/CD avec GitHub Actions"
    ],
   
    [
      "TypeScript : Bonnes pratiques avancées",
      "Spring Security : Configuration JWT",
      "AWS Lambda : Optimisation des coûts"
    ],
    [
      "GraphQL vs REST : Quand utiliser quoi ?",
      "Flutter pour le web : Est-ce viable ?",
      "Machine Learning avec Python"
    ],
    [
      "DevOps : Automatisation avec Ansible",
      "React Hooks : Cas d'utilisation complexes",
      "MongoDB : Optimisation des requêtes"
    ],
    [
      "Kotlin pour le backend : Avantages sur Java",
      "WebAssembly : Révolution du frontend ?",
      "Clean Architecture en pratique"
    ],
    [
      "Git : Stratégies de branching efficaces",
      "PostgreSQL vs MySQL en 2024",
      "Elasticsearch : Implémentation de base"
    ],
    [
      "RxJS : Patterns avancés pour Angular",
      "Serverless : Pièges à éviter",
      "Docker Compose pour les environnements complexes"
    ],
    [
      "Intégration continue : Jenkins vs GitLab CI",
      "NestJS : Pourquoi l'adopter ?",
      "Sécurité OAuth2 en détail"
    ],
    [
      "Vue 3 : Composition API vs Options API",
      "Spring Data JPA : Performances des requêtes",
      "Terraform pour le provisioning cloud"
    ],
    [
      "Web Components : L'avenir du frontend ?",
      "Kafka : Cas d'utilisation réels",
      "Design Patterns en JavaScript moderne"
    ]
  ];

  constructor() {}

  async generateTechTopics(): Promise<string[]> {
    // Choisit un ensemble aléatoire
    const randomIndex = Math.floor(Math.random() * this.topicSets.length);
    return this.topicSets[randomIndex];
  }
}