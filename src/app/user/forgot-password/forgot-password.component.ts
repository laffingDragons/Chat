import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {

    this.toastr.setRootViewContainerRef(vcr);

  }

  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp


  public forgotPasswordFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')


    } else {

      let data = {
        email: this.email
      }
      this.appService.forgotPasswordFunction(data)
      .subscribe((apiResponse) => {

        console.log(apiResponse)
        if (apiResponse.status === 200) {
          this.toastr.error(apiResponse.message) 
          setTimeout(() => {
            
             this.router.navigate(['/']);

           }, 2000);

        } else {

          this.toastr.error(apiResponse.message)

        }

      }, (err) => {
        
        this.toastr.error('some error occured')

      });
    

    } 

  } 
}