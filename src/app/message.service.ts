import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

import { environment } from "./../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  socket;

  constructor(
    private http: HttpClient
  ) {
    let userId = localStorage.getItem('cuserid');
    console.log('------', userId);

   // this.socket = io.connect(`http://localhost:3531/?userId=${userId}`)
     this.socket = io.connect(`https://ss.stagingsdei.com:3531?userId=${userId}`)
    console.log("soke--", this.socket);

  }

  sendMessage(data) {
    this.socket.emit('sendMessage', data);
    console.log("mess--", data);
    console.log("data++++", data.receiver);
  }

  newMessageRecevied(){
    let observable = new Observable<any>(observer=>{
      this.socket.on('getMessage',(data)=>{
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });
    return observable;
  }

  getMessage(data): Observable<any> {
    console.log("getMessage--",data)
    const url = environment.api_url + 'message_history';
    return this.http.post(url, data);
  }

  /* onTyping() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('onTyping', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  joinRoom(data) {
    this.socket.emit('join', data);
  }

  newUserJoined() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('new user joined', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  leaveRoom(data) {
    this.socket.emit('leave', data);
  }*/
}