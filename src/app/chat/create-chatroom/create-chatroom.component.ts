import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute  } from "@angular/router";
import { AppService } from "./../../app.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SocketService } from './../../socket.service';

@Component({
  selector: 'app-create-chatroom',
  templateUrl: './create-chatroom.component.html',
  styleUrls: ['./create-chatroom.component.css']
})
export class CreateChatroomComponent implements OnInit {

  public allUser : any;
  public users : any;
  public userArray : any;
  public userId: any;
  public roomName:string;

  constructor(public router: Router, private location: Location, private _route: ActivatedRoute, private appService:AppService, private socketService:SocketService,private toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

    this.getAllUser();

   this.userId = this.appService.getUserInfoFromLocalstorage().userId;
   

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
    

    if(this.roomName){

      // filetered list 
      let checkedRoles = this.users.filter(x=>x.Checked === true);

      this.userArray = [];

      checkedRoles.map(cR => {

          this.userArray.push(cR.userId);

      })

      // create a obj
      let roomObject = {
        roomName: this.roomName,
        members: this.userArray,
        admin: this.userId
      }

    // calling createRoom function and passing roomObj
      this.socketService.CreateRoom(roomObject);
      
      this.toastr.success('Room created successfully');

      setTimeout(() => {

        this.router.navigate(['/chat']);

      }, 1000);
      
    }else{

      this.toastr.error('Plzz enter a Chatroom name')

    }
    }


    
  goBack () {
    this.location.back();
  }

}
