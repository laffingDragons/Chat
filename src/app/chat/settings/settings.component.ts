import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { AppService } from "./../../app.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SocketService } from './../../socket.service';
import { filter } from '../../../../node_modules/rxjs/operator/filter';
import { Cookie } from 'ng2-cookies/ng2-cookies';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public roomId: string;
  public info: any;
  public allUser: any;
  public users: any;
  public userArray: any;
  public userId: any;
  public userName: string;
  public roomName: string;

  public invitation: string;
  public mail: string;

  public pop: boolean = false;
  public leavePop: boolean = false;

  constructor(public router: Router, private location: Location, private _route: ActivatedRoute, private appService: AppService, private socketService: SocketService, private toastr: ToastsManager, vcr: ViewContainerRef) {
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
      data => {
        this.info = data["data"];

      },
      error => {
        console.log(error.errorMessage);
      },
    )

  }

  //get all the users 
  public getAllUser = () => {

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


    if (this.info.roomName) {

      // filetered list 
      let checkedRoles = this.users.filter(x => x.Checked === true);

      this.userArray = [];

      checkedRoles.map(cR => {

        // Getting all the checked value
        this.userArray.push(cR.userId);

        // pushing unique value in info.members array
        this.info.members = Array.from(new Set(this.userArray))

      })

      // informaing the chatroom that user has joined chatroom
      this.userArray.map(x => {
        for (let user of this.users) {

          if (x === user.userId) {

            this.userActivityMessage(user.firstName, 'join the room')

          }
        }
      }
      )

      // checking for users who have requestes and if they are checked in select member then remove them from requested
      for (let x of this.info.members) {
        for (let y of this.info.requested) {
          if (x === y) {

            this.info.requested.splice(this.info.requested.indexOf(x), 1);

          }
        }
      }

      console.log(this.info);

      this.appService.editRoom(this.info).subscribe(
        data => {
          let response = data['message'];

          this.toastr.success(response);

        }
      ),
        error => {

          console.log("Some error occured", error.errorMessage);

        }

      this.appService.addUserToRoom(this.info).subscribe(
        data => {
          let response = data['message'];

          this.toastr.success(response);

          setTimeout(() => {

            this.router.navigate(['/chat']);

          }, 2000);
        }
      ),
        error => {

          console.log("Some error occured", error.errorMessage);

        }

    } else {

      this.toastr.error('Plzz enter a Chatroom name')
    }


  }

  // Button to copy link to clipboard
  copyMessage(val: string) {
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
  sendInvitationMail() {

    if (this.mail) {

      let mailObj = {
        roomName: this.info.roomName,
        email: this.mail,
        link: this.invitation,
        senderName: this.userName,
      }

      this.appService.inviteMail(mailObj).subscribe(

        data => {

          let response = data['message'];

          this.toastr.success(response)
        }
      ),
        error => {
          console.log("Some error occured", error.errorMessage);
        }

    } else {

      this.toastr.error('Plzz enter a Email to invite')

    }

  }


  // Alert to delete the room
  DeletePop() {

    this.pop = true;

    setTimeout(() => {

      this.pop = false;

    }, 5000);


  }

  // set room as inactive
  setRoomAsInactive() {

    let roomObj = {
      roomId: this.roomId,
      active: false
    }

    this.appService.markAsInactive(roomObj).subscribe(
      data => {

        let response = data['message'];

        this.toastr.success(`Room set as Inactive`);

        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 1000);
      }
    ),
      error => {

        console.log("Some error occured", error.errorMessage);

      }

  }

  setAsActive() {


    let roomObj = {
      roomId: this.roomId,
      active: true
    }

    this.appService.markAsInactive(roomObj).subscribe(
      data => {

        let response = data['message'];

        this.toastr.success(`Room set as Active`);

        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 1000);
      }
    ),
      error => {

        console.log("Some error occured", error.errorMessage);

      }

  }

  // leave room popup
  leaveRoomPop() {
    this.leavePop = true;

    setTimeout(() => {

      this.leavePop = false;

    }, 5000);

  }

  //leave room function
  leaveRoom() {


    let roomObj = {
      roomId: this.roomId,
      members: this.userId
    }

    let firstname = this.appService.getUserInfoFromLocalstorage().firstName;

    this.userActivityMessage(firstname, 'left the Room');

    this.appService.removeUser(roomObj).subscribe(
      data => {

        let response = data['message'];

        this.toastr.success(response);

        setTimeout(() => {

          this.router.navigate(['/chat']);

        }, 2000);
      }
    ),
      error => {

        console.log("Some error occured", error.errorMessage);

      }
  }

  public userActivityMessage: any = (userName, message) => {

    let chatMsgObject = {

      chatRoom: this.roomId,
      message: `${userName} ${message}`,
      createdOn: new Date()

    } // end chatMsgObject

    this.socketService.SendChatroomMessage(chatMsgObject)

  }

  goBack() {
    this.location.back();
  }
}
