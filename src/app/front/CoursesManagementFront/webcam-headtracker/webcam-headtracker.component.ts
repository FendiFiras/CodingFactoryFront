import {
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import * as faceMesh from '@mediapipe/face_mesh';  // MediaPipe FaceMesh
import '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-webcam-headtracker',
  templateUrl: './webcam-headtracker.component.html',
  styleUrls: ['./webcam-headtracker.component.scss'],
  imports: []
})
export class WebcamHeadtrackerComponent implements OnInit, AfterViewInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  @Output() headTurnDetected = new EventEmitter<void>();
  @Output() webcamStatus = new EventEmitter<boolean>(); // ✅ Nouveau Output

  private faceMeshModel: any;
  private previousYaw: number = 0;
  private turnThreshold: number = 20;
  private turnCooldown: number = 2000;
  private lastTurnTime = 0;

  constructor(private ngZone: NgZone) {}

  async ngOnInit() {
    await this.loadFaceMeshModel();
  }

  ngAfterViewInit(): void {
    this.startVideo();
  }

  async loadFaceMeshModel() {
    this.faceMeshModel = new faceMesh.FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    this.faceMeshModel.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.faceMeshModel.onResults(this.onFaceMeshResults.bind(this));
  }

  startVideo() {
    const video = this.videoElement.nativeElement;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;

        // ✅ Webcam activée : on informe le parent
        this.ngZone.run(() => this.webcamStatus.emit(true));

        video.onloadeddata = () => {
          setInterval(() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.faceMeshModel.send({ image: canvas });
          }, 200);
        };
      })
      .catch((error) => {
        console.error("❌ Webcam refusée ou inaccessible :", error);

        // ❌ Webcam désactivée ou refusée : on envoie false
        this.ngZone.run(() => this.webcamStatus.emit(false));
      });
  }

  onFaceMeshResults(results: any) {
    if (results.multiFaceLandmarks.length > 0) {
      const face = results.multiFaceLandmarks[0];
      const leftEye = face[33];
      const rightEye = face[133];

      const dx = rightEye.x - leftEye.x;
      const dy = rightEye.y - leftEye.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const now = Date.now();
      if (Math.abs(angle - this.previousYaw) > this.turnThreshold &&
          (now - this.lastTurnTime > this.turnCooldown)) {
        this.previousYaw = angle;
        this.lastTurnTime = now;

        this.ngZone.run(() => this.headTurnDetected.emit());
      }
    }
  }
}
