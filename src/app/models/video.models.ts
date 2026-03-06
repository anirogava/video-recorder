export enum VideoQuality {
  LOW = 'Low', // 360p (< 2 Mbps)
  MEDIUM = 'Medium', // 720p (2 - 5 Mbps)
  HIGH = 'High', // 1080p (> 5 Mbps)
}

export interface VideoRecord {
  id?: number;
  blob: Blob;
  title?: string;
  createdAt: number;
}

export interface VideoStateModel {
  quality: VideoQuality;
  videos: VideoRecord[];
}
