import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomSnackbarService {
    constructor(
      private snackBar: MatSnackBar,
      private zone: NgZone
    ) {
       
    }

    public open(message: string, action = 'success', duration = 4000): void {
        this.zone.run(() => {
          this.snackBar.open(message, action, {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            duration: duration,
            panelClass: [`snackbar-{action}`]
          });
        });
    }

    public notify(message: string, action = 'success', duration = 4000): void {
        this.zone.run(() => {
          this.snackBar.open(message, action, {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            duration: duration
          });
        });
    }
}