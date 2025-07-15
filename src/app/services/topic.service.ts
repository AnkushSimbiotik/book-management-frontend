// src/app/services/topic.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private readonly STORAGE_KEY = 'library_topics'; // Changed to avoid conflict with books

  private initialTopics: Topic[] = [
    { id: 1, genre: 'Fiction', description: 'Fictional literature' },
    { id: 2, genre: 'Non-Fiction', description: 'Non-fictional literature' },
    { id: 3, genre: 'Science', description: 'Scientific literature' },
  ];

  constructor(private http: HttpClient) {
    // Initialize localStorage with initialTopics if empty
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialTopics));
    }
  }

  private getTopicsFromStorage(): Topic[] {
    const topicJson = localStorage.getItem(this.STORAGE_KEY);
    return topicJson ? JSON.parse(topicJson) : [];
  }

  private saveTopicsToStorage(topics: Topic[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(topics));
  }

  getTopics(): Observable<Topic[]> {
    return of(this.getTopicsFromStorage());
  }

  getTopic(id: number): Observable<Topic> {
    const topic = this.getTopicsFromStorage().find(topic => topic.id === id);
    return of(topic!); // Assume topic exists; handle undefined in real app
  }

  createTopic(topic: Topic): Observable<Topic> {
    const topics = this.getTopicsFromStorage();
    topic.id = topics.length > 0 ? Math.max(...topics.map(t => t.id)) + 1 : 1;
    topics.push(topic);
    this.saveTopicsToStorage(topics);
    return of(topic);
  }

  deleteTopic(id: number): Observable<void> {
    const topics = this.getTopicsFromStorage().filter(topic => topic.id !== id);
    this.saveTopicsToStorage(topics);
    return of(void 0);
  }
}