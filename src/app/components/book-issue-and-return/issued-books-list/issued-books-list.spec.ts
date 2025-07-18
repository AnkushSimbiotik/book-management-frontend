import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedBooksList } from './issued-books-list';

describe('IssuedBooksList', () => {
  let component: IssuedBooksList;
  let fixture: ComponentFixture<IssuedBooksList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedBooksList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedBooksList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
