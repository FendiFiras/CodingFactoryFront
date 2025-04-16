
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationPfeService {
  private notificationSubject = new BehaviorSubject<{ message: string; type: string } | null>(null);
  notification$ = this.notificationSubject.asObservable();

  showNotification(message: string, type: string = 'success'): void {
    this.notificationSubject.next({ message, type });

    // Automatically hide the notification after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification(): void {
    this.notificationSubject.next(null);
  }
}