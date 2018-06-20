import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//routing module
import {RouterModule, Routes } from '@angular/router';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { LoginComponent } from './user/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SocketService } from './socket.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    NgbModule.forRoot(),
    ChatModule,
    HttpClientModule,
    UserModule,
    RouterModule.forRoot([
      {path:'login', component: LoginComponent, pathMatch: 'full'},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '*', component: LoginComponent},
      {path: '**', component: LoginComponent}
    ])
  ],
  providers: [AppService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
