// src/app/pages/auth/edit-enterprise-dialog/edit-enterprise-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-enterprise-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-enterprise-dialog.component.html',
  styleUrls: ['./edit-enterprise-dialog.component.css']
})
export class EditEnterpriseDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEnterpriseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      userName: [data.userName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      fullName: [data.fullName, Validators.required],
      enterpriseName: [data.enterpriseName, Validators.required],
      numberOfEmployees: [data.numberOfEmployees, Validators.required],
      contractDate: [data.contractDate, Validators.required],
      category: [data.category, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }
}