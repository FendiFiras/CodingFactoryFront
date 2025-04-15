import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../../Services/session.service'; // Assurez-vous d'avoir un service pour gérer les sessions
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from 'src/app/theme/layout/admin/navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';
import { NavLogoComponent } from 'src/app/theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Session } from '../../../Models/session.model'; // Assurez-vous d'importer le modèle Session
import { ReactiveFormsModule } from '@angular/forms';
import { Courses } from 'src/app/Models/courses.model';
import { CourseService } from 'src/app/Services/courses.service';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Icon, Style } from 'ol/style';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-session', // Changer le selector pour le nom de la session
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NavigationComponent,
    ConfigurationComponent,
    NavContentComponent,
    NavLogoComponent,
    NavBarComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './add-session.component.html', // Mettre à jour le chemin du template
  styleUrls: ['./add-session.component.scss'],
})
export class AddSessionComponent implements OnInit {
  sessionForm: FormGroup;
  courses: Courses[] = [];
  successMessage: string = ''; // ✅ Variable pour stocker le message de succès

  map!: Map;
  vectorSource!: VectorSource;
  vectorLayer!: VectorLayer;
  markerFeature!: Feature;
  
  showMap: boolean = false;

  searchQuery: string = '';


  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService ,
    private courseService: CourseService,
    private http: HttpClient
     
  ) {
    this.sessionForm = this.fb.group({
      sessionName: ['', Validators.required], 
      startTime: [null, [Validators.required, this.validateStartTime]], 
      endTime: [null, [Validators.required, this.validateEndTime.bind(this)]], 
      location: ['', Validators.required], 
      searchQuery: [''], // ➕ Ajout du champ pour la recherche

      courseId: [null, Validators.required],  
      program: ['', [Validators.required, Validators.minLength(10)]], 
    });
  }
  toggleMap(): void {
    this.showMap = !this.showMap;
  
    if (this.showMap) {
      setTimeout(() => {
        this.map.updateSize(); // Important pour ajuster la taille de la carte
      }, 100);
    }
  }
  
  onSubmit() {
    if (this.sessionForm.valid) {
        const courseId = this.sessionForm.get('courseId')?.value;
        if (!courseId) {
            console.error("❌ Course ID is undefined or null!");
            return;
        }
  
        // 🔥 Vérifie si les dates existent avant conversion
        const startTime = this.sessionForm.get('startTime')?.value 
            ? new Date(this.sessionForm.get('startTime')?.value).toISOString() 
            : null;
        
        const endTime = this.sessionForm.get('endTime')?.value 
            ? new Date(this.sessionForm.get('endTime')?.value).toISOString() 
            : null;
  
        if (!startTime || !endTime) {
            console.error("❌ StartTime ou EndTime est NULL !");
            return;
        }
  
        const newSession: Session = {
            ...this.sessionForm.value,
            startTime: startTime,  // ✅ Utilisation de startTime pour correspondre au backend
            endTime: endTime
        };
  
        console.log("📢 Données envoyées au backend:", newSession);
  
        this.sessionService.createSession(newSession, courseId).subscribe(
            (response) => {
                console.log("✅ Session ajoutée avec succès:", response);
                this.successMessage = '✅ Session added successfully!';

                this.sessionForm.reset();
            },
            (error) => {
                console.error("❌ Erreur lors de l'ajout de la session:", error);
            }
        );
    } else {
        console.error("⚠️ Le formulaire est invalide");
    }
  }
  


  
  ngOnInit(): void {
    // Appeler la méthode pour récupérer les cours lors de l'initialisation du composant
    this.getCourses();
    this.initializeMap();

  }

  // Méthode pour récupérer les cours
  getCourses(): void {
    this.courseService.getCourses().subscribe(
      (courses: Courses[]) => {
        this.courses = courses; // Stocker les cours dans le tableau courses
      },
      (error) => {
        console.error('Erreur lors du chargement des cours:', error);
      }
    );
  }
  searchLocation(): void {
    const searchQuery = this.sessionForm.get('searchQuery')?.value;
    if (!searchQuery.trim()) {
      return;
    }
  
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`;
  
    this.http.get<any[]>(url).subscribe((results) => {
      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        const coordinates = fromLonLat([lon, lat]);
  
        this.map.getView().animate({ center: coordinates, zoom: 14 });
        this.sessionForm.patchValue({ location: `${lat.toFixed(5)}, ${lon.toFixed(5)}` });
        this.addMarker(coordinates);
      } else {
        alert('Location not found!');
      }
    });
  }
  


// ✅ Validation pour s'assurer que `startTime` est entre 08:00 et 18:00
validateStartTime(control: AbstractControl) {
  if (!control.value) return null;

  const startTime = new Date(control.value);
  const hour = startTime.getHours();

  // ✅ Modification : La session doit être entre 08:00 et 18:00
  if (hour < 8 || hour > 18) {
    return { invalidStartTime: true };
  }
  return null;
}


// ✅ Validation pour s'assurer que `endTime` est supérieur à `startTime` et que la session ne dépasse pas 3 heures
validateEndTime(control: AbstractControl) {
  if (!control.value || !this.sessionForm) return null;
  const startTime = new Date(this.sessionForm.get('startTime')?.value);
  const endTime = new Date(control.value);

  if (startTime >= endTime) {
    return { endTimeBeforeStart: true };
  }

  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // en heures
  if (duration > 3) {
    return { maxSessionDuration: true };
  }

  return null;
}


// ✅ Initialiser la carte OpenLayers
initializeMap(): void {
  this.vectorSource = new VectorSource();
  this.vectorLayer = new VectorLayer({
    source: this.vectorSource
  });

  this.map = new Map({
    target: 'map', // L'ID du div HTML
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      this.vectorLayer
    ],
    view: new View({
      center: fromLonLat([10.1815, 36.8065]), // Centre de Tunis
      zoom: 12
    })
  });

  // ✅ Ajouter l'événement de clic
  this.map.on('click', (event) => {
    const coordinates = event.coordinate;
    const [lon, lat] = fromLonLat(coordinates, 'EPSG:4326');

    // Mettre à jour le champ de localisation avec les coordonnées
    this.sessionForm.patchValue({ location: `${lat.toFixed(5)}, ${lon.toFixed(5)}` });

    // Ajouter le marqueur
    this.addMarker(coordinates);
  });
}

addMarker(coordinates: number[]): void {
  // Retirer le marqueur précédent
  if (this.markerFeature) {
    this.vectorSource.removeFeature(this.markerFeature);
  }

  this.markerFeature = new Feature({
    geometry: new Point(coordinates),
  });

  this.markerFeature.setStyle(new Style({
    image: new Icon({
      src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Icône du marqueur
      scale: 0.05
    })
  }));

  this.vectorSource.addFeature(this.markerFeature);
}

}
