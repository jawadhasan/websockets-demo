import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { WebsocketService } from './websocket.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  map,
  merge,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'IOT Fleet';
  messageToSend: string;
  messages: any[] = [];

  websocketFeed$ = this.websocketService.messageReceived;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    //event wiring
    this.websocketService.connect();

    //subscribing to messages

    this.websocketService.messageReceived
      .pipe(map((item) => JSON.parse(item)))
      .subscribe((item) => {
        this.messages.push(item);
        //this.webSocketFeed$.next(d);
      });
  }
  sendMessage(): void {
    console.log(this.messageToSend);
    this.websocketService.sendMessage(this.messageToSend);
  }

  ngOnDestroy(): void {
    this.websocketService.messageReceived.unsubscribe();
  }

  testcode() {
    //2. combine data-stream with action-stream
    // combineds$ = combineLatest([
    //   this.webSocketFeed$,
    //   this.webSocketMsgs$,
    // ]).pipe(
    //   map(([feed,msgs])=>{
    //     console.log('feed',feed);
    //     console.log('msgs',msgs);
    //   }
    // ));
    //combined$ = merge(this.webSocketFeed$, this.webSocketMsgs$);
    //subscribing to messages
    // this.websocketService.messageReceived.subscribe((message: any) => {
    //   let d = JSON.parse(message);
    //   this.messages.push(d);
    //  // this.webSocketFeed$.next(d);
    // });
  }
}
