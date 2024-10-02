import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, firstValueFrom, map, of, tap, throwError } from 'rxjs';
import {
  BaseApplicationModel,
  PersonModel,
  PersonViewModel,
  ValidateIdNumberModel,
  VillageModel,
} from '../models/newAppModel';
import { environment } from 'src/environments/environment.prod';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class NewIndigentService {
  private villages: Array<VillageModel> = [];
  private consent = '';

  constructor(
    // private storageService: StorageService,
    private http: HttpClient,
    private sanitized: DomSanitizer
  ) {
    try {
      this.villages = JSON.parse(sessionStorage.getItem('VILLAGES') || '[]');
    } catch {
      this.villages = [];
    }
  }

  getVillages(apiKey: string): Promise<Array<VillageModel>> {
    return new Promise(async (resolve, reject) => {
      if (this.villages !== null && this.villages.length > 0) {
        resolve(this.villages);
        return;
      }

      // let customerNo: string = this.storageService.getConsumer();
      let customerNo: string = '10002010';
      let params = `${apiKey}/${customerNo}`;

      await firstValueFrom(
        this.http
          .get<any>(
            `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Get_Villages/` +
              params
          )
          .pipe(
            tap((jsonData: any) => {
              if (jsonData.result && jsonData.result.length > 0) {
                let result = jsonData.result[0];

                // console.debug("Villages response: ", result);
                sessionStorage.setItem('VILLAGES', result);

                resolve(result);
              }
              return null;
            }),
            catchError((error) => {
              reject(error);
              return throwError(error);
            })
          )
      );
    });
  }

  public getConsent(apiKey: string, customerNo: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if (this.consent) {
        resolve(this.consent);
        return;
      }

      var params: string = `${apiKey}/${customerNo}`;

      await firstValueFrom(
        this.http
          .get<any>(
            `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Get_Consent/` +
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

                var consent = result.Consent;

                var doc = new DOMParser().parseFromString(consent, 'text/html');
                consent = doc.documentElement.textContent;

                //this.consent = this.sanitized.bypassSecurityTrustHtml(consent);
                return consent;
              } else {
                return '';
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
      );
    });
  }

  validateIDNumber(
    apiKey: string,
    idNumber: string
  ): Promise<ValidateIdNumberModel> {
    let params = `${apiKey}/${idNumber}`;

    return firstValueFrom(
      this.http
        .get<ValidateIdNumberModel>(
          `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Validate_ID_Number/` +
            params
        )
        .pipe(
          map((jsonData: any) => {
            var result = <ValidateIdNumberModel>jsonData.result[0];
            result.Valid = jsonData.result[0].Valid_ID === 'Valid';
            if (jsonData.result[0] && jsonData.result[0].error) {
              result.Errors = [];
              result.Errors.push(jsonData.result[0].error);
            }
            return result;
          })
        )
    );
  }

  validate(apiKey: string, person: PersonModel): Promise<PersonModel> {
    let params =
      encodeURIComponent(`${apiKey}`) +
      `/` +
      encodeURIComponent(`${person.ID_Number}`) +
      `/` +
      encodeURIComponent(`${person.First_Names}`) +
      `/` +
      encodeURIComponent(`${person.Surname}`) +
      `/` +
      encodeURIComponent(`${moment(person.DOB).format('YYYY-MM-DD')}`) +
      `/`;

    return firstValueFrom(
      this.http
        .get<ValidateIdNumberModel>(
          `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Validate_Person/` +
            params
        )
        .pipe(
          map((jsonData: any) => {
            person.valid =
              jsonData.result[0].Success === 'Correct Person' &&
              !jsonData.result[0].Error;
            person.status = jsonData.result[0].Error;
            return person;
          })
        )
    );
  }

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
                reject(jsonData.result[0][0].Error);
              }
            }),
            map((jsonData: any) => {
              if (
                jsonData.result &&
                jsonData.result.length > 0 &&
                jsonData.result[0].length > 0
              ) {
                var result: BaseApplicationModel = <BaseApplicationModel>(
                  jsonData.result[0][0]
                );
                result.ID_Number = idNumber;
                resolve(result);
              } else {
                resolve(<BaseApplicationModel>{});
              }
            })
          )
      );
    });
  }

  public postApplication(
    apiKey: string,
    person: PersonViewModel
  ): Promise<ValidateIdNumberModel> {
    return new Promise<ValidateIdNumberModel>(async (resolve, reject) => {
      var params: string =
        `${encodeURIComponent(apiKey)}` +
        `/${encodeURIComponent(person.ID_Number || 'NULL')}` +
        `/${encodeURIComponent(person.Person_Names || 'NULL')}` +
        `/${encodeURIComponent(person.Surname || 'NULL')}` +
        `/${encodeURIComponent(person.DOBDate || 'NULL')}` +
        `/${encodeURIComponent(person.ID_Issue_Date || 'NULL')}` +
        `/${encodeURIComponent(person.Address_1 || 'NULL')}` +
        `/${encodeURIComponent(person.Address_2 || 'NULL')}` +
        `/${encodeURIComponent(person.Address_3 || 'NULL')}` +
        `/${encodeURIComponent(person.Postal_Code || 'NULL')}` +
        `/${encodeURIComponent(person.Dependents || '0')}` +
        `/${encodeURIComponent(person.Account_Number || 'NULL')}` +
        `/${encodeURIComponent(person.Village || 'NULL')}` +
        `/${encodeURIComponent(person.Ward || 'NULL')}` +
        `/${encodeURIComponent(person.Cell)}` +
        `/${encodeURIComponent(person.Employed || 'NULL')}` +
        `/${encodeURIComponent(person.Employed_At || 'NULL')}` +
        `/${encodeURIComponent(person.email_Address || 'NULL')}` +
        `/${encodeURIComponent(person.Municipal_Account_2 || 'NULL')}` +
        `/${encodeURIComponent(person.Remarks || 'NULL')}` +
        `/${encodeURIComponent('IND')}` +
        `/${encodeURIComponent(person.Salary || '0')}`;

      await firstValueFrom(
        this.http
          .get<any>(
            this.FormatRequest(
              `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Post_Indigent/` +
                params
            )
          )
          .pipe(
            tap((response) => {
              resolve(response);
            }),
            catchError((error) => {
              reject(error);
              return error;
            })
          )
      ).catch((error) => {
        reject(error);
        return error;
      });
    });
  }

  private FormatRequest(request: string): string {
    return request.replace(/%2F/g, '%2D').replace(/%0A/g, '%20%7C%20');
  }

  private fixCellNumberForOTP(cellNumber: string) {
    let result = '';
    if (cellNumber.startsWith('0')) {
      result = '27' + cellNumber.substring(1);
    } else if (cellNumber.startsWith('+27')) {
      result = '27' + cellNumber.substring(3);
    } else if (cellNumber.startsWith('27')) {
      result = cellNumber;
    } else if (cellNumber.length === 9 && !cellNumber.startsWith('27')) {
      result = '27' + cellNumber;
    } else {
      result = cellNumber;
    }
    return result;
  }

  public sendOtpSms(apiKey: string, cellNumber: string): Promise<string> {
    return new Promise<any>(async (resolve, reject) => {
      sessionStorage.removeItem('CELL_OTP');
      let otpCellNumber = this.fixCellNumberForOTP(cellNumber);
      const params: string = `${encodeURIComponent(
        apiKey
      )}/${encodeURIComponent(otpCellNumber)}`;

      await firstValueFrom(
        this.http
          .get<any>(
            `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Send_OTP_SMS/${params}`
          )
          .pipe(
            map((jsonData: any) => {
              if (jsonData.result && jsonData.result.length > 0) {
                const result = jsonData.result[0].OTP;
                sessionStorage.setItem('CELL_OTP', result);
                resolve(result);
              } else {
                resolve(null);
              }
            }),
            catchError((error) => {
              reject(error);
              return of(error);
            })
          )
      );
    });
  }
}
