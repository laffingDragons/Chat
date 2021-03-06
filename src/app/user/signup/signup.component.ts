import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppService } from './../../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;

  public roomId: any;

  constructor(
    public appService: AppService,
    public router: Router,
    public _route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

    this.roomId = this._route.snapshot.queryParams["roomId"]; //code to capture Chat room if there, if they have been ivited via mail


  }

  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } // end goToSignIn

  public signupFunction: any = () => {

    if (!this.firstName) {
      this.toastr.warning('enter first name')


    } else if (!this.lastName) {
      this.toastr.warning('enter last name')

    } else if (!this.mobile) {
      this.toastr.warning('enter mobile')

    } else if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {
      this.toastr.warning('enter password')


    } else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
      }

      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {

          apiResponse.data.userDetails.roomId = this.roomId; // code to set roomId which is capture by query

          if (apiResponse.status === 200) {

            this.toastr.success('Signup successful');

            Cookie.set('authtoken', apiResponse.data.authToken);

            Cookie.set('receiverId', apiResponse.data.userDetails.userId);

            Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);

            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)


            setTimeout(() => {

              this.router.navigate(['/chat']);

            }, 2000);

          } else {

            this.toastr.error(apiResponse.message);

          }

        }, (err) => {

          this.toastr.error('some error occured');


        });

    } // end condition

  } // end signupFunction

}
