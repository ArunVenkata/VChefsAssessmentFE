import { Component, OnInit, inject } from '@angular/core';
import { MyModalService } from '../services/mymodal.service';
import { BaseComponent } from '../base-component';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { takeUntil } from 'rxjs';
import { MyModalComponentOptionsType } from './mymodal-option-types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NzSpinModule} from "ng-zorro-antd/spin"
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-mymodal',
  templateUrl: './mymodal.component.html',
  styleUrls: ['./mymodal.component.scss'],
  imports: [CommonModule, FormsModule, NzSpinModule, NzButtonModule],
  standalone: true
})
export class MyModalComponent extends BaseComponent implements OnInit {

  isModalLoading: boolean = false;

  modalOptions: MyModalComponentOptionsType = {};

  readonly nzModalData: {
    [key: string]: any
  } = inject(NZ_MODAL_DATA);
  readonly #modal = inject(NzModalRef);

  constructor(
    private myModalService: MyModalService,
  ) {
    super();
  }

  ngOnInit() {

    this.myModalService.getModalLoading().pipe(takeUntil(this.ngUnsubscribe$)).subscribe((loadingState: boolean) => {
      this.isModalLoading = loadingState;
    })
    
    this.modalOptions['primaryButtonText'] = this.nzModalData['primaryButtonText']
    
    this.myModalService.getMyModalComponentOptionsEvent().pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      (modalOptions: MyModalComponentOptionsType) => {
        this.modalOptions = { ...this.modalOptions, ...modalOptions }
      }
    )

    this.myModalService.getCloseModalEvent().pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data?: any) => {
      this.#modal.close(data);
    })
  }

  onCloseClick() {
    this.#modal.destroy();
  }

  onSecondaryBtnClick() {
    this.#modal.destroy();
  }
  onPrimaryBtnClick() {
    this.myModalService.clickPrimaryBtn();
  }





}
