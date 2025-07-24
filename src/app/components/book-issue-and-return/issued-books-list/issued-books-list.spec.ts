import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedBooksListComponent } from './issued-books-list';

describe('IssuedBooksList', () => {
  let component: IssuedBooksListComponent;
  let fixture: ComponentFixture<IssuedBooksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedBooksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedBooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
