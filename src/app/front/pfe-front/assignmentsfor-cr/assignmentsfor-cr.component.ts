import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from 'src/app/models/Assignment';
import { AssignmentService } from 'src/app/service/assignment.service';

@Component({
  selector: 'app-assignmentsfor-cr',
  imports: [CommonModule],
  templateUrl: './assignmentsfor-cr.component.html',
  styleUrl: './assignmentsfor-cr.component.scss'
})
export class AssignmentsforCRComponent {


  assignments: Assignment[] = [];
  offerId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {
    // Retrieve offerId from route parameters
    this.route.params.subscribe(params => {
      this.offerId = +params['offerId']; // Convert to number
      if (this.offerId) {
        this.loadAssignments(this.offerId); // Fetch assignments for the offerId
      }
    });
  }

  loadAssignments(offerId: number): void {
    this.assignmentService.getAssignmentsByOfferId(offerId).subscribe(
      (data: Assignment[]) => {
        this.assignments = data;
      },
      (error) => {
        console.error('Error fetching assignments:', error);
      }
    );
  }
}