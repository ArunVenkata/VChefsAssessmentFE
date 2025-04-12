import { EventEmitter, Injectable, Type } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { MyModalComponent } from '../mymodal/mymodal.component';
import { MyModalComponentOptionsType } from '../mymodal/mymodal-option-types';

type ModalParamsType = { 
  contentComponent: Type<any>, 
  modalTitle: string, 
  primaryButtonText: string,
  secondaryButtonText?: string,
  componentInputParams?: any
};



@Injectable({
  providedIn: 'root'
})
export class MyModalService {

  private isModalLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private primaryButtonClickedEvent: EventEmitter<boolean> = new EventEmitter(); 
  private secondaryButtonClickedEvent: EventEmitter<boolean> = new EventEmitter(); 
  private closeModalEvent: EventEmitter<any> = new EventEmitter(); 
  private myModalOptionsChangeEvent: EventEmitter<MyModalComponentOptionsType> = new EventEmitter();
  // private readonly _modal = inject(NzModalRef);

  constructor(private nzModalService: NzModalService) { }

  createModal({ contentComponent, modalTitle, primaryButtonText, secondaryButtonText, componentInputParams }: ModalParamsType) {
    return this.nzModalService.create({
      nzTitle: undefined,
      nzContent: MyModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzData: {
        modalTitle,
        contentComponent,
        primaryButtonText,
        secondaryButtonText,
        componentInputParams: componentInputParams || {}
      }
    })
  }

  getModalLoading(){
    return this.isModalLoading.asObservable();
  }
  setModalLoading(loadingState: boolean){
    this.isModalLoading.next(loadingState);
  }

  getPrimaryBtnClickEvent(){
    return this.primaryButtonClickedEvent.asObservable();
  }
  
  clickPrimaryBtn(){
    this.primaryButtonClickedEvent.next(true);
  }


  getSecondaryBtnClickEvent(){
    return this.secondaryButtonClickedEvent.asObservable();
  }
  

  getMyModalComponentOptionsEvent(){
    return this.myModalOptionsChangeEvent.asObservable();
  }

  setMyModalComponentOptions(modalOptions: MyModalComponentOptionsType){
    this.myModalOptionsChangeEvent.next(modalOptions);
  }

  getCloseModalEvent(){
    return this.closeModalEvent.asObservable();
  }


  closeModal(data?: any){
    this.closeModalEvent.next(data);
  }
}
