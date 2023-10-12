import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const URL = 'ws://10.10.10.1:9003';

export interface Message {
  source: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private subject: AnonymousSubject<MessageEvent> | undefined ;
  public messages: Subject<Message>;

  constructor() {
    this.messages = <Subject<Message>>this.connect(URL).pipe(
      map(
        (response: MessageEvent): Message => {
          //console.log('websocket:',response.data);
          let data = JSON.parse(response.data)
          return data;
        }
      )
    );
  }

  get status$() {
    return this.messages.asObservable();
  }

  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("websocket: Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      //@ts-ignore
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        console.log('websocket: Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
//@ts-ignore
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}

