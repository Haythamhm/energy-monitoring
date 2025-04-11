import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorReglesIaComponent } from './generator-regles-ia.component';

describe('GeneratorReglesIaComponent', () => {
  let component: GeneratorReglesIaComponent;
  let fixture: ComponentFixture<GeneratorReglesIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorReglesIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratorReglesIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
