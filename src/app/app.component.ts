import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { BandwidthService } from './services/bandwidth.service';
import { AddVideo, LoadVideos, SetQuality } from './store/video.actions';
import { VideoState } from './store/video.state';
import { Observable } from 'rxjs';
import { VideoQuality, VideoRecord } from './models';
import { CameraRecorderComponent } from './components/camera-recorder/camera-recorder.component';
import { AsyncPipe } from '@angular/common';
import { VideoSidebarComponent } from './components/video-sidebar/video-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CameraRecorderComponent,
    AsyncPipe,
    VideoSidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @Select(VideoState.getVideos) videos$!: Observable<VideoRecord[]>;
  @Select(VideoState.getQuality) quality$!: Observable<VideoQuality>;

  isInitializing = true;
  videoToPlay: Blob | null = null;

  constructor(
    private store: Store,
    private bandwidthService: BandwidthService,
  ) {}

  async ngOnInit() {
    this.store.dispatch(new LoadVideos());

    this.isInitializing = true;
    const detectedQuality = await this.bandwidthService.getBandwidth();

    this.store.dispatch(new SetQuality(detectedQuality));
    this.isInitializing = false;
  }

  onVideoRecorded(blob: Blob) {
    const newVideo: VideoRecord = { blob, createdAt: Date.now() };
    this.store.dispatch(new AddVideo(newVideo));
  }

  onQualityChanged(quality: VideoQuality) {
    this.store.dispatch(new SetQuality(quality));
  }
}
