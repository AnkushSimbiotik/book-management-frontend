import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTopic } from './view-topic';

describe('ViewTopic', () => {
  let component: ViewTopic;
  let fixture: ComponentFixture<ViewTopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTopic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTopic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
