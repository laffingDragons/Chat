import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public userId: any;
  public pass1: any;
  public pass2: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private _route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {

    this.toastr.setRootViewContainerRef(vcr);

  }

  ngOnInit() {
  }

  public validation: any = () => {
    if (this.pass1 === this.pass2) {
        if(this.pass1.length > 6){

          return true;

        }else{

        this.toastr.error('Please make sure your password is more than 6 character')
          return false
        }
    }else{

      this.toastr.error('Please make sure you have enter same password in both feilds')

    }

  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp


  public changePasswordFunction: any = () => {

    if (this.validation()) {

      let captureId = this._route.snapshot.paramMap.get("userId");
      console.log('captureId :', captureId);
      let data = {
        userId: captureId,
        password: this.pass1
      }
      this.appService.changePasswordFunction(data)
      .subscribe((apiResponse) => {

        console.log(apiResponse)
        if (apiResponse.status === 200) {
          this.toastr.success(apiResponse.message) 
          setTimeout(() => {
            
             this.router.navigate(['/login']);

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