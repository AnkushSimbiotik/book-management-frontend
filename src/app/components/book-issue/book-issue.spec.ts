import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssue } from './book-issue';

describe('BookIssue', () => {
  let component: BookIssue;
  let fixture: ComponentFixture<BookIssue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookIssue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookIssue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
