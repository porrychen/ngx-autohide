import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxConfirmationDialogComponent } from './dialogs/ngx-confirmation.dialog.component';

@Injectable({
  providedIn: 'root'
})
export class NgxConfirmationService {

  /**
   * constructor
   * @param dialog
   */
  constructor(
    private dialog: MatDialog
  ) { }

  /**
   * is Object or not
   * @param obj
   * @returns boolean
   */
   private isObject = (obj: any) => obj && typeof obj === 'object';

   /**
   * deep merge objects
   * @param objects
   * @returns object
   */
  private deepMerge(...objects: any[]): object {
    return objects.reduce((previousValue, currentValue) => {
      Object.keys(currentValue).forEach(key => {
        const prev = previousValue[key];
        const curr = currentValue[key];

        if (Array.isArray(prev) && Array.isArray(curr)) {
          previousValue[key] = prev.concat(...curr);
        } else if (this.isObject(prev) && this.isObject(curr)) {
          previousValue[key] = this.deepMerge(prev, curr);
        } else {
          previousValue[key] = curr;
        }
      });

      return previousValue;
    }, {});
  }

  /**
   * open a confirmation dialog
   * @param config
   * @returns MatDialogRef<ConfirmationDialogComponent>
   */
  open(config: NgxConfirmationConfig): MatDialogRef<NgxConfirmationDialogComponent> {
    const finalConfig: NgxConfirmationConfig = this.deepMerge(DEFAULT_CONFIRMATION_CONFIG, config);

    return this.dialog.open(NgxConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: finalConfig.disableClose ?? true,
      data: finalConfig,
      panelClass: 'confirmation-dialog-panel'
    });
  }

  alert(config: NgxConfirmationConfig): void {
    const finalConfig: NgxConfirmationConfig = this.deepMerge(DEFAULT_INFORMATION_CONFIG, config);

    this.dialog.open(NgxConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: finalConfig.disableClose ?? true,
      data: finalConfig,
      panelClass: 'confirmation-dialog-panel'
    });
  }
}

export interface NgxConfirmationConfig {
  title?: string;

  icon?: {
    name?: string;
    color?: 'primary' | 'accent' | 'warn' | 'basic';
  };

  message?: string;

  actions?: {
    confirm?: {
      label?: string;
      color?: 'primary' | 'accent' | 'warn';
    };
    cancel?: {
      label?: string;
    }
  }

  disableClose?: boolean;
}

export const DEFAULT_CONFIRMATION_CONFIG: NgxConfirmationConfig = {
  title: 'Confirm',
  icon: {
    name: 'offline_pin',
    color: 'warn'
  },
  message: 'Are you sure that you want to confirm this action?',
  actions: {
    confirm: {
      label: 'Confirm',
      color: 'warn'
    },
    cancel: {
      label: 'Cancel'
    }
  },
  disableClose: true
}

export const DEFAULT_INFORMATION_CONFIG: NgxConfirmationConfig = {
  title: 'Information',
  icon: {
    name: 'information',
    color: 'accent'
  },
  message: 'This is only information for you!',
  actions: {
    confirm: {
      label: 'OK',
      color: 'accent'
    }
  },
  disableClose: true
}
