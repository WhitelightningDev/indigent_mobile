import { ToastController } from '@ionic/angular';
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonInput, IonModal } from '@ionic/angular';
import { NewIndigentService } from 'src/app/services/new-indigent.service';
import { Preferences } from '@capacitor/preferences';
import {
  BaseApplicationModel,
  PersonModel,
  PersonViewModel,
  VillageModel,
} from 'src/app/models/newAppModel';

import { BaseComponent } from '../../services/base-components';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
declare var google;
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-new-indigent',
  templateUrl: './new-indigent.page.html',
  styleUrls: ['./new-indigent.page.scss'],
})
export class NewIndigentPage extends BaseComponent implements OnInit {
  public model: PersonViewModel = new PersonViewModel();

  villages: Array<VillageModel>;
  validatedIDNumber: boolean = false;
  validatedPerson: boolean = false;
  submitting: boolean = false;
  IdNumberValidated: boolean = false;
  ConsentValidated: boolean = false;
  loading: boolean = false;
  @ViewChild('addressInput') addressInput: IonInput;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('Cell', { static: true }) cellModal: IonModal;
  consent: string;
  name: string;
  constructor(
    private IndigentService: NewIndigentService,
    public router: Router,
    private loadingCtrl: LoadingController,
    private ToastController: ToastrModule
  ) {
    super();
  }
  ngAfterViewInit() {
    this.pollForElement();
  }
  private loadings: any;

  private pollForElement() {
    const intervalId = setInterval(() => {
      if (this.addressInput) {
        clearInterval(intervalId); // Stop polling
        this.ViewInput();
      }
    }, 500);
  }

  formatPhoneNumber(input: string) {
    if (input.startsWith('0')) {
      this.model.Cell = '+27' + input.substring(1);
    }
  }

  public validateNumber() {
    // Validate the number format
    if (!this.model.Cell.startsWith('+27')) {
      this.showErrorToast('Please enter a number starting with +27');
      return;
    }

    // Check if the number contains an additional 0 after +27
    const cellWithoutPlus27 = this.model.Cell.replace('+27', '');
    if (cellWithoutPlus27.startsWith('0')) {
      this.showErrorToast('Invalid number: Please do not add a 0 after +27');
      return;
    }

    // Remove spaces and check if the length is valid
    const cleanedNumber = cellWithoutPlus27.replace(/\s+/g, '');
    if (cleanedNumber.length !== 10) {
      this.showErrorToast('Invalid number: Please enter a 10-digit number');
      return;
    }

    // Extract the original local number (10 digits)
    const localCellNumber = cleanedNumber;

    // Call the sendOtpSms method from the service with the original local number
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    this.IndigentService.sendOtpSms(apiKey, localCellNumber)
      .then((otp) => {
        console.log('OTP sent:', otp);
        // Handle successful OTP sending (e.g., show a success message)
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        // Handle error in OTP sending (e.g., show an error message)
      });
  }

  ViewInput() {
    console.log('Address Input:', this.addressInput);
    if (this.addressInput) {
      this.addressInput.getInputElement().then((ref: any) => {
        const autocomplete = new google.maps.places.Autocomplete(ref);

        autocomplete.addListener('place_changed', async () => {
          const loading = await this.loadingCtrl.create({
            message: 'Loading',
            spinner: 'circles',
          });
          loading.present();

          this.model.Address_1 = '';
          this.model.Address_2 = '';
          this.model.Address_3 = '';
          this.model.Postal_Code = '';

          const place = autocomplete.getPlace();
          const street_name = place.name;
          this.model.Address_1 = street_name.trim();
          // Handle the selected place details
          place.address_components.forEach((component) => {
            const types = component.types;
            if (types.includes('street_number')) {
              //streetNumber = component.long_name;
            } else if (types.includes('route')) {
              //streetName = component.long_name;
            } else if (types.includes('sublocality')) {
              this.model.Address_2 = component.long_name;
            } else if (types.includes('locality')) {
              this.model.Address_3 = component.long_name;
            } else if (types.includes('postal_code')) {
              this.model.Postal_Code = component.long_name;
            }
          });
          console.log('Updated Model:', this.model);
          loading.dismiss();
        });
      });
    } else {
      console.error('Address input element not found');
    }
  }
  onDateInputChange(value: string, fieldName: string) {
    // Remove non-numeric characters
    let numericValue = value.replace(/\D/g, '');

    // Apply the mask (YYYY-MM-DD)
    if (numericValue.length >= 4) {
      numericValue = numericValue.slice(0, 4) + '-' + numericValue.slice(4);
    }
    if (numericValue.length >= 7) {
      numericValue = numericValue.slice(0, 7) + '-' + numericValue.slice(7);
    }
    if (numericValue.length > 10) {
      numericValue = numericValue.slice(0, 10); // Limit to YYYY-MM-DD
    }

    // Update the model field
    this.model[fieldName] = numericValue;
  }

  ngOnInit() {
    this.loading = true;
    this.IdNumberValidated = false;
    this.getConsent();
    this.getVillages();
  }
  async getConsent() {
    this.consent = '';
    const token = await Preferences.get({ key: 'my-token' });
    if (token.value) {
      this.consent = await this.IndigentService.getConsent(
        token.value,
        '10002010'
      );
    } else {
      console.error('Token is null');
      this.consent = 'Default consent content or an error message';
    }
  }

  async getVillages() {
    const token = await Preferences.get({ key: 'my-token' });
    if (token.value) {
      this.IndigentService.getVillages(token.value)
        .then((villages) => {
          this.villages = villages;
        })
        .catch((error) => {});
    } else {
      console.error('Token is null');
      this.consent = 'Default consent content or an error message';
    }
    this.loading = false;
  }

  protected populateModelWithApplication(
    applicationModel: BaseApplicationModel
  ): void {
    if (!applicationModel || !applicationModel.ID_Number) return;

    this.model.ID_Issue_Date = applicationModel.ID_Issue_Date;
    this.model.Person_Names = applicationModel.Person_names;
    this.model.Surname = applicationModel.Surname;
    this.model.DOBDate = applicationModel.DOB;
    this.model.Cell = applicationModel.Cell_1; //inputFormat cell +27 (81) 455-1608
    this.model.email_Address = applicationModel.Email_1;
    this.model.Address_1 = applicationModel.Physical_Address_1;
    this.model.Address_2 = applicationModel.Physical_Address_2;
    this.model.Address_3 = applicationModel.Physical_Address_3;
    this.model.Postal_Code = applicationModel.Physical_Cade;
    this.model.Account_Number = applicationModel.Municipal_Account_Number;
    this.model.Dependents = applicationModel.Dependents;
    this.model.Village = applicationModel.Village;
    this.model.Ward = applicationModel.Ward;
    this.model.Employed = applicationModel.Employed;
    this.model.Employed_At = applicationModel.Employed_At;
    this.model.Application_Reference = applicationModel.Application_Reference;
    this.model.Captured_By = applicationModel.Captured_By;
    this.model.Municipal_Account_2 = applicationModel.Municipal_Account_2;
    this.model.Remarks = applicationModel.Remarks;
    this.model.Salary = applicationModel.Salary;

    //this.validatePerson().then().catch();
  }

  async validateIDNumber() {
    const token = await Preferences.get({ key: 'my-token' });
    if (token.value) {
      if (!this.model.ID_Number) {
        this.showErrorToast(`Field can't be empty`);
      } else {
        this.IndigentService.validateIDNumber(token.value, this.model.ID_Number)
          .then(async (validateIdNumberResult) => {
            if (!validateIdNumberResult.Valid) {
              this.model.ID_Number = '';
              this.showErrorToast('Invalid ID');
            } else {
              this.IdNumberValidated = true;
              this.validatedIDNumber = true;
              this.getApplicationData();
            }
          })

          .catch((error) => {});
      }
    } else {
      console.error('Token is null');
      this.consent = 'Default consent content or an error message';
    }
    this.loading = false;
  }

  async validatePerson() {
    if (
      !this.model.Person_Names ||
      !this.model.Surname ||
      !this.model.DOBDate ||
      this.model.Person_Names.trim().length === 0 ||
      this.model.Surname.trim().length === 0 ||
      this.model.DOBDate.trim().length === 0 ||
      this.model.ID_Number.trim().length === 0 ||
      this.model.DOBDate.trim().length < 10
    ) {
      return;
    }
    var person: PersonModel = new PersonModel();
    person.First_Names = this.model.Person_Names;
    person.Surname = this.model.Surname;
    person.DOB = this.model.DOBDate;
    person.ID_Number = this.model.ID_Number;

    const token = await Preferences.get({ key: 'my-token' });
    if (token.value) {
      return this.IndigentService.validate(token.value, person)
        .then(async (validatePersonResult) => {
          if (!validatePersonResult.valid) {
            this.showErrorToast(validatePersonResult.status);
          } else {
            this.showSuccessToast('Person is Valid');

            this.validatedPerson = true;
          }
        })
        .catch((error) => {
          this.showErrorToast(
            'There was an error validating the identity number! Please contact support'
          );
        });
    } else {
      console.error('Token is null');
      this.consent = 'Default consent content or an error message';
    }
  }

  async getApplicationData() {
    // try and get application data if it has any
    const token = await Preferences.get({ key: 'my-token' });
    if (token.value) {
      this.IndigentService.getApplicationResult(
        token.value,
        this.model.ID_Number
      )
        .then((response: BaseApplicationModel) => {
          this.populateModelWithApplication(response);

          this.clearToasts();
        })
        .catch((response) => {
          this.clearToasts();
        });
    } else {
      console.error('Token is null');
      this.consent = 'Default consent content or an error message';
    }
    this.validatePerson();
  }

  async SubmitApplication() {
    if (!this.validatedIDNumber) return;

    this.submitting = true;
    try {
      if (!this.validatedIDNumber) {
        await this.validateIDNumber();
      }

      if (!this.validatedPerson) {
        await this.validatePerson();
      }

      if (!this.validatedIDNumber || !this.validatedPerson) {
        this.showErrorToast(
          'Application validations failed. Please verify input and retry'
        );
        this.submitting = false;
        return;
      }

      this.showInfoToast('Application submitting');
      const token = await Preferences.get({ key: 'my-token' });
      if (token.value) {
        this.IndigentService.postApplication(token.value, this.model)
          .then((response: any) => {
            this.clearToasts();
            console.debug(response);
            if (response.result[0].Error) {
              this.showErrorToast(response.result[0].Error);
              this.submitting = false;
            } else {
              this.showSuccessToast('Application successfully submitted!');
              this.afterSubmit();
              this.submitting = false;
            }
          })
          .catch((error) => {
            this.showErrorToast(
              error +
                ' :Application was unsuccessfully submitted. Please contact support'
            );

            this.submitting = false;
          });
      } else {
        console.error('Token is null');
        this.consent = 'Default consent content or an error message';
      }
    } catch (e) {
      this.submitting = false;
    }
  }
  afterSubmit() {
    //Capture biometrics here
    this.router.navigate(['/biometrics/' + this.model.ID_Number]);
  }

  validateCellPhone() {}

  cancel() {
    this.cellModal.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.ValidateOTP()) {
      this.cellModal.dismiss(this.name, 'confirm');
      this.showSuccessToast('Valid OTP');
    } else {
      // Handle invalid OTP case
      this.showErrorToast('Invalid OTP');
    }
  }

  public onConsentAccept() {
    this.modal.dismiss(this.name, 'confirm');
    this.ConsentValidated = true;
    this.validatePerson();
  }

  public onConsentDecline() {
    this.modal.dismiss(null, 'cancel');
    this.IdNumberValidated = false;
    this.ConsentValidated = false;
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  openModal() {
    this.sendSMS();
    this.cellModal.present();
  }

  async sendSMS() {
    const token = await Preferences.get({ key: 'my-token' });
    this.IndigentService.sendOtpSms(token.value, this.model.Cell);
  }
  otp: string;
  ValidateOTP(): boolean {
    const storedOtp = sessionStorage.getItem('CELL_OTP');
    return this.otp === storedOtp;
  }
}
