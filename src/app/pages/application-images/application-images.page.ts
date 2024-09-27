import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { Platform } from '@ionic/angular'; // Import Platform
import { Subscription } from 'rxjs'; // Import Subscription for back button

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseIndigentPage } from 'src/app/basepage';
declare var $: any;

@Component({
  selector: 'app-application-image',
  templateUrl: './application-images.page.html',
  styleUrls: ['./application-images.page.scss'],
})
export class ApplicationImagesPage
  extends BaseIndigentPage
  implements OnInit, OnDestroy
{
  @ViewChild('imagePreviewModal') modalTemplate: TemplateRef<any>;
  selectedImage: any = null;
  selectedImageWidth: number;
  private backButtonSubscription: Subscription;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private platform: Platform
  ) {
    super();
  }
  @Input() Name: string;
  @Input() Image: string;
  @Input()
  public placeholderImage: string = 'assets/gallery.png'; // Define the placeholder image
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
  selectImage(event) {
    this.getImageDimensions(event).then(async (response) => {
      this.selectedImageWidth = response.w;
      this.selectedImage = event;
      await this.modalService.open(this.modalTemplate).result;
      // $("#imagePreviewModal").modal('show');
    });
  }

  // Fallback to placeholder image if original image fails to load
  onImageError(event: any) {
    event.target.src = this.placeholderImage;
  }

  // Lifecycle hook to initialize back button handler
  ngOnInit(): void {
    this.initializeBackButtonCustomHandler();
  }

  // Subscribe to the back button event
  initializeBackButtonCustomHandler() {
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.handleBackButton(); // Call method to handle back button action
      });
  }

  // Handle the back button action
  handleBackButton() {
    // Navigate back to the previous page and refresh
    this.router.navigateByUrl(this.router.url).then(() => {
      window.location.reload(); // Refresh the current page after navigation
    });
  }

  // Unsubscribe from back button on component destruction to avoid memory leaks
  ngOnDestroy() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }
}
