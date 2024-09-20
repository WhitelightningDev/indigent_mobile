import { Injectable } from '@angular/core';
import { ImageTypeEnum } from '../existing-indigent/models/image-type-enum';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  BehaviorSubject,
  firstValueFrom,
  from,
  Observable,
  Subject,
} from 'rxjs';
import { BaseApplicationModel } from '../existing-indigent/models/base-application-model';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment.prod';
import { BaseComponent } from './base-components';
const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root',
})
export class ExistingIndigentService extends BaseComponent {
  constructor(private http: HttpClient) {
    super();
  }

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false // Changed to false to initially require login
  );

  public getApplicationResult(
    apiKey: string,
    idNumber: string
  ): Promise<BaseApplicationModel> {
    return new Promise<BaseApplicationModel>(async (resolve, reject) => {
      await firstValueFrom(
        this.http
          .get(
            `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Get_Indigent_Result/${apiKey}/${idNumber}/IND`
          )
          .pipe(
            tap((jsonData: any) => {
              if (jsonData.result[0][0].Error) {
                this.showErrorToast(jsonData.result[0][0].Error);
                reject(jsonData.result[0][0].Error);
              }
            }),
            map((jsonData: any) => {
              if (
                jsonData.result &&
                jsonData.result.length > 0 &&
                jsonData.result[0].length > 0
              ) {
                const result: BaseApplicationModel = jsonData
                  .result[0][0] as BaseApplicationModel;
                result.ID_Number = idNumber;
                resolve(result);
              } else {
                resolve({} as BaseApplicationModel);
              }
            })
          )
      );
    });
  }

  public getImage(
    apiKey: string,
    idNumber: string,
    imageType: ImageTypeEnum
  ): Promise<string> {
    const imageTypeValue = imageType;
    const url = `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Get_Ind_Images/${apiKey}/${idNumber}/IND/${imageTypeValue}`;

    // Use the formatted input value in the payload
    const imageTypes = [
      ImageTypeEnum.Left_Thumb,
      ImageTypeEnum.Right_Thumb,
      ImageTypeEnum.ID_Document,
      ImageTypeEnum.Selfie,
      ImageTypeEnum.Municipal_Account,
      ImageTypeEnum.Payslip_Image,
      ImageTypeEnum.SASSA_Card,
    ];

    return firstValueFrom(this.http.post<any>(url, imageTypes));
  }

  // public getImage(apiKey: string, idNumber: string, imageType: ImageTypeEnum): Promise<string> {
  //   const imageTypeValue = imageType;
  //   const url = `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Get_Ind_Images/${apiKey}/${idNumber}/IND/${imageTypeValue}`;

  //   return new Promise<string>((resolve, reject) => {
  //     this.http.get<any>(url, { responseType: 'json' }).pipe(
  //       map((response: any) => {
  //         if (response.result && response.result.length > 0) {
  //           const result = response.result[0];
  //           if (result && result.length > 0) {
  //             const imageData = result[0];
  //             return `data:image/png;base64,${imageData}`;
  //           } else {
  //             throw new Error('No image data found in result array');
  //           }
  //         } else {
  //           throw new Error('No result array found');
  //         }
  //       })
  //     ).subscribe(
  //       (base64Image) => resolve(base64Image),
  //       (error) => reject(error)
  //     );
  //   });
  // }
}
