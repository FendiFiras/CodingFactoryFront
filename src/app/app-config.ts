import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";

export const appConfig: ApplicationConfig = {
    providers: [
      provideHttpClient() // Nécessaire pour utiliser HttpClient dans les services
    ]
  };