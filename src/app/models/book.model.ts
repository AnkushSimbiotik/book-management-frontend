import { Topic } from "./topic.model";

// src/app/models/book.model.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  topic : string | string[];
}