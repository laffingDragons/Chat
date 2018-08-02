import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute  } from "@angular/router";
import { AppService } from "./../../app.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SocketService } from './../../socket.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public roomId: string;
  public info: any;
  public allUser : any;
  public users : any;
  public userArray : any;
  public userId: any;
  public userName:string;
  public roomName:string;

  public invitation:string;
  public mail : string;

  constructor(public router: Router, private location: Location, private _route: ActivatedRoute, private appService:AppService, private socketService:SocketService,private toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
   }

  ngOnInit() {

    this.fetchInfoByRoomId();

    this.getAllUser();

    this.userId = this.appService.getUserInfoFromLocalstorage().userId;

    this.userName = this.appService.getUserInfoFromLocalstorage().firstName;

    this.invitation = `http://localhost:4200/login?roomId=${this.roomId}`;
    
  }

  // FEtching roomId form params and making api request for info
  public fetchInfoByRoomId = () => {

    this.roomId = this._route.snapshot.paramMap.get('roomId')

    this.appService.getSingleRoom(this.roomId).subscribe(
      data =>{
        this.info = data["data"];
        console.log(this.info);
        
      },
      error =>{
        console.log(error.errorMessage);
      },
     )

  }

  //get all the users 
  public getAllUser =  () => {
      
    this.appService.getAllUsers().subscribe(
      
      data => {
        
        this.allUser = data;

        this.users = this.allUser.data 
        this.users = this.users.filter(user => {
          return user.userId != this.userId
        })
      },
      error => {
        console.log("Some error occured", error.errorMessage);
      }
    )

  } 

  chatroomSubmit() {
    

    if(this.info.roomName){

      // filetered list 
      let checkedRoles = this.users.filter(x=>x.Checked === true);

      this.userArray = [];

      checkedRoles.map(cR => {

          this.userArray.push(cR.userId);

          this.info.members = Array.from(new Set(this.userArray))

      })


      console.log(this.info);
    
      
    }else{

      this.toastr.error('Plzz enter a Chatroom name')

    }
    }

    // Button to copy link to clipboard
    copyMessage(val: string){
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.toastr.success(`Invitation link copied Successfully to Clipboard`)
    }

    // send invitation mail
    sendInvitationMail(){

     if(this.mail){

      let mailObj ={
         roomName : this.info.roomName,
         email :this.mail,
         link : this.invitation,
         senderName : this.userName,
      }
      
      this.appService.inviteMail(mailObj).subscribe(

        data=>{

          let response = data['message'];

          this.toastr.success(response)
        }
      ),
      error => {
        console.log("Some error occured", error.errorMessage);
      }

     }else{

      this.toastr.error('Plzz enter a Email to invite')

     }

    }


    // set room as inactive
    setRoomAsInactive(){

      console.log('room :', this.roomId);
    }

  goBack () {
    this.location.back();
  }
}