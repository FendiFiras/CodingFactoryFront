import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationEvent } from 'src/app/Model/locationEvent.model';
import { EventService } from 'src/app/Service/event.service';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

@Component({
  selector: 'app-location-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-event.component.html',
  styleUrls: ['./location-event.component.scss']
})
export class LocationEventComponent implements OnInit, AfterViewInit {
  locations: LocationEvent[] = [];
  newLocation!: LocationEvent;
  selectedLocation: LocationEvent | null = null;
  isAddModalOpen = false;
  isEditModalOpen = false;

  // OpenLayers map
  map!: Map;
  vectorSource!: VectorSource;
  markerFeature!: Feature;

  // Reference to the map container in the modal
  @ViewChild('addMap') addMapElement!: ElementRef;
  @ViewChild('editMap') editMapElement!: ElementRef;

  constructor(private locationEventService: EventService) {}

  ngOnInit(): void {
    this.getAllLocations();
  }

  ngAfterViewInit(): void {
    // Initialize the map when the modal opens
  }

  initializeMap(targetElement: HTMLElement, centerLat: number, centerLon: number): void {
    // Création de la source du vecteur et du calque pour le marqueur
    this.vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
  
    // Création de la carte
    this.map = new Map({
      target: targetElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([centerLon, centerLat]),
        zoom: centerLat && centerLon ? 15 : 5
      })
    });
  
    // Gestion du clic sur la carte pour ajouter un marqueur
    this.map.on('click', (event) => {
      const coords = toLonLat(event.coordinate);
      const lon = coords[0];
      const lat = coords[1];
  
      // Mise à jour des coordonnées en fonction du contexte (Ajout ou Édition)
      if (this.isAddModalOpen) {
        this.newLocation.latitude = lat;
        this.newLocation.longitude = lon;
      } else if (this.isEditModalOpen && this.selectedLocation) {
        this.selectedLocation.latitude = lat;
        this.selectedLocation.longitude = lon;
      }
  
      // Suppression des anciens marqueurs et ajout du nouveau
      this.vectorSource.clear();
      this.markerFeature = new Feature({
        geometry: new Point(fromLonLat([lon, lat]))
      });
  
      this.markerFeature.setStyle(
        new Style({
          image: new Icon({
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            scale: 0.1 // Taille du marqueur
          })
        })
      );
  
      this.vectorSource.addFeature(this.markerFeature);
  
      // Recentrer la carte sur le marqueur (sans changer le zoom)
      this.map.getView().setCenter(fromLonLat([lon, lat]));
    });
  }
  
  

  // Récupérer toutes les localisations
  getAllLocations(): void {
   
    this.locationEventService.getAllLocations().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des locations', error);
      }
    );
  }

  // Ouvrir le modal d'ajout
  openModal(): void {
    this.newLocation = {
      idLocal: 0,
      locationName: '',
      address: '',
      latitude: null as any,
      longitude: null as any
    };
    this.isAddModalOpen = true;

    // Initialize the map for the "Add" modal
    setTimeout(() => {
      this.initializeMap(this.addMapElement.nativeElement,48.84274956467346, 2.3184901950473145); // Default center (France)
    }, 0);
  }

  // Fermer le modal d'ajout
  closeModal(): void {
    this.isAddModalOpen = false;
    this.vectorSource?.clear();
  }

  openEditModal(location: LocationEvent): void {
    console.log("Localisation sélectionnée :", location);
    this.selectedLocation = {
      ...location,
      latitude: location.latitude,
      longitude: location.longitude
    };
    this.isEditModalOpen = true;

    // Initialize the map for the "Edit" modal
    setTimeout(() => {
      const lat = this.selectedLocation?.latitude || 46.603354;
      const lon = this.selectedLocation?.longitude || 1.888334;
      this.initializeMap(this.editMapElement.nativeElement, lat, lon);

      // Add a marker if there are existing coordinates
      if (this.selectedLocation?.latitude && this.selectedLocation?.longitude) {
        this.markerFeature = new Feature({
          geometry: new Point(fromLonLat([this.selectedLocation.longitude, this.selectedLocation.latitude]))
        });
        this.markerFeature.setStyle(
          new Style({
            image: new Icon({
              src: 'https://openlayers.org/en/latest/examples/data/icon.png',
              scale: 0.1
            })
          })
        );
        this.vectorSource.addFeature(this.markerFeature);
      }
    }, 0);
  }

  // Fermer le modal de modification
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.vectorSource?.clear();
  }

  // Ajouter une localisation
  addLocation(): void {
    this.locationEventService.addLocation(this.newLocation).subscribe(() => {
      this.getAllLocations();
      this.closeModal();
    });
  }

  // Modifier une localisation
  editLocation(): void {
    if (this.selectedLocation) {
      this.locationEventService.updateLocation(this.selectedLocation).subscribe(() => {
        this.getAllLocations();
        this.closeEditModal();
      });
    }
  }

  // Supprimer une localisation avec confirmation
  deleteLocation(id: number): void {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette localisation ?")) {
      this.locationEventService.deleteLocation(id).subscribe(() => {
        this.locations = this.locations.filter(location => location.idLocal !== id);
      }, error => {
        alert("Erreur : Impossible de supprimer la localisation.");
      });
    }
  }
}