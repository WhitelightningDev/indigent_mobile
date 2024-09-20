import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseIndigentPage } from 'src/app/basepage';
declare var $: any;

@Component({
  selector: 'app-application-images',
  templateUrl: './application-images.page.html',
  styleUrls: ['./application-images.page.scss'],
})
export class ApplicationImagesPage extends BaseIndigentPage {
  @ViewChild('imagePreviewModal') modalTemplate: TemplateRef<any>;
  selectedImage: any = null;
  selectedImageWidth: number;
  constructor(private modalService: NgbModal) {
    super();
  }
  @Input() Name: string;
  @Input() Image: string;
  @Input()
  public loading = true;

  @Input()
  public ID_Document = null;

  @Input()
  public Left_Thumb = null;

  @Input()
  public Right_Thumb = null;

  @Input()
  public Municipal_Account = null;

  @Input()
  public Payslip_Image = null;

  @Input()
  public SASSA_Card = null;

  @Input()
  public Selfie = null;
  selectImage(event) {
    this.getImageDimensions(event).then(async (response) => {
      this.selectedImageWidth = response.w;
      this.selectedImage = event;
      await this.modalService.open(this.modalTemplate).result;
      // $("#imagePreviewModal").modal('show');
    });
  }
}
