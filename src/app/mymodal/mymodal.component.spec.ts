import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalComponent } from './mymodal.component';

describe('MymodalComponent', () => {
  let component: MyModalComponent;
  let fixture: ComponentFixture<MyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyModalComponent]
    });
    fixture = TestBed.createComponent(MyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
