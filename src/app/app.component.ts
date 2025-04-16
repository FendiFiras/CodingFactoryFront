// Angular import
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// project import
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  imports: [SpinnerComponent, RouterModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  constructor(private userService: UserService) {}

  title = 'datta-able';

  // life cycle hook
  ngOnInit() {
    this.userService.setUserId(1);  // Replace with actual user ID, or retrieve it dynamically

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
 
}
