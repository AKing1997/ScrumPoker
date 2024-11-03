import { ChangeDetectionStrategy, Component, Inject, ViewChild, ViewContainerRef, AfterViewInit, inject, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogActions,
  MatDialogContent,
  MatDialogClose,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NameAndDescFormComponent } from '../templates/name-desc-form.component';

export interface DialogData {
  title?: string;
  content?: any;
  confirmText?: string;
  cancelText?: string;
  objects?: any[];
}

@Component({
  selector: 'app-standard-dialog',
  templateUrl: 'standard-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class StandardDialogComponent implements AfterViewInit {
  @ViewChild('dynamicContent', { read: ViewContainerRef }) container!: ViewContainerRef;
  contentInstance!: any;

  constructor(
    public dialogRef: MatDialogRef<StandardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngAfterViewInit() {
    const componentRef = this.container.createComponent(this.data.content);
    this.contentInstance = componentRef.instance;

    if (this.data.title) {
      this.contentInstance.title = this.data.title;
    }

    if (this.data.objects) {
      this.contentInstance.objects = this.data.objects;
    }

    if (!this.contentInstance) {
      console.error('Content instance is not set');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.contentInstance && this.contentInstance.isValid()) {
      const contentData = this.contentInstance.getData();
      this.dialogRef.close(contentData?.value ?? contentData);
    }
  }
}