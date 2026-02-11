import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule , FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  standalone:true
})
export class ChatComponent implements OnInit , OnDestroy{
  public currentMessageText: string = '';
  public chatMessages: ChatMessageInterface[] = [];
  public connectedSocketId: string = '';
  private activeSubscriptions: Subscription[] = [];

  constructor(private readonly socketService: SocketService) {}

  public ngOnInit(): void {
    const connectSubscription = this.socketService.onConnect().subscribe((socketId) => {
      this.connectedSocketId = socketId;
    });
    this.activeSubscriptions.push(connectSubscription);
    const messageSubscription = this.socketService.onGetMessage().subscribe((incomingMessage) => {
      this.chatMessages.push(incomingMessage);

    });
    this.activeSubscriptions.push(messageSubscription);
  }

  public sendMessage(): void {
    const trimmedText = this.currentMessageText.trim();
    if (!trimmedText) return;

    const payload = {
      text: trimmedText,
    };

    this.socketService.sendMessage(payload);
    this.currentMessageText = '';
  }

  public ngOnDestroy(): void {
    this.activeSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
