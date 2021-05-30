import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomSnackbarService } from './custom-snackbar.service';


@Injectable({
  providedIn: 'root'
})
export class XhrErrorHandlerService implements ErrorHandler{

  constructor(
    private injector: Injector,
    private snackBar: CustomSnackbarService,
    private readonly zone: NgZone
  ) {}

  handleError(error: Error | HttpErrorResponse){
    if (error instanceof HttpErrorResponse) {
      for (var i = 0; i < error.error.length; i++) {
        this.zone.run(() => {
          const sb = this.snackBar.open(error.error[i], error.status + ' OK'
          // , {
          //   verticalPosition: 'bottom',
          //   horizontalPosition: 'center',
          //   duration: 3000,
          // }
          );
          // sb.onAction().subscribe(() => {
          //   sb.dismiss();
          // })
        });
      }
    }
    else{
      console.error(error);
    }
  }
}