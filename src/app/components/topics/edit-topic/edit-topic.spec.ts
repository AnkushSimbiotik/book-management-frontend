import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTopic } from './edit-topic';

describe('EditTopic', () => {
  let component: EditTopic;
  let fixture: ComponentFixture<EditTopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTopic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTopic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
