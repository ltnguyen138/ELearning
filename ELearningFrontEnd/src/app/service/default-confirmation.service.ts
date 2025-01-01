import { Injectable } from '@angular/core';
import {Confirmation, ConfirmationService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class DefaultConfirmationService {

    constructor( private confirmationService: ConfirmationService) { }

    confirm(options: any) {
        const defaultOptions: Confirmation = {
            header: 'Xác nhận',
            icon: 'fa-solid fa-triangle-exclamation text-active-btn',
            message: 'Are you sure that you want to proceed?',
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            accept: () => {

            },
            reject: () => {

            },
        };
        this.confirmationService.confirm(defaultOptions);
    }
}