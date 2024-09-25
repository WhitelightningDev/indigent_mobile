import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import SignaturePad from 'signature_pad'; // Make sure to import the SignaturePad library

@Component({
  selector: 'app-fingetprint-scan',
  templateUrl: './fingetprint-scan.component.html',
  styleUrls: ['./fingetprint-scan.component.scss'],
})
export class FingetprintScanComponent implements OnInit {
  @ViewChild('canvas', { static: true }) signaturePadElement: ElementRef;
  signaturePad: SignaturePad;
  canvasWidth: number;
  canvasHeight: number;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.init();
    this.clear();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.init(); // Reinitialize the canvas on window resize
  }

  init() {
    const canvas: HTMLCanvasElement = this.signaturePadElement.nativeElement;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight - 300; // Adjust this as needed
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    // Initialize the SignaturePad
    this.signaturePad = new SignaturePad(canvas);
    this.signaturePad.clear(); // Clear the pad on init
  }

  public save(): string {
    if (this.isCanvasBlank()) {
      console.warn('Cannot save an empty signature pad.');
      return '';
    }
    const img = this.signaturePad.toDataURL(); // Get the image data URL
    return img;
  }

  isCanvasBlank(): boolean {
    return this.signaturePad.isEmpty();
  }

  public clear() {
    this.signaturePad.clear(); // Clear the signature pad
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // Remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }
}
