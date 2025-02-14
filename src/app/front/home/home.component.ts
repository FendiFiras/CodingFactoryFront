import { Component } from '@angular/core';
import { NavbarComponent } from '../elements/navbar/navbar.component';
import { FooterComponent } from '../elements/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true, // If using standalone components
  imports: [NavbarComponent,FooterComponent], // Import NavbarComponent here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent { }
