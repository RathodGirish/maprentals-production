import { Component, Injectable, NgModule, Inject } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';

// import { FormData } from 'form-data';

// import { Observable } from 'rxjs/Rx';
import { Observable } from "rxjs/Observable";


import 'rxjs/add/operator/map';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class UploadPictureService {
    headers : Headers;
    constructor(public http: Http) {
    }

    // uploadPicture(file: any) {
    //     return Observable.fromPromise(new Promise((resolve, reject) => {
    //         let formData: any = new FormData()
    //         let xhr = new XMLHttpRequest()
    //         formData.append("files", file, file.name);
    //         xhr.setRequestHeader("enctype", "multipart/form-data");
    //         // xhr.setRequestHeader("Cache-Control", "no-cache");
    //         // xhr.setRequestHeader("Cache-Control", "no-store");
    //         // xhr.setRequestHeader("Pragma", "no-cache");

    //         xhr.onreadystatechange = function () {
    //             if (xhr.readyState === 4) {
    //                 if (xhr.status === 200) {
    //                     resolve(JSON.parse(xhr.response))
    //                 } else {
    //                     reject(xhr.response)
    //                 }
    //             }
    //         }
    //         xhr.open("POST", GlobalVariable.BASE_API_URL + GlobalVariable.UPLOAD_PICTURE, true);
    //         xhr.send(formData);
    //     }));
    // }
    public uploadPicture (file: any): Observable<any> {
        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            formData.append("files", file, file.name);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            // xhr.upload.onprogress = (event) => {
            //     this.progress = Math.round(event.loaded / event.total * 100);

            //     this.progressObserver.next(this.progress);
            // };

            xhr.open('POST', GlobalVariable.BASE_API_URL + GlobalVariable.UPLOAD_PICTURE, true);
            xhr.send(formData);
        });
    }
}