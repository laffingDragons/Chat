import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from './../../socket.service';
import { AppService } from './../../app.service';

import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FirstCharComponent } from '../../shared/first-char/first-char.component';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})

export class ChatBoxComponent implements OnInit{

  @ViewChild('scrollMe', { read: ElementRef }) 
  
  public scrollMe: ElementRef;

  public authToken: any;
  public userInfo: any;
  public userList: any = [];
  public disconnectedSocket: boolean;  

  public scrollToChatTop:boolean= false;

  public receiverId: any;
  public receiverName: any;
  public previousChatList: any = [];
  public messageText: any; 
  public messageList: any = []; // stores the current message list display in chat box
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;

  //for chatroom
  public userId: any;
  public Rooms: any;
  public allRooms:any;
  public roomName: any;
  public roomInfo: any;
  public roomId: any;
  public gearIcon: boolean = false;

  constructor(
    public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }



  ngOnInit() {

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();

    this.receiverId = Cookie.get("receiverId");

    this.receiverName =  Cookie.get('receiverName');

    console.log(this.receiverId,this.receiverName)

    if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!=''){
      this.userSelectedToChat(this.receiverId,this.receiverName)
    }

    this.checkStatus();

    this.verifyUserConfirmation();

    this.getOnlineUserList();

    this.getMessageFromAUser();

    this.getMessageFromARoom();

    this.getAllRooms();

    this.checkForInvite();

    }


  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus



  public verifyUserConfirmation: any = () => {

    this.SocketService.verifyUser()
      .subscribe((data) => {

        this.disconnectedSocket = false;

        this.SocketService.setUser(this.authToken);

      });
    }
  
  public getOnlineUserList :any =()=>{
    
    this.SocketService.onlineUserList()
    .subscribe((userList) => {

        this.userList = [];

        for (let x in userList) {

          let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };

          this.userList.push(temp);          

        }
        
        console.log('UserList =>',this.userList);

      }); // end online-user-list
     
  }

  // chat related methods 


  public getPreviousChatWithAUser :any = ()=>{
    let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
    
    this.SocketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10)
    .subscribe((apiResponse) => {

      console.log(apiResponse);

      if (apiResponse.status == 200) {

        this.messageList = apiResponse.data.concat(previousData);

      } else {

        this.messageList = previousData;
        this.toastr.warning('No Messages available')
      }

      this.loadingPreviousChat = false;

    }, (err) => {

      this.toastr.error('some error occured')


    });

  }// end get previous chat with any user


  public loadEarlierPageOfChat: any = () => {

    this.loadingPreviousChat = true;

    this.pageValue++;
    this.scrollToChatTop = true;

    this.getPreviousChatWithAUser() 

  } // end loadPreviousChat

  public userSelectedToChat: any = (id, name) => {

    this.gearIcon = false;

    console.log("setting user as active") 

    // setting that user to chatting true   
    this.userList.map((user)=>{
        if(user.userId==id){
          user.chatting=true;
        }
        else{
          user.chatting = false;
        }
    })

    Cookie.set('receiverId', id);

    Cookie.set('receiverName', name);


    this.receiverName = name;

    this.receiverId = id;

    this.messageList = [];

    this.pageValue = 0;

    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    }


    this.SocketService.markChatAsSeen(chatDetails);

    this.getPreviousChatWithAUser();

  } // end userBtnClick function



  public sendMessageUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.sendMessage();

    }

  } // end sendMessageUsingKeypress

  public sendMessage: any = () => {

    if(this.gearIcon){

      if(this.messageText){
  
        let chatMsgObject = {
          senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
          senderId: this.userInfo.userId,
          chatRoom: Cookie.get('roomId'),
          message: this.messageText,
          createdOn: new Date()
        } // end chatMsgObject
        console.log(chatMsgObject);
        this.SocketService.SendChatroomMessage(chatMsgObject)
        this.pushToChatWindow(chatMsgObject)
  
      }
      else{
        this.toastr.warning('text message can not be empty')
      }

    }else{

      if(this.messageText){
  
        let chatMsgObject = {
          senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
          senderId: this.userInfo.userId,
          receiverName: Cookie.get('receiverName'),
          receiverId: Cookie.get('receiverId'),
          message: this.messageText,
          createdOn: new Date()
        } // end chatMsgObject
        console.log(chatMsgObject);
        this.SocketService.SendChatMessage(chatMsgObject)
        this.pushToChatWindow(chatMsgObject)
        
  
      }
      else{
        this.toastr.warning('text message can not be empty')
  
      }

    }


  } // end sendMessage

  public pushToChatWindow : any =(data)=>{

    this.messageText="";
    this.messageList.push(data);
    this.scrollToChatTop = false;


  }// end push to chat window

  public getMessageFromAUser :any =()=>{
    
    this.SocketService.chatByUserId(this.userInfo.userId)
    .subscribe((data)=>{

        (this.receiverId==data.senderId)?this.messageList.push(data):'';

        this.toastr.success(`${data.senderName} says : ${data.message}`)

        this.scrollToChatTop=false;

      });//end subscribe

  }// end get message from a user 


//  get all chatrooms and find the user
public getAllRooms = () => {

  this.userId = this.AppService.getUserInfoFromLocalstorage().userId;

  this.AppService.getAllRooms().subscribe(

    data => {

      this.Rooms = data ;

      this.allRooms = this.Rooms.data;

    }
  )

}

//get previous chat of room
public getPreviousChatOfRoom :any = (id)=>{
  let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
  
  this.SocketService.getChatroomChat(id, this.pageValue * 10)
  .subscribe((apiResponse) => {

    console.log(apiResponse);

    if (apiResponse.status == 200) {

      this.messageList = apiResponse.data.concat(previousData);

    } else {

      this.messageList = previousData;
      this.toastr.warning('No Messages available')

    }

    this.loadingPreviousChat = false;

  }, (err) => {

    this.toastr.error('some error occured', err)


  });

}// end get previous chat with any user

public getMessageFromARoom :any =()=>{
  
  this.SocketService.chatByRoomId(this.roomId)
  .subscribe((data)=>{
    console.log('>>>>>>>', data);
    
    (this.roomId==data.chatRoom)?this.messageList.push(data):'';

    this.toastr.success(`${data.senderName} says : ${data.message}`)

    this.scrollToChatTop=false;

  });//end subscribe

}// end get message from a user 

//chatting in a group
public roomSelectedToChat: any = (id, name) => {

  this.gearIcon = true;

  Cookie.set('roomId', id);

  Cookie.set('roomName', name);

  this.receiverName = name;
  
  this.roomId = id;

  this.messageList = [];

  this.pageValue = 0;

  this.getPreviousChatOfRoom(id);

  this.SocketService.subscribeToRoom(id)
} // end userBtnClick function


checkForInvite(){
  if(this.userInfo.roomId){

    let roomObj ={
      roomId: this.userInfo.roomId,
      members: this.userInfo.userId
    }
    
    this.AppService.addUserToRoom(roomObj).subscribe(
      data => {
        let response = data['message'];

        this.toastr.success('You have been successfully added to the Room');

        let localStorageDetails= this.AppService.getUserInfoFromLocalstorage();

        localStorageDetails.roomId = '';
        
        this.AppService.setUserInfoInLocalStorage(localStorageDetails);

        this.getAllRooms();

      }
    ), (err) => {

    this.toastr.error('some error occured', err)

  }
  }
}


  public logout: any = () => {

    this.AppService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.delete('authtoken');

          Cookie.delete('receiverId');

          Cookie.delete('receiverName');

          this.SocketService.exitSocket()

          this.router.navigate(['/']);

        } else {
          this.toastr.error(apiResponse.message)

        } // end condition

      }, (err) => {
        this.toastr.error('some error occured')


      });

  } // end logout

  // handle the output from a child component 

  public showUserName =(name:string)=>{

    this.toastr.success("You are chatting with "+name)

  }


  }
