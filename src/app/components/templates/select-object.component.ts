import { Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-select-object',
    standalone: true,
    imports: [MatSelectModule, ReactiveFormsModule],
    template: `
    <mat-form-field class="full-width">
      <mat-label>{{ title }}</mat-label>
      <mat-select [(value)]="selectedObject" (selectionChange)="onSelectionChange($event)">
        @for (obj of objects; track $index) {
        <mat-option [value]="obj">
          {{ obj.name }}
        </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class SelectObjectComponent {
    @Input() objects: any[] = [];
    @Input() title: string = '';

    selectedObject: any;
    selectionTouched: boolean = false;

    onSelectionChange(event: any) {
        this.selectedObject = event.value;
        this.selectionTouched = true;
    }

    isValid() {
        return this.selectedObject != null;
    }

    getData() {
        return this.isValid() ? this.selectedObject : null;
    }
}
