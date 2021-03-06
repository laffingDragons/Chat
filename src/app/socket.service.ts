import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable()
export class SocketService {

  private url = 'http://192.168.2.105:3000';

  private socket;


  constructor(public http: HttpClient) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);

  }

  // events to be listened 

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser

  public onlineUserList = () => {
    
    return Observable.create((observer) => {

        
        this.socket.on("online-user-list", (userList) => {
          
          observer.next(userList);
  
        }); // end Socket

    }); // end Observable

  } // end onlineUserList

  //refresh online users
  public refresh = () => {

    this.socket.emit("refresh");
    console.log(`refresh at socket service hit`);
    
  }

  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); // end Socket

    }); // end Observable



  } // end disconnectSocket

  // end events to be listened

  // events to be emitted

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } // end setUser

  public markChatAsSeen = (userDetails) => {

    this.socket.emit('mark-chat-as-seen', userDetails);

  } // end markChatAsSeen



  // end events to be emitted

  // chat related methods 

  

  public getChat(senderId, receiverId, skip): Observable<any> {

    return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
      .do(data => console.log('Data Received'))
      .catch(this.handleError);

  } 

  public getChatroomChat( roomId, skip): Observable<any> {
    
    return this.http.get(`${this.url}/api/v1/chat/get/for/group?roomId=${roomId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
      .do(data => console.log('Data Received'))
      .catch(this.handleError);

  } 


  public chatByUserId = (userId) => {

    return Observable.create((observer) => {
      
      this.socket.on(userId, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end chatByUserId


  public chatByRoomId = (roomId) => {

    return Observable.create((observer) => {
      
      this.socket.on('room-msg', (data) => {
        
        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end chatByRoomId


  public SendChatMessage = (chatMsgObject) => {

    this.socket.emit('chat-msg', chatMsgObject);

  } // end getChatMessage

  public SendChatroomMessage = (chatMsgObject) => {

    this.socket.emit('chatroom-msg', chatMsgObject);

  } // end getChatMessage

  public CreateRoom = (roomObject) => {
   
    this.socket.emit('create-room', roomObject);

  } // end getChatMessage

  // subscribe to a room
  public subscribeToRoom = (roomId) => {

    this.socket.emit('subscribe-room', roomId);

  }

  // user typing event
  public typing = (userData) => {

    this.socket.emit('typing', userData);

  } 

  //reciving the typing event
  public typingUser = () => {

    return Observable.create((observer) => {
      
      this.socket.on('typing-user', (data) => {
        
        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end chatByRoomId

  public exitSocket = () =>{


    this.socket.disconnect();


  }// end exit socket


  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
