import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";



@Injectable()
export class AppService {

  public url =  'http://192.168.2.105:3000';

  constructor(
    public http: HttpClient
  ) {

    

  } // end constructor  


  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  //get all users
  public getAllUsers(){
    
    let response = this.http.get(`${this.url}/api/v1/users/view/all?authToken=${Cookie.get('authtoken')}`);
    
    return response;

  }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);

  } // end of signinFunction function.

  
  public forgotPasswordFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)

    return this.http.post(`${this.url}/api/v1/users/forgot-password`, params);

  } // end of forgotPasswordFunction function.


  public changePasswordFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)
      .set('password', data.password);

    return this.http.put(`${this.url}/api/v1/users/change-password`, params);

  } // end of signinFunction function.


  public logout(data): Observable<any> {

    const params = new HttpParams() 

      .set('authToken', Cookie.get('authtoken'))
      .set('userId', data)

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

  } // end logout function

  //--------------------------------------end  of user managment ------------------------------//


  // Chatroom services
  
  //get all users
  public getAllRooms(){
    
    let response = this.http.get(`${this.url}/api/v1/room/all?authToken=${Cookie.get('authtoken')}`);
    
    return response;

  }

  // get single room details
  public getSingleRoom(id){
    
    let response = this.http.get(`${this.url}/api/v1/room/${id}/details?authToken=${Cookie.get('authtoken')}`);
    
    return response;

  }

  //REquest to join a chatroom
  public requestForJoiningChatroom(roomId, userId): Observable<any>{

    const params = new HttpParams()
      .set('requested', userId)
      
    return this.http.put(`${this.url}/api/v1/room/${roomId}/request`, params);

  }

  //send invitation mail
  public inviteMail(data): Observable<any> {

    const params = new HttpParams()
      .set('roomName', data.roomName)
      .set('email', data.email)
      .set('link', data.link)
      .set('senderName', data.senderName)
     

    return this.http.post(`${this.url}/api/v1/room/invite?authToken=${Cookie.get('authtoken')}`, params);

  } // end of signupFunction function.

  // mark chatroom as inactive
  public markAsInactive(data): Observable<any> {

    const params = new HttpParams()
      .set('active', data.active)

    return this.http.put(`${this.url}/api/v1/room/${data.roomId}/edit?authToken=${Cookie.get('authtoken')}`, params);

  } // end of setting room active function.

  //adding invited user to room
  public addUserToRoom(data): Observable<any> {

    const params = new HttpParams()
      .set('members', data.members)

    return this.http.put(`${this.url}/api/v1/room/${data.roomId}/addUserToRoom?authToken=${Cookie.get('authtoken')}`, params);

  }

  //removing user From room
  public removeUser(data): Observable<any> {

    const params = new HttpParams()
      .set('members', data.members)

    return this.http.put(`${this.url}/api/v1/room/${data.roomId}/removeUser?authToken=${Cookie.get('authtoken')}`, params);

  }

  //Removing user from request
  public removeUserFromRequested(data): Observable<any> {

    const params = new HttpParams()
      .set('requested', data.requested)

    return this.http.put(`${this.url}/api/v1/room/${data.roomId}/removeUserFromRequested?authToken=${Cookie.get('authtoken')}`, params);

  }
  
  // api call to edit the room
  public editRoom(data): Observable<any> {

    const params = new HttpParams()
      .set('members', data.members)
      .set('roomName', data.roomName)
      .set('requested', data.requested)
    
    return this.http.put(`${this.url}/api/v1/room/${data.roomId}/editRoomName?authToken=${Cookie.get('authtoken')}`, params);

  } // end of editting room function.

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
