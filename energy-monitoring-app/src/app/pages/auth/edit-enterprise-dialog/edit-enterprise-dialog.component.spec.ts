import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnterpriseDialogComponent } from './edit-enterprise-dialog.component';

describe('EditEnterpriseDialogComponent', () => {
  let component: EditEnterpriseDialogComponent;
  let fixture: ComponentFixture<EditEnterpriseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEnterpriseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEnterpriseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
