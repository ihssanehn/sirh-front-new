import { Pipe, PipeTransform } from '@angular/core';
import {UserService} from '@app/core/services';


@Pipe({ name: 'getPhotoFromBackend' })
export class GetPhotoPipe implements PipeTransform {

  constructor(private userService: UserService) { }

  async transform(photo, defaultImage = '', safeurl=true) {
    const regexp_upload = /^data:?[a-z]{5}\/[a-z]*;.*/;
    const patternLink = /^((http|https|ftp):\/\/)/;
    if (regexp_upload.test(photo)) {
      return photo;
    }
    if(patternLink.test(photo)) {
      return photo;
    }
    return await this.userService.getImageSafeUrl(photo, defaultImage, safeurl);
  }
}
