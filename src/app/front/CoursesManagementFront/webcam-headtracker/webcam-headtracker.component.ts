import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import * as faceMesh from '@mediapipe/face_mesh';  // Importer MediaPipe FaceMesh
import '@tensorflow/tfjs';  // Importer TensorFlow.js sans la méthode `load`
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-webcam-headtracker',
  templateUrl: './webcam-headtracker.component.html',
  styleUrls: ['./webcam-headtracker.component.scss'],
  imports: []  // N'oubliez pas de ne pas supprimer cette ligne !
})
export class WebcamHeadtrackerComponent implements OnInit, AfterViewInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;  // Définir static: false
  @Output() headTurnDetected = new EventEmitter<void>();

  private faceMeshModel: any;
  private previousYaw: number = 0;
  private turnThreshold: number = 20;  // Seuil pour la détection du mouvement de tête
  private turnCooldown: number = 2000;  // 2 secondes de cooldown entre les détections
  private lastTurnTime = 0;

  constructor(private ngZone: NgZone) {}

  // Méthode de détection de la tête
  async ngOnInit() {
    await this.loadFaceMeshModel();
  }

  // Cette méthode est exécutée après que la vue du composant a été initialisée
  ngAfterViewInit(): void {
    this.startVideo();  // Démarrer la vidéo après l'initialisation de la vue
  }

  // Charger le modèle MediaPipe Face Mesh
  async loadFaceMeshModel() {
    // Charger le modèle FaceMesh de MediaPipe
    this.faceMeshModel = new faceMesh.FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    // Paramètres du modèle FaceMesh
    this.faceMeshModel.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Définir la méthode callback pour obtenir les résultats
    this.faceMeshModel.onResults(this.onFaceMeshResults.bind(this));
  }

  // Démarrer la vidéo
  startVideo() {
    const video = this.videoElement.nativeElement;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;

        // Dès que la vidéo est prête, commencez à traiter chaque frame
        video.onloadeddata = () => {
          setInterval(() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.faceMeshModel.send({ image: canvas });
          }, 200); // Fréquence d'appel plus lente pour éviter la surcharge
        };
      })
      .catch((error) => {
        console.error("Erreur lors de l'accès à la webcam", error);
        alert("L'accès à la caméra a échoué. Veuillez vérifier les permissions.");
      });
  }

  // Traitement des résultats FaceMesh
  onFaceMeshResults(results: any) {
    if (results.multiFaceLandmarks.length > 0) {
      const face = results.multiFaceLandmarks[0];
      const leftEye = face[33];  // Position du coin gauche de l'œil
      const rightEye = face[133]; // Position du coin droit de l'œil

      // Calculer l'angle de la tête en fonction des yeux
      const dx = rightEye.x - leftEye.x;
      const dy = rightEye.y - leftEye.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Détecter si la tête est tournée
      const now = Date.now();
      if (Math.abs(angle - this.previousYaw) > this.turnThreshold && (now - this.lastTurnTime > this.turnCooldown)) {
        this.previousYaw = angle;
        this.lastTurnTime = now;
        this.ngZone.run(() => this.headTurnDetected.emit()); // Émettre un événement quand un mouvement est détecté
      }
    }
  }
}
