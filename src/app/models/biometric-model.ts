export enum ImageTypeEnum {
  Left_Thumb = 1,
  Right_Thumb = 2,
  ID_Document = 3,
  Selfie = 4,
  Municipal_Account = 5,
  Payslip_Image = 6,
  SASSA_Card = 7,
  Left_Thumb_WSQ = 8,
  Right_Thumb_WSQ = 9,
}

export class BiometricModel {
  ID: string;
  ImageTypeID: ImageTypeEnum;
  ImageName: string;
  ImageModelField: string;
  Required: boolean;

  constructor(
    id: string,
    imageTypeID: ImageTypeEnum,
    imageName: string,
    imageModelField: string,
    required: boolean = true
  ) {
    this.ID = id;
    this.ImageTypeID = imageTypeID;
    this.ImageName = imageName;
    this.ImageModelField = imageModelField;
    this.Required = required;
  }
}

export class BiometricsModel {
  LeftThumb: string;
  RightThumb: string;
  LeftThumbEncoded: string;
  RightThumbEncoded: string;
  IdDocument: string;
  Selfie: string;
  MunicipalAccount: string;
  Payslip: string;
  SASSACard: string;
}
