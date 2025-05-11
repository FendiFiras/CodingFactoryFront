import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Offer } from 'src/app/models/Offer';
import { Training } from 'src/app/models/training.model';
import { OfferService } from 'src/app/services/offer.service';
import { TrainingService } from 'src/app/services/training.service';
import { Event as EventModel } from 'src/app/models/event.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';

@Component({
  selector: 'app-clustring',
  imports: [CommonModule, HttpClientModule,NavbarComponent,FooterComponent],
  templateUrl: './clustring.component.html',
  styleUrl: './clustring.component.scss'
})
export class ClustringComponent implements OnInit {
  cluster: number | null = null;
  recommendations: string[] = [];
  trainings: Training[] = [];
  events: EventModel[] = [];
  offers: Offer[] = [];

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingService,
    private offerService: OfferService,
    private http: HttpClient,
    private router:Router

  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cluster = +params['cluster'];

      if (this.cluster === 0) {
        this.recommendations = [
          "🎓 Create a personalized career guidance plan.",
          "Take introductory modules (Python, AI, DevOps, etc.).",
          "Encourage obtaining small certifications (Coursera, etc.)"
        ];
        this.trainingService.getTrainings().subscribe(data => this.trainings = data);
      }    else if (this.cluster === 1) {
        this.recommendations = [
          "🚀 Apply for advanced internships or work-study programs.",
          "Focus on personal branding (GitHub, LinkedIn).",
          "Join technical events to grow your network."
        ];
        // ❗ ici on ne touche pas au WebSocket
      //  this.eventService.getEvents().subscribe(data => this.events = data);
      this.http.get<any[]>('http://localhost:8087/event/event')
      .subscribe(data => {
        this.events = data;
      });
      } else if (this.cluster === 2) {
        this.recommendations = [
          "🏆 Apply for real-world internships or projects.",
          "Join bootcamps and competitions.",
          "Enhance your leadership and teamwork skills."
        ];
        this.offerService.getOffersfront().subscribe(data => this.offers = data);
      } else {
        this.recommendations = ["❓ Cluster non reconnu."];
      }
    });
  }
  goToTrainingDetails(id: number) {
    this.router.navigate(['/TrainingInfo', id]);
  }
  
  goToEventDetails(id: number) {
    this.router.navigate(['/detailseventfront', id]);
  }
  
  goToOfferDetails(id: number) {
    this.router.navigate(['/studentoffers']);
  }

  goBack() {
    this.router.navigate(['/studentoffers']);
  }
}