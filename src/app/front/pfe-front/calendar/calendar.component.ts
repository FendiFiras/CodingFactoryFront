import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Application } from 'src/app/models/Application';
import { Interview } from 'src/app/models/Interview';
import { InterviewService } from 'src/app/service/interview.service';

interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  interviews: Interview[];
}
@Component({
  selector: 'app-calendar',
  imports: [    CommonModule  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  @Input() set studentId(id: number) {
    this._studentId = id;
    this.loadInterviews();
  }
  get studentId(): number {
    return this._studentId;
  }
  private _studentId!: number;

  currentDate: Date = new Date();
  weeks: CalendarDate[][] = [];
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  interviews: Interview[] = [];
  isLoading = true;

  constructor(private interviewService: InterviewService) {}

  ngOnInit() {
    this.generateCalendar();
  }

  private loadInterviews() {
    if (this._studentId) {
      this.isLoading = true;
      this.interviewService.getInterviewsByStudent(this._studentId).subscribe({
        next: (interviews) => {
          this.interviews = interviews;
          this.generateCalendar();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading interviews', err);
          this.isLoading = false;
        }
      });
    }
  }
  generateCalendar() {
    const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    
    const startDay = startOfMonth.getDay();
    const endDate = endOfMonth.getDate();
    
    const dates: CalendarDate[] = [];
    
    // Add previous month's days
    for (let i = startDay; i > 0; i--) {
      const date = new Date(startOfMonth);
      date.setDate(date.getDate() - i);
      dates.push(this.createCalendarDate(date, false));
    }
    
    // Add current month's days
    for (let i = 1; i <= endDate; i++) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
      dates.push(this.createCalendarDate(date, true));
    }
    
    // Add next month's days
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - dates.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(endOfMonth);
      date.setDate(date.getDate() + i);
      dates.push(this.createCalendarDate(date, false));
    }
    
    // Split into weeks
    this.weeks = [];
    while (dates.length) {
      this.weeks.push(dates.splice(0, 7));
    }
  }


  private createCalendarDate(date: Date, isCurrentMonth: boolean): CalendarDate {
    return {
      date: new Date(date), // Ensure proper Date instance
      isCurrentMonth,
      interviews: this.getInterviewsForDate(date)
    };
  }
  
  private getInterviewsForDate(date: Date): Interview[] {
    const dateString = date.toISOString().split('T')[0];
    return this.interviews.filter(interview => 
      interview.interviewDate === dateString
    );
  }


  formatTime(timeString: string): string {
    return timeString.split(':').slice(0, 2).join(':');

  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(), 
      this.currentDate.getMonth() - 1, 
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(), 
      this.currentDate.getMonth() + 1, 
      1
    );
    this.generateCalendar();
  }
}

