import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllChatroomComponent } from './all-chatroom.component';

describe('AllChatroomComponent', () => {
  let component: AllChatroomComponent;
  let fixture: ComponentFixture<AllChatroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllChatroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
