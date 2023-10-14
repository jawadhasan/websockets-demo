import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'socket-app';
  messageToSend:string;
  messages: string[] = [];

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {

    //event wiring
    this.websocketService.connect();

    //subscribing to messages
    this.websocketService.messageReceived.subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  sendMessage(): void {
    console.log(this.messageToSend);
    this.websocketService.sendMessage(this.messageToSend);
  }

  ngOnDestroy(): void {
    this.websocketService.messageReceived.unsubscribe();
  }
}
