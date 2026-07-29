import { Pipe, PipeTransform } from '@angular/core';
import { toDriveImageUrl } from '../drive_img_extract';

@Pipe({
  name: 'driveImg',
})
export class DriveImgPipe implements PipeTransform {
  transform(url: string | null | undefined, fallback: string = 'assets/imageScratch.png'): string {
    return toDriveImageUrl(url, fallback);
  }
}
