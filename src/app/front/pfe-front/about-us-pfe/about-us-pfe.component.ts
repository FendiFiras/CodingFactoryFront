import { Component } from '@angular/core';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { NotifPfeComponent } from "../notif-pfe/notif-pfe.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us-pfe',
  imports: [NavbarComponent, FooterComponent, NotifPfeComponent,RouterModule],
  templateUrl: './about-us-pfe.component.html',
  styleUrl: './about-us-pfe.component.scss'
})
export class AboutUsPfeComponent {

}
