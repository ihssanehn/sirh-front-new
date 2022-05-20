import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MyButtonTypes} from '../button/button.component';
import {NgxImageCompressService} from 'ngx-image-compress';
import {environment} from '@env/environment';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
    providers: [NgxImageCompressService],
})
export class ImageCropperComponent implements OnInit, AfterViewInit {


  croppedImage: any = '';
  myButtonTypes = MyButtonTypes;
  isloading = true;
  @Input() title;
  @Input() file;
  @Input() aspectRatio = 1;
  @Input() maintainAspectRatio = true;
  @Output() submitImage: EventEmitter<{file: File; base64: string;}> = new EventEmitter();
    errorMessage = '';
    infoMessage = '';
    imgResultBeforeCompress:string;
    imgResultAfterCompress:string;
    isCompressing: boolean;
  constructor(public modal: NgbActiveModal, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      console.log('hello anass', this.croppedImage)
  }

    async compressFile(filesize) {
            console.log('compressFile', this.croppedImage);
            console.warn('Size in bytes was:', this.imageCompress.byteCount(this.croppedImage));
           this.isCompressing = true;
           try{
               const result = await this.imageCompress.compressFile(this.croppedImage, -1);
               this.imgResultAfterCompress = result;
               this.croppedImage = result;
               // this.setSizeErrorMessage(filesize);
           }catch(e){

           }finally{
               this.isCompressing = false;
               // this.errorMessage = '';
           }
    }

    setSizeErrorMessage(filesize){
        if( filesize > environment.MAX_FILE_SIZE){
            console.log('filesize anass', filesize, environment.MAX_FILE_SIZE);
            this.errorMessage = 'This image(' + filesize + ' ko) has exceed the max size '+ environment.MAX_FILE_SIZE+ ' ko';
        }else{
            console.log('filesize anass 2', filesize, environment.MAX_FILE_SIZE);
            this.errorMessage = '';
        }
    }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // const filesize = this.from64ToImageFile(event.base64)?.size / 1024;
    // this.setSizeErrorMessage(filesize);
  }

  imageLoaded() {
      console.log('imageLoaded', this.croppedImage);
  }

  async cropperReady() {
    this.isloading = false;
      let filesize = this.from64ToImageFile(this.croppedImage)?.size / 1024;
console.log('cropperReady');
    while (filesize > environment.MAX_FILE_SIZE) {
        this.infoMessage = 'looks like your photo is big, we are compressing id, would you wait a few seconds..';
        console.log('cropperReady', this.infoMessage);
       await  this.compressFile(filesize);
        filesize = this.from64ToImageFile(this.croppedImage)?.size / 1024;
    }
    this.infoMessage = '';
    this.setSizeErrorMessage(filesize);
  }

  loadImageFailed() {
      console.log('loadImageFailed');
      this.isloading = false;
  }

  submit(){
    this.submitImage.emit({
      file: this.from64ToImageFile(this.croppedImage),
      base64: this.croppedImage
    });
    this.modal.close();
  }

  private decodeBase64(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }

  private from64ToImageFile(img64){
    const decodedImage = this.decodeBase64(img64);
    const blob = new Blob([decodedImage], {type: 'image/png'});
    const file = new File([blob], 'decozin.png', { type: 'image/png' });
    console.log('filesize', file);
    return file;
  }

  cancel(){
    console.log('cancel', this.isloading, this.errorMessage, this.isCompressing);
    // this.modal.close();
  }

    compressFileClick() {
        const filesize = this.from64ToImageFile(this.croppedImage)?.size / 1024;
        this.compressFile(filesize);
    }
}
