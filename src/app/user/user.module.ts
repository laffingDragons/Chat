import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    FormsModule,
    RouterModule.forChild([
      {path: 'sign-up', component: SignupComponent },
      {path: 'forgot-password', component: ForgotPasswordComponent },
      {path:'change-password/:userId', component: ChangePasswordComponent }
    ])
  ],
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ChangePasswordComponent]
})
export class UserModule { }
