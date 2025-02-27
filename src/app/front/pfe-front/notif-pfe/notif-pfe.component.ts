import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationPfeService } from 'src/app/service/notification-pfe.service';

@Component({
  selector: 'app-notif-pfe',
  imports: [CommonModule],
  templateUrl: './notif-pfe.component.html',
  styleUrl: './notif-pfe.component.scss'
})
export class NotifPfeComponent {
  notification$ = this.notificationService.notification$;

  constructor(public notificationService: NotificationPfeService) {}

}
