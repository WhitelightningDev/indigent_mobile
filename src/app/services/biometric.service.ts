import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, empty, firstValueFrom, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { BiometricModel, ImageTypeEnum } from '../models/biometric-model';

@Injectable({
  providedIn: 'root',
})
export class BiometricService {
  model: {
    LeftThumb: string;
    RightThumb: string;
    IdDocument: string;
    Selfie: string;
    MunicipalAccount: string;
    Payslip: string;
    SASSACard: string;
  };
  canFinalize: boolean;
  constructor(protected http: HttpClient) {}

  public async finalizeApplication(
    apiKey: string,
    idNumber: string
  ): Promise<any> {
    var params: string = `${apiKey}/${idNumber}`;

    return await firstValueFrom(
      this.http
        .get<any>(
          `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Finalize_Ind_Application/` +
            params
        )
        .pipe(
          tap(() => {
            return null;
          })
        )
    );
  }

  public async FinalizeIndigent(apiKey, idNumber: string) {
    // finalize comes here
    var params: string = `${apiKey}/${idNumber}`;

    return await firstValueFrom(
      this.http
        .get<any>(
          `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Finalize_Ind_Application/` +
            params
        )
        .pipe(
          tap(() => {
            return null;
          })
        )
    );
  }

  public getImage(
    apiKey: string,
    idNumber: string,
    imageType: ImageTypeEnum
  ): Promise<string> {
    return new Promise<any>(async (resolve, reject) => {
      var params: string =
        `/${encodeURIComponent(apiKey)}` +
        `/${encodeURIComponent(idNumber)}` +
        `/${encodeURIComponent('IND')}` +
        `/${encodeURIComponent(imageType)}`;

      await firstValueFrom(
        this.http
          .get<any>(
            `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Get_Ind_Images/` +
              params
          )
          .pipe(
            map((jsonData) => {
              if (
                jsonData.result &&
                jsonData.result.length > 0 &&
                jsonData.result[0].length > 0
              ) {
                var result = jsonData.result[0][0];
                return (
                  'data:image/png;base64,' +
                  <string>result[Object.keys(result)[0]]
                );
              } else {
                return empty();
              }
            }),
            tap((jsonData: any) => {
              resolve(jsonData);
            }),
            catchError((error) => {
              reject(error);
              return of(error);
            })
          )
      )
        .then()
        .catch((error) => {
          reject(error);
          return error;
        });
    });
  }

  protected getBiometrics(): Array<BiometricModel> {
    var result: Array<BiometricModel> = [];

    result.push(
      new BiometricModel(
        'idbook',
        ImageTypeEnum.ID_Document,
        'Identity document',
        'IdDocument'
      )
    );
    result.push(
      new BiometricModel('selfie', ImageTypeEnum.Selfie, 'Selfie', 'Selfie')
    );
    result.push(
      new BiometricModel(
        'munaccount',
        ImageTypeEnum.Municipal_Account,
        'Municipal account',
        'MunicipalAccount'
      )
    );
    result.push(
      new BiometricModel(
        'payslip',
        ImageTypeEnum.Payslip_Image,
        'Payslip',
        'Payslip'
      )
    );
    result.push(
      new BiometricModel(
        'sassa',
        ImageTypeEnum.SASSA_Card,
        'SASSA Card',
        'SASSACard'
      )
    );

    return result;
  }

  public postImage(
    apiKey: string,
    idNumber: string,
    imagetype: ImageTypeEnum,
    base64image: string
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (base64image.substring(0, 5) === 'data:') {
        base64image = base64image.split('base64,')[1];
      }

      var params: string =
        `${encodeURIComponent(apiKey)}` +
        `/${encodeURIComponent(idNumber)}` +
        `/${encodeURIComponent('IND')}` +
        `/${encodeURIComponent(imagetype)}`;

      var payload = {
        File: base64image,
      };
      await firstValueFrom(
        this.http
          .post(
            `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Post_Image/` +
              params,
            payload
          )
          .pipe(
            tap((jsonData: any) => {
              resolve(jsonData);

              return jsonData;
            }),
            catchError((error) => {
              reject(error);
              return of(error);
            })
          )
      );
    });
  }

  public async fetchAllImages(apiKey: string, idNumber: string): Promise<void> {
    try {
      // List of image types you want to fetch
      const imageTypes = [
        ImageTypeEnum.ID_Document,
        ImageTypeEnum.Selfie,
        ImageTypeEnum.Municipal_Account,
        ImageTypeEnum.Payslip_Image,
        ImageTypeEnum.SASSA_Card,
        ImageTypeEnum.Left_Thumb,
        ImageTypeEnum.Right_Thumb,
      ];

      // Fetch images in parallel
      const fetchPromises = imageTypes.map((type) =>
        this.getImage(apiKey, idNumber, type)
      );

      // Wait for all fetches to complete
      const responses = await Promise.all(fetchPromises);

      // Map responses to your model
      this.model = {
        LeftThumb: responses[5],
        RightThumb: responses[6],
        IdDocument: responses[0],
        Selfie: responses[1],
        MunicipalAccount: responses[2],
        Payslip: responses[3],
        SASSACard: responses[4],
      };

      // Update canFinalize flag based on whether all required images are present
      this.canFinalize = imageTypes.every(
        (type, index) => responses[index] != null
      );

      // Handle UI update or any other post-fetch logic here
    } catch (error) {
      console.error('Error fetching images', error);
      // Handle error
    }
  }
}
