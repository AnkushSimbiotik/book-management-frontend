import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBooks } from './edit-books';

describe('EditBooks', () => {
  let component: EditBooks;
  let fixture: ComponentFixture<EditBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
