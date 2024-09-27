import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import SignaturePad from 'signature_pad';

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

  constructor(private elementRef: ElementRef, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.init();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.init();
  }

  init() {
    const canvas: HTMLCanvasElement = this.signaturePadElement.nativeElement;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight - 300; // Adjust as needed
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    // Initialize the SignaturePad
    this.signaturePad = new SignaturePad(canvas);
    console.log('SignaturePad initialized');
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
    if (this.signaturePad) {
      console.log('Clearing signature pad');

      // Immediately clear the pad
      this.signaturePad.clear(); // Clear the signature pad

      // Force change detection
      this.cd.detectChanges();

      // Optionally, use requestAnimationFrame to ensure canvas updates
      requestAnimationFrame(() => {
        this.cd.detectChanges(); // Force update again
      });
    }
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // Remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }
}
