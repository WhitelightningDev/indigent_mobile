import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-fingetprint-scan',
  templateUrl: './fingetprint-scan.component.html',
  styleUrls: ['./fingetprint-scan.component.scss'],
})
export class FingetprintScanComponent implements OnInit {
  @ViewChild('canvas', { static: true }) signaturePadElement;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.init();
    this.clear();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.init();
  }

  init() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 300;
    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }
  }
  // public ngAfterViewInit(): void {
  //   this.signaturePad = new SignaturePad(
  //     this.signaturePadElement.nativeElement
  //   );
  //   this.signaturePad.clear();
  //   //this.signaturePad.penColor = 'rgb(56,128,255)';
  // }

  public save(): string {
    const img = this.signaturePad.toDataURL();
    return img;
    // this.base64ToGallery.base64ToGallery(img).then(
    //   res => console.log('Saved image to gallery ', res),
    //   err => console.log('Error saving image to gallery ', err)
    // );
  }

  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
    return false;
  }

  public clear() {
    this.signaturePad.clear();
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }
}
