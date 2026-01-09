import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Photo } from '../../core/models/object-model';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { AlertifyService } from '../../shared/services/alertify.service';
import { error } from 'console';

@Component({
  selector: 'app-photo-management',
  standalone: true,
  imports: [FileUploadModule, CommonModule],
  templateUrl: './photo-management.component.html',
  styleUrl: './photo-management.component.css',
})
export class PhotoManagementComponent implements OnInit {
  @Input() photos: Photo[] = [];
  @Input() productId!: number;
  route = inject(ActivatedRoute);
  adminService = inject(AdminService);
  alertifyService = inject(AlertifyService);
  uploader!: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  baseUrl = environment.server_url;
  //productId!: number;

  prevPhoto: any;
  constructor() {}
  ngOnInit(): void {
    //this.productId = +this.route.snapshot.params['productId'];

    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/api/product/' + this.productId + '/photos', // Replace with your backend URL
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain,
        };

        this.photos.push(photo);
        if (this.photos.length <= 0) {
          photo.isMain = true;
        }
        if (photo.isMain) {
          this.adminService.changePhotoUrl(photo.url);
          //this.adminService.currentUser.photoURL = photo.url;
          //localStorage.setItem('currentPhoto', JSON.stringify(photo));
        }
      }
    };
  }
  setMainPhoto(photo: any) {
    this.prevPhoto = this.photos.find((p) => p.isMain);

    this.adminService.setMainPhoto(photo, photo.productId).subscribe(
      () => {
        this.prevPhoto.isMain = false;
        photo.isMain = true;
        this.adminService.currentPhotoUrl.subscribe(photo);

        this.alertifyService.success('photo set to main');
      },
      (error) => {
        this.alertifyService.error(error);
      }
    );
  }
  // getMainPhoto():Photo {

  //      return this.photos.find( (p) => p.isMain);

  // }
  getPhotosForProduct() {}

  deletePhoto(photoId: number) {
    debugger;
    this.adminService.deletePhoto(photoId, this.productId).subscribe(
      () => {
        this.alertifyService.success('photo deleted');
      },
      (error) => {
        this.alertifyService.error(error);
      }
    );
  }
}
