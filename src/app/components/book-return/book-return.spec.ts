import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReturn } from './book-return';

describe('BookReturn', () => {
  let component: BookReturn;
  let fixture: ComponentFixture<BookReturn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookReturn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookReturn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
