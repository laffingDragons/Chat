import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    FormsModule,
    RouterModule.forChild([
      {path: 'sign-up', component: SignupComponent }
    ])
  ],
  declarations: [LoginComponent, SignupComponent]
})
export class UserModule { }
