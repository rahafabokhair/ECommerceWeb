import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  upload_url = environment.server_url + '/api/uploadFile/Upload';

  constructor(private http: HttpClient) {}
  uploadImage(datafile: any) {
    return this.http.post(this.upload_url, datafile);
  }
}
