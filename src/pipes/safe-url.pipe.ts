import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: Blob | string | null): SafeUrl | null {
    if (!value) return null;

    const url = value instanceof Blob ? URL.createObjectURL(value) : value;

    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
