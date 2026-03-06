import { Injectable } from '@angular/core';
import { VideoQuality } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BandwidthService {
  private testImageUrl = 'assets/test-image.jpg';
  private downloadSizeInBytes = 500000;

  constructor() {}

  async getBandwidth() {
    try {
      const startTime = new Date().getTime();

      const cacheBuster = `?nnn=${startTime}`;

      const response = await fetch(this.testImageUrl + cacheBuster);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.blob();
      const endTime = new Date().getTime();

      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = this.downloadSizeInBytes * 8;
      const speedBps = bitsLoaded / durationInSeconds;
      const speedMbps = speedBps / (1024 * 1024);

      console.log(`Detected Bandwidth: ${speedMbps.toFixed(2)} Mbps`);

      return this.determineQuality(speedMbps);
    } catch (error) {
      console.error('Bandwidth detection failed, defaulting to Medium quality.', error);
      alert('Bandwidth detection failed. Defaulting to Medium Quality.');
      return VideoQuality.MEDIUM;
    }
  }

  private determineQuality(speedMbps: number): VideoQuality {
    if (speedMbps < 2) {
      return VideoQuality.LOW;
    } else if (speedMbps >= 2 && speedMbps <= 5) {
      return VideoQuality.MEDIUM;
    } else {
      return VideoQuality.HIGH;
    }
  }
}
