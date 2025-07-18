import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssueComponent } from './book-issue';

describe('BookIssue', () => {
  let component: BookIssueComponent;
  let fixture: ComponentFixture<BookIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
