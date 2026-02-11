import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { Observable } from "rxjs";
import { ChatMessageInterface } from '../interfaces/chat-message.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: "root",
})
export class SocketService{
  private socket!: Socket;
  private readonly API_URL = environment.apiUrl;

  constructor() {
    this.init();
  }

  public init(): void{
    this.socket = io(this.API_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }

  public onConnect(): Observable<string> {
    return new Observable((subscriber) => {
      const connFunction = () => subscriber.next(this.socket.id ?? "");
      this.socket.on("connect", connFunction);

      return () => this.socket.off("connect", connFunction);
    });
  }

  public onGetMessage(): Observable<ChatMessageInterface> {
    return new Observable((subscriber) => {
      const getMessage = (msg: ChatMessageInterface) => subscriber.next(msg);
      this.socket.on("message", getMessage);
      return () => this.socket.off("message", getMessage);
    });
  }

  public sendMessage(message: ChatMessageInterface | string): void {
    this.socket.emit("sendMessage", message);
  }
}
