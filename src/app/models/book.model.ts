import { Topic } from "./topic.model";

// src/app/models/book.model.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  topic : Topic[];
}