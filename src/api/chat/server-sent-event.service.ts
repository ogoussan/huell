import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import {Message} from "../../interfaces";

@Injectable()
export class SseService {
  private eventSources: Map<string, Subject<MessageEvent>> = new Map();

  public sendEvent(id: string, type: string, data: unknown): void {
    let eventSource = this.eventSources.get(id);

    if (!eventSource) {
      eventSource = new Subject<MessageEvent>();
      this.eventSources.set(id, eventSource);
    }

    const messageEvent: MessageEvent = {
      type: type,
      data: JSON.stringify(data),
    };

    eventSource.next(messageEvent);
  }

  public getEventSource(id: string): Observable<MessageEvent> {
    let eventSource = this.eventSources.get(id);

    if (!eventSource) {
      eventSource = new Subject<MessageEvent>();
      this.eventSources.set(id, eventSource);
    }

    return eventSource.asObservable();
  }
}
