import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { VideoQuality } from '../../models';
import { interval, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-camera-recorder',
  standalone: true,
  imports: [],
  templateUrl: './camera-recorder.component.html',
  styleUrl: './camera-recorder.component.scss',
})
export class CameraRecorderComponent implements OnChanges, OnDestroy {
  @Input() quality!: VideoQuality;
  @Input() isLoading = true;

  @Output() videoRecorded = new EventEmitter<Blob>();
  @Output() qualityChanged = new EventEmitter<VideoQuality>();

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  stream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: BlobPart[] = [];

  isRecording = false;
  recordingProgress = 0;
  showSettings = false;
  cameraError = false;

  private progressSub!: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quality'] && changes['quality'].currentValue) {
      this.initCamera(this.quality);
    }
  }
  ngOnDestroy() {
    this.stopCamera();
  }

  async initCamera(quality: VideoQuality) {
    this.isLoading = true;
    this.stopCamera();

    const constraints = this.getConstraints(quality);

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: constraints, audio: true });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
      this.cameraError = false;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      this.cameraError = true;
    } finally {
      this.isLoading = false;
    }
  }
  getConstraints(quality: VideoQuality) {
    switch (quality) {
      case VideoQuality.LOW:
        return { width: { ideal: 640 }, height: { ideal: 360 } };
      case VideoQuality.MEDIUM:
        return { width: { ideal: 1280 }, height: { ideal: 720 } };
      case VideoQuality.HIGH:
        return { width: { ideal: 1920 }, height: { ideal: 1080 } };
      default:
        return true;
    }
  }

  changeQuality(newQuality: VideoQuality) {
    this.qualityChanged.emit(newQuality);
    this.showSettings = false;
  }

  startRecording() {
    if (!this.stream) return;
    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      this.videoRecorded.emit(blob);
      this.isRecording = false;
      this.recordingProgress = 0;
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    this.recordingProgress = 0;

    this.progressSub = interval(100)
      .pipe(takeWhile(() => this.isRecording && this.recordingProgress <= 100))
      .subscribe(() => {
        this.recordingProgress += 1;
        if (this.recordingProgress >= 100) this.stopRecording();
      });
  }
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      if (this.progressSub) this.progressSub.unsubscribe();
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  getFormattedTime(): string {
    return (this.recordingProgress / 10).toFixed(1) + ' s';
  }

  protected readonly VideoQuality = VideoQuality;
}
