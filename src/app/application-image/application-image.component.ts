import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseIndigentPage } from '../basepage';

@Component({
  selector: 'app-application-image',
  templateUrl: './application-image.component.html',
  styleUrls: ['./application-image.component.scss'],
})
export class ApplicationImageComponent extends BaseIndigentPage {
  @Input()
  public Name;
  @Input()
  public Image: any = null;

  @Output()
  public selectImage: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  showImage(image: any) {
    this.selectImage.emit(image);
  }
}
