import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'socket-app';
  socketServer1="ws://localhost:3000";
  socketServer2="wss://socketsbay.com/wss/v2/1/demo/";

  message!:string;


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

    // const ws = new WebSocket("ws://localhost:9903");

    const ws = new WebSocket(this.socketServer2);

    ws.onopen = this.open;

    ws.onmessage = this.onmessage;

    ws.onclose = function(closeEvent){
      console.log(closeEvent);
    }




  }

  open(openEvent:any){
    console.log(openEvent)
  }

  onmessage(messageEvent:any){
    console.log(messageEvent);
      this.message = messageEvent.data;
  }

  close(closeEvent:any){
   console.log(closeEvent);
  }
}
