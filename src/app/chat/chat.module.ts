import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { RouterModule, Routes } from '@angular/router';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { UserDetailsComponent } from '../shared/user-details/user-details.component';
import { RemoveSpecialCharPipe } from './../shared/pipe/remove-special-char.pipe';
import { ChatRouteGuardService } from './chat-route-guard.service';
import { CreateChatroomComponent } from './create-chatroom/create-chatroom.component';
import { AllChatroomComponent } from './all-chatroom/all-chatroom.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule.forRoot(),
    RouterModule.forChild([ 
      { path: 'chat', component: ChatBoxComponent, canActivate:[ChatRouteGuardService] },
      { path: 'create-chatroom', component: CreateChatroomComponent },
      { path: 'all-chatroom', component: AllChatroomComponent },
      { path: 'settings/:roomId', component: SettingsComponent },
    ]),
    SharedModule
  ],
  declarations: [ChatBoxComponent,  RemoveSpecialCharPipe, CreateChatroomComponent, AllChatroomComponent, SettingsComponent],
  providers:[ChatRouteGuardService]
})
export class ChatModule { }
