import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;
  public roomId: any;

  constructor(
    public appService: AppService,
    public router: Router,
    public _route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {

    this.toastr.setRootViewContainerRef(vcr);

  }

  ngOnInit() {

    this.roomId = this._route.snapshot.queryParams["roomId"]; //code to capture Chat room if there, if they have been ivited via mail

     let userInfo = this.appService.getUserInfoFromLocalstorage() // code to check wether user has already login .

    //code to redirect user to chat screen if they has been already verify
    //  if(userInfo.userId){

    //   this.router.navigate(['/chat']);

    //  }
    
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  public forgotPassword: any = () => {

    this.router.navigate(['/forgot-password']);

  } // end forgotpassword

  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')


    } else if (!this.password) {

      this.toastr.warning('enter password')


    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {
            console.log(apiResponse)

            apiResponse.data.userDetails.roomId = this.roomId; // code to set roomId which is capture by query

             Cookie.set('authtoken', apiResponse.data.authToken);
            
             Cookie.set('receiverId', apiResponse.data.userDetails.userId);
            
             Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
           
             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
            
             this.router.navigate(['/chat']);

          }else if(apiResponse.status === 404){

            this.toastr.error("Email or Password wrong");

          } else {

            this.toastr.error(apiResponse.message)

          }

        }, (err) => {
          
          this.toastr.error('some error occured')

        });

    } // end condition

  } // end signinFunction

  

  

}