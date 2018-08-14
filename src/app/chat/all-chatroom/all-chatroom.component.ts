import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { AppService } from "./../../app.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SocketService } from './../../socket.service';

@Component({
  selector: 'app-all-chatroom',
  templateUrl: './all-chatroom.component.html',
  styleUrls: ['./all-chatroom.component.css']
})
export class AllChatroomComponent implements OnInit {

  public allRooms: any;
  public Rooms: any;
  public noOfMembers: number;
  public userId: string;

  constructor(public router: Router, private location: Location, private _route: ActivatedRoute, private appService: AppService, private socketService: SocketService, private toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

    this.getAllRooms();

  }

  public getAllRooms = () => {

    this.userId = this.appService.getUserInfoFromLocalstorage().userId;

    this.appService.getAllRooms().subscribe(

      data => {

        this.Rooms = data;

        this.allRooms = this.Rooms.data;

      }
    )

  }

  //request to join a chatroom 
  public requestToJoinChatroom = (roomId) => {

    this.appService.requestForJoiningChatroom(roomId, this.userId).subscribe((apiResponse) => {

      console.log(apiResponse)
      if (apiResponse.status === 200) {

        this.toastr.success(apiResponse.message)
        setTimeout(() => {

          this.router.navigate(['/chat']);

        }, 2000);
      } else {

        this.toastr.error(apiResponse.message)

      }

    }, (err) => {

      this.toastr.error('some error occured')

    });


  }

  goBack() {
    this.location.back();
  }

}
