import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoRecord } from '../../models';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from "../../../pipes/safe-url.pipe";

@Component({
  selector: 'app-video-sidebar',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './video-sidebar.component.html',
  styleUrl: './video-sidebar.component.scss'
})
export class VideoSidebarComponent {
  @Input() videos: VideoRecord[] = [];

  @Output() playVideo = new EventEmitter<Blob>();
  @Output() deleteVideo = new EventEmitter<number>();

  formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  formatTime(timestamp: number): string {
    const d = new Date(timestamp);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
