import { HttpErrorResponse } from '@angular/common/http';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { DimensionModel } from './models/dimension-model';
// import { DimensionModel } from 'src/app/core/models/dimension-model';

export class BaseIndigentPage {
  public showError(
    toastr: ToastrService,
    error: any,
    defaultTitle: string = 'Error',
    defaultMessage: string = 'There was an error processing. Please contact support',
    toastrOptions: any = null
  ): ActiveToast<any> {
    if (error instanceof HttpErrorResponse) {
      if (!(<HttpErrorResponse>error).error)
        return toastr.error(defaultMessage, defaultTitle, toastrOptions);
      else {
        var error = (<HttpErrorResponse>error).error;
        if (error.error) error = error.error;
        return toastr.error(error, defaultTitle, toastrOptions);
      }
    } else {
      return toastr.error(error, defaultTitle, toastrOptions);
    }
  }

  public stripImageEncoding(image: string): string {
    if (!image) return image;

    var list = image.split('base64,');
    var result = list[0];
    if (list.length > 1) result = list[1];

    return result;
  }

  public getEncodingType(fileData: string): any {
    var firstCHar = fileData.substring(0, 1);

    if (firstCHar === 'Q') {
      //BMP
      return 'bmp';
    } else if (firstCHar === 'i') {
      //PNG
      return 'png';
    } else if (firstCHar === '/') {
      //JPG
      return 'jpeg';
    } else if (firstCHar === 'R') {
      //GIF
      return 'gif';
    } else {
      return null;
    }
  }

  public addImageEncoding(image: string): string {
    if (!image) return image;

    var encodingType = this.getEncodingType(image);
    if (!encodingType) return 'data:application/pdf;base64,' + image;
    else return 'data:image/' + encodingType + ';base64,' + image;
  }

  public previewImage(element: any) {}

  public getImageDimensions(file): Promise<DimensionModel> {
    return new Promise<DimensionModel>(function (resolved, rejected) {
      var i = new Image();
      i.onload = function () {
        resolved(new DimensionModel(i.width, i.height));
      };
      i.src = file;
    });
  }
}
