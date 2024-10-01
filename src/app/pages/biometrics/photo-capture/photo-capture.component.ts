/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Router, ActivatedRoute } from '@angular/router';
import { BiometricService } from 'src/app/services/biometric.service';
import {
  BiometricModel,
  BiometricsModel,
  ImageTypeEnum,
} from 'src/app/models/biometric-model';
import { Preferences } from '@capacitor/preferences';
import { FingetprintScanComponent } from '../fingetprint-scan/fingetprint-scan.component';
import { BaseComponent } from 'src/app/services/base-components';

@Component({
  selector: 'app-photo-capture',
  templateUrl: './photo-capture.component.html',
  styleUrls: ['./photo-capture.component.scss'],
})
export class PhotoCaptureComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public model: BiometricsModel = new BiometricsModel();
  public biometrics: Array<BiometricModel> = [];
  photo: string;
  descriptions: string[] = [
    'Please provide your initial signature',
    'Please provide your full signature',
    'Please take a photo of your ID.',
    'Please take a photo of yourself.',
    'Please take a photo of municipal account.',
    'Please take a photo of payslip.',
    'Please take a photo of SASSA card.',
  ];
  shortdesc: string[] = [
    'Initial_Signature',
    'Full_Signature',
    'ID_Document',
    'Selfie',
    'Municipal_Account',
    'Payslip_Image',
    'SASSA_Card',
  ];

  ImageDesc: string[] = [
    'Initial Signature',
    'Full Signature',
    'ID Document',
    'Selfie',
    'Municipal Account',
    'Payslip Image',
    'SASSA Card',
  ];
  protected idNumber: string;
  images: { src: string; description: string; shortDesc: string }[] = [];
  currentDescriptionIndex: number = 0;
  public loading: boolean = true;
  public canFinalize: boolean = false;
  public capturing: boolean = false;
  public showSignaturePad: boolean = false;

  @ViewChild(FingetprintScanComponent)
  fingerprintScan: FingetprintScanComponent;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private biometricService: BiometricService
  ) {
    super();
  }

  ngOnInit() {
    this.finalizeBtn = false;
    this.route.params.subscribe(async (params) => {
      this.idNumber = params['idnumber'];

      if (!this.idNumber) {
        this.showErrorToast('Invalid ID');
        this.router.navigate(['/home']);
        return;
      }

      this.loading = true;
      await this.loadImages();

      if (!this.images.some((image) => image.src)) {
        // Start capturing if no images are found
        this.startCaptureProcess();
      }
    });
    // this.startCamera();
  }

  ngOnDestroy() {}

  goBack() {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed') === 'true';

    if (!hasRefreshed) {
      sessionStorage.setItem('hasRefreshed', 'true'); // Set the flag to true
    }

    window.location.reload(); // Always reload the page on button click
  }

  onImageError(event: any) {
    event.target.src = 'assets/gallery.png';
  }

  async captureProcess() {
    try {
      if (this.currentDescriptionIndex < this.descriptions.length) {
        if (this.isSignatureRequired(this.currentDescriptionIndex)) {
          await this.captureSignature();
        } else {
          await this.captureCameraPhoto();
        }
      }
    } catch {
      this.showErrorToast(
        'An error has occurred please try again later or contact support'
      );
    }
  }

  private isSignatureRequired(index: number): boolean {
    return index === 0 || index === 1;
  }

  private async captureSignature() {
    this.showSignaturePad = true;
    this.capturing = true;

    const signatureImg = this.fingerprintScan.save();

    const signatureFileName = `Signature_${
      this.shortdesc[this.currentDescriptionIndex]
    }_${this.idNumber}.jpeg`;
    this.images[this.currentDescriptionIndex] = {
      src: signatureImg,
      description: this.descriptions[this.currentDescriptionIndex],
      shortDesc: this.shortdesc[this.currentDescriptionIndex],
    };
    await this.savePhotoLocally(signatureImg, signatureFileName);
    await this.uploadImage(
      signatureImg,
      this.shortdesc[this.currentDescriptionIndex]
    );

    if (this.currentDescriptionIndex === 1) {
      this.showSignaturePad = false;
    }
    this.fingerprintScan.clear();
    this.currentDescriptionIndex++;
  }

  public async captureCameraPhoto() {
    try {
      this.capturing = true;
      this.showSignaturePad = false;

      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera, // Use the device camera
      });

      this.photo = image.dataUrl;
      this.images[this.currentDescriptionIndex] = {
        src: this.photo,
        description: this.descriptions[this.currentDescriptionIndex],
        shortDesc: this.shortdesc[this.currentDescriptionIndex],
      };
      this.SaveButton = true;

      //this.capturing = false;
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  }

  private async uploadImage(photo: string, shortDesc: string) {
    const token = await Preferences.get({ key: 'my-token' });
    await this.biometricService.postImage(
      token.value,
      this.idNumber,
      this.getImageTypeFromDescription(shortDesc),
      photo
    );
  }

  SaveButton: boolean = false;
  async SavePhoto() {
    const fileName = `${this.descriptions[this.currentDescriptionIndex]}_${
      this.idNumber
    }.jpeg`;
    await this.savePhotoLocally(this.photo, fileName);
    await this.uploadImage(
      this.photo,
      this.shortdesc[this.currentDescriptionIndex]
    );
    this.photo = null;
    this.SaveButton = false;
    this.currentDescriptionIndex++;

    if (this.currentDescriptionIndex >= this.descriptions.length) {
      this.finalizeCaptureProcess();
    }
  }

  async skipPhoto() {
    this.currentDescriptionIndex++;
    if (this.currentDescriptionIndex < this.descriptions.length) {
      if (
        this.descriptions[this.currentDescriptionIndex] ===
          'Please provide your initial signature' ||
        this.descriptions[this.currentDescriptionIndex] ===
          'Please provide your full signature'
      ) {
        this.showSignaturePad = true;
        this.capturing = true;
      } else {
        this.showSignaturePad = false;
        // this.captureCameraPhoto();
      }
    } else if (this.currentDescriptionIndex >= this.descriptions.length) {
      //await CameraPreview.stop();
      this.finalizeCaptureProcess();
    }
  }

  finalizeBtn: boolean = false;
  async finalize() {
    this.loading = true;

    const token = await Preferences.get({ key: 'my-token' });
    return this.biometricService
      .finalizeApplication(token.value, this.idNumber)
      .then((response: any) => {
        console.debug(response);
        if (response.result[0].Error) {
          this.showErrorToast(response.result[0].error);
        } else {
          this.showSuccessToast(response.result[0].Success);
        }
        this.router.navigate(['/home']);
      })
      .catch((error: any) => {
        console.error(`Failed to load image for:`, error);
        return null;
      });
  }

  startCaptureProcess() {
    this.currentDescriptionIndex = 0;
    this.photo = null;

    if (
      this.descriptions[this.currentDescriptionIndex] ===
        'Please provide your initial signature' ||
      this.descriptions[this.currentDescriptionIndex] ===
        'Please provide your full signature'
    ) {
      this.showSignaturePad = true;
      this.capturing = true;
    }
  }

  finalizeCaptureProcess() {
    this.capturing = false;
    this.finalizeBtn = true;
    // Optionally, you can navigate to another page here or show a finalize button
  }

  getImageTypeFromDescription(description: string): ImageTypeEnum {
    switch (description) {
      case 'Initial_Signature':
        return ImageTypeEnum.Initial_Signature;
      case 'Full_Signature':
        return ImageTypeEnum.Full_Signature;
      case 'ID_Document':
        return ImageTypeEnum.ID_Document;
      case 'Selfie':
        return ImageTypeEnum.Selfie;
      case 'Municipal_Account':
        return ImageTypeEnum.Municipal_Account;
      case 'Payslip_Image':
        return ImageTypeEnum.Payslip_Image;
      case 'SASSA_Card':
        return ImageTypeEnum.SASSA_Card;
      default:
        return ImageTypeEnum.Selfie;
    }
  }

  private async savePhotoLocally(photo: string, fileName: string) {
    await Filesystem.writeFile({
      path: fileName,
      data: photo,
      directory: Directory.Data,
    });
  }

  async loadImages() {
    const imageTypes: ImageTypeEnum[] = [
      ImageTypeEnum.Initial_Signature,
      ImageTypeEnum.Full_Signature,
      ImageTypeEnum.ID_Document,
      ImageTypeEnum.Selfie,
      ImageTypeEnum.Municipal_Account,
      ImageTypeEnum.Payslip_Image,
      ImageTypeEnum.SASSA_Card,
    ];

    const imagePromises = imageTypes.map((type) => this.loadImage(type));
    const loadedImages = await Promise.all(imagePromises);

    this.images = loadedImages.map((src, index) => ({
      src: src ? src : null,
      description: this.descriptions[index],
      shortDesc: this.shortdesc[index],
    }));

    this.canFinalize = this.images.every((image) => !!image.src);
    this.capturing = !this.canFinalize;
    this.loading = false;
  }

  private async loadImage(imageType: ImageTypeEnum): Promise<string> {
    const token = await Preferences.get({ key: 'my-token' });
    return this.biometricService
      .getImage(token.value, this.idNumber, imageType)
      .then((response: any) => {
        const imageData = response;

        if (imageData) {
          return imageData || null;
        }
        return null;
      })
      .catch((error: any) => {
        console.error(`Failed to load image for ${imageType}:`, error);
        return null;
      });
  }
}
