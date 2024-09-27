import { Component, Input, OnDestroy, OnInit, Pipe } from '@angular/core';
import { ExistingIndigentService } from '../../../../src/app/services/existing-indigent.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { BaseApplicationModel } from './models/base-application-model';
import { ImageTypeEnum } from '../existing-indigent/models/image-type-enum';
import { HttpClient } from '@angular/common/http';
import { LoadingController, Platform } from '@ionic/angular';
import { BaseComponent } from 'src/app/services/base-components';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-existing-indigent',
  templateUrl: './existing-indigent.page.html',
  styleUrls: ['./existing-indigent.page.scss'],
})
export class ExistingIndigentPage
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private backButtonSubscription: Subscription;
  @Input()
  public loading = true;

  @Input()
  public ID_Document = null;

  @Input()
  public Initial_Signature = null;

  @Input()
  public Full_Signature = null;

  @Input()
  public Municipal_Account = null;

  @Input()
  public Payslip_Image = null;

  @Input()
  public SASSA_Card = null;

  @Input()
  public Selfie = null;

  @Pipe({
    name: 'splitLines',
  })
  finalScore: any;
  approved: string = 'Yes';
  validatedIDNumber: boolean = false;
  validatedPerson: boolean = false;
  submitting: boolean = false;
  IdNumberValidated: boolean = false;
  ID_Number: string = '';
  public placeholderImage: string = 'assets/gallery.png'; // Define a default placeholder image

  isModalOpen = false;
  model: BaseApplicationModel = {
    Application_Reference: '',
    ID_Issue_Date: '',
    Approved: '',
    Reason: '',
    Age_Bracket: '',
    Consumer_ID: '',
    Person_names: '',
    Surname: '',
    Gender: '',
    DOB: '',
    Receive_Sassa: '',
    Pay_UIF: '',
    Director_Of_Companies: '',
    Is_Home_Owner: '',
    Estimated_Income: '',
    Current_Bond_Amount: '',
    Cell_1: '',
    Email_1: '',
    Physical_Address_1: '',
    Physical_Address_2: '',
    Physical_Address_3: '',
    Physical_Cade: '',
    Known_Car: '',
    Household_Income: '',
    Occupation: '',
    Know_Bank_Account: '',
    Property_Count: '',
    Sassa_Status: '',
    Initial_Signature: '',
    ID_Document: '',
    Selfie: '',
    Captured_By: '',
    ID_Number: '',
    Full_Signature: '',
    Municipal_Account: '',
    Payslip_Image: '',
    SASSA_Card: '',
    Appeal: '',
    Dependents: '',
    Village: '',
    Employed_At: '',
    Employed: '',
    Ward: '',
    Appeal_Outcome: '',
    Appeal_Reason: '',
    Appeal_Reason_User: '',
    Override: '',
    Override_Reason: '',
    Appeal_Outcome_User: '',
    Remarks: '',
    Reason_Code: '',
    Municipal_Account_Number: '',
    Municipal_Account_2: '',
    Appeal_Date: '',
    Expiry: '',
    Over_Ride_Date: '',
    Over_Ride_Reason: '',
    Over_Ride_User: '',
    Reason_Code_1: '',
    Salary: 0,
    Benefit: '',
  };
  applicationData: any;
  API_KEY: string;
  credentials: FormGroup;
  initialSignatureImage: string[] = [];
  fullSignatureImage: string[] = [];
  idDocumentImages: string[] = [];
  municipalAccountImages: string[] = [];
  payslipImages: string[] = [];
  sassaCardImages: string[] = [];
  selfieImages: string[] = [];
  loadingImages: boolean = true;

  constructor(
    private existingIndigent: ExistingIndigentService,
    private http: HttpClient,
    private router: Router,
    private loadingCtrl: LoadingController,
    private platform: Platform, // Inject Platform to handle hardware back button
    private location: Location // Inject Location service to handle browser-like back navigation
  ) {
    super();
  }

  loaded: boolean = false;
  psw = '';
  uname = '';
  apiKey: string = '';
  ngOnInit(): void {
    this.IdNumberValidated = false;
    this.initializeBackButtonCustomHandler();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  ExtractedScore: number = 0;
  ExtractScore(reason_code: string): number {
    if (!reason_code) return null;
    const match = reason_code.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }
  captureDate: string;
  async validateIDNumber(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      spinner: 'circles',
    });

    loading.present();

    const token = await Preferences.get({ key: 'my-token' });
    if (!token.value) {
      return;
    }
    try {
      this.loading = true;
      this.model = await this.existingIndigent.getApplicationResult(
        token.value,
        this.ID_Number
      );
      if (this.model && this.model.ID_Number) {
        this.IdNumberValidated = true;
        this.approved = this.model.Approved;
        this.ExtractScore(this.model.Reason_Code);
        this.captureDate = this.extractCaptureDate(this.model.Reason);
        await this.fetchImages();
      } else {
        this.showErrorToast('No data found for the provided ID number');
      }
    } catch (error) {
      this.ID_Number = '';
    } finally {
      loading.dismiss();
      this.loading = false;
    }
  }

  extractCaptureDate(reason: string): string {
    if (!reason) return null;
    const match = reason.match(/\|Capture or Edit Date (\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  }

  async fetchImages(): Promise<void> {
    const token = await Preferences.get({ key: 'my-token' });
    if (!token.value) {
      console.error('API key is missing');
      return;
    }

    const imageTypes = [
      ImageTypeEnum.Initial_Signature,
      ImageTypeEnum.Full_Signature,
      ImageTypeEnum.ID_Document,
      ImageTypeEnum.Selfie,
      ImageTypeEnum.Municipal_Account,
      ImageTypeEnum.Payslip_Image,
      ImageTypeEnum.Sassa_Card,
    ];

    this.initialSignatureImage = [];
    this.fullSignatureImage = [];
    this.idDocumentImages = [];
    this.selfieImages = [];
    this.municipalAccountImages = [];
    this.payslipImages = [];
    this.sassaCardImages = [];

    this.loadingImages = true; // Set loadingImages to true before starting fetch

    for (const type of imageTypes) {
      const url = `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Get_Ind_Images/${token.value}/${this.ID_Number}/IND/${type}`;
      try {
        const response: any = await this.http
          .get<any>(url, { responseType: 'json' })
          .toPromise();

        if (response.result && response.result.length > 0) {
          const result = response.result[0];
          if (result && result.length > 0) {
            const imageData = result[0];
            let initialSig: string;
            let FullSig: string;
            let idDoc: string;
            let selfie: string;
            let municpalAcc: string;
            let payslip: string;
            let sassa: string;

            if (typeof imageData === 'object' && imageData !== null) {
              // Handle imageData as an object
              initialSig = imageData.Left_Tumb
                ? `data:image/png;base64,${imageData.Left_Tumb}`
                : `data:image/png;base64,${imageData.toString()}`;
              FullSig = imageData.Right_Tumb
                ? `data:image/png;base64,${imageData.Right_Tumb}`
                : `data:image/png;base64,${imageData.toString()}`;
              idDoc = imageData.ID_Document
                ? `data:image/png;base64,${imageData.ID_Document}`
                : `data:image/png;base64,${imageData.toString()}`;
              selfie = imageData.Selfie
                ? `data:image/png;base64,${imageData.Selfie}`
                : `data:image/png;base64,${imageData.toString()}`;
              municpalAcc = imageData.Municipal_Account
                ? `data:image/png;base64,${imageData.Municipal_Account}`
                : `data:image/png;base64,${imageData.toString()}`;
              payslip = imageData.Payslip_Image
                ? `data:image/png;base64,${imageData.Payslip_Image}`
                : `data:image/png;base64,${imageData.toString()}`;
              sassa = imageData.Sassa_Card
                ? `data:image/png;base64,${imageData.Sassa_Card}`
                : `data:image/png;base64,${imageData.toString()}`;
            } else if (typeof imageData === 'string') {
              // Handle imageData as a base64 string
              initialSig = `data:image/png;base64,${imageData}`;
            } else {
              throw new Error('Unexpected image data format');
            }

            // Store the base64 image in the appropriate array
            switch (type) {
              case ImageTypeEnum.Initial_Signature:
                this.initialSignatureImage.push(initialSig);
                break;
              case ImageTypeEnum.Full_Signature:
                this.fullSignatureImage.push(FullSig);
                break;
              case ImageTypeEnum.ID_Document:
                this.idDocumentImages.push(idDoc);
                break;
              case ImageTypeEnum.Selfie:
                this.selfieImages.push(selfie);
                break;
              case ImageTypeEnum.Municipal_Account:
                this.municipalAccountImages.push(municpalAcc);
                break;
              case ImageTypeEnum.Payslip_Image:
                this.payslipImages.push(payslip);
                break;
              case ImageTypeEnum.Sassa_Card:
                this.sassaCardImages.push(sassa);
                break;
              default:
                console.warn(`Unhandled image type: ${type}`);
            }
          } else {
            console.warn('No image data found in result array');
          }
        } else {
          console.warn('No result array found');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    this.loadingImages = false; // Set loadingImages to false after all images are fetched
  }

  splitLines(value: string): string {
    if (!value) {
      return value;
    }
    return value
      .replace(/\r/g, '')
      .split('|')
      .map((line) => line.trim()) // Trim whitespace from each line
      .filter((line) => line.length > 0) // Remove empty lines
      .join('<br/>');
  }

  // Initialize back button handling
  initializeBackButtonCustomHandler() {
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.handleBackButton();
      });
  }

  handleBackButton() {
    // Check if there is a previous navigation in history
    if (this.router.url === '/home' || this.router.url === '/') {
      // Already on the home page, maybe show a confirmation to exit or do nothing
    } else if (this.router.navigated) {
      // If the user navigated, go back to the previous page
      this.location.back();
    } else {
      // No navigation history, so navigate to the home or login page
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  navigateToLogin() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  onImageError(event: any) {
    event.target.src = this.placeholderImage; // Set placeholder image if the original fails
  }
}
