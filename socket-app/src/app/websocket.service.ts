import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: WebSocket;
  messageReceived: Subject<string> = new Subject<string>();

  socketServer1 = 'ws://localhost:8181';
  socketServer2 = 'wss://socketsbay.com/wss/v2/1/demo/'; //https://socketsbay.com/test-websockets

  constructor() {}

  connect(): void {
    this.socket = new WebSocket(this.socketServer2);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      console.log('Received message:', message);
      this.messageReceived.next(`RECEIVE: ${message}`);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: string): void {
    this.socket.send(message);
    this.messageReceived.next(`SEND: ${message}`);
  }

  closeConnection(): void {
    this.socket.close();
  }
}
