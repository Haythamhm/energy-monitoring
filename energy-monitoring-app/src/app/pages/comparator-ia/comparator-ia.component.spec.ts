import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparatorIaComponent } from './comparator-ia.component';

describe('ComparatorIaComponent', () => {
  let component: ComparatorIaComponent;
  let fixture: ComponentFixture<ComparatorIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparatorIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparatorIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
