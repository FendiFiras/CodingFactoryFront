
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; // ✅ Add this
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { provideToastr } from 'ngx-toastr';
if (environment.production) {
  enableProdMode();
  
}
(window as any).global = window; //*********** */

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule, AppRoutingModule,HttpClientModule), provideAnimations(),provideToastr()]
}).catch((err) => console.error(err));
