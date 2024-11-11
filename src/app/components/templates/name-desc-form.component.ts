// create-room-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-room-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="roomForm">
      <mat-form-field class="full-width">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" required>
        @if(roomForm.get('name')?.hasError('required') && roomForm.get('name')?.touched) {
          <mat-error>
            Name is required.
          </mat-error>
        }
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
        @if(roomForm.get('description')?.hasError('required') && roomForm.get('description')?.touched) {
          <mat-error>
            Description is required.
          </mat-error>
        }
      </mat-form-field>
    </form>
  `,
})
export class NameAndDescFormComponent {
  roomForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  isValid() {
    return this.roomForm.valid;
  }

  getData() {
    return this.isValid() ? this.roomForm : null;
  }
}