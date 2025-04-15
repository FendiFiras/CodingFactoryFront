import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslateDynamicService {
  constructor(private http: HttpClient) {}

  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    if (!text.trim()) return text;

    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`;

    try {
      const response: any = await this.http.get(url).toPromise();
      return response?.[0]?.[0]?.[0] || text;
    } catch (error) {
      console.error('Erreur lors de la traduction individuelle:', error);
      return text;
    }
  }

  async translatePage(targetLang: string, sourceLang = 'auto') {
    const elements = document.querySelectorAll('body *:not(script):not(style)');
  
    for (let element of Array.from(elements)) {
      if (
        element.children.length === 0 &&
        element.textContent &&
        element.textContent.trim().length > 0
      ) {
        const originalText = element.textContent.trim();

        try {
          const translated = await this.translateText(originalText, sourceLang, targetLang);
          element.textContent = translated;
          await this.delay(0); // évite les blocages côté Google
        } catch (error) {
          console.error('Erreur de traduction', error);
        }
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
