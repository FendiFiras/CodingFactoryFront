import { Injectable } from '@angular/core';
import { pipeline } from '@xenova/transformers';

@Injectable({ providedIn: 'root' })
export class AIGeneratorService {
  private generator: any;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    // Chargement du modèle léger (1.5MB seulement)
    this.generator = await pipeline('text-generation', 'Xenova/tiny-llama', {
      quantized: true,
    });
    
    this.isInitialized = true;
  }

  async generateTechTopics(count: number = 3): Promise<string[]> {
    await this.initialize();
    
    const prompt = `Génère ${count} sujets de discussion technologiques variés en français, 
    sans répétition, couvrant le développement web, l'IA, les bonnes pratiques, 
    et les tendances actuelles. Format: "Discussion : [sujet] - [question ouverte]"`;

    const output = await this.generator(prompt, {
      max_new_tokens: 150,
      temperature: 0.7,
    });

    // Extraction des sujets depuis la sortie brute
    return this.parseGeneratedOutput(output[0].generated_text);
  }

  private parseGeneratedOutput(text: string): string[] {
    // Logique pour extraire les sujets du texte généré
    return text.split('\n')
      .filter(line => line.includes('Discussion :'))
      .map(line => line.trim())
      .slice(0, 3);
  }
}