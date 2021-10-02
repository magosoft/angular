import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecordBean } from 'src/app/models/record-bean';

@Component({
  selector: 'app-edit-lead',
  templateUrl: './edit-lead.component.html',
  styleUrls: ['./edit-lead.component.scss']
})
export class EditLeadComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditLeadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecordBean) { }

  ngOnInit(): void {
    console.log(this.data);
  }
  onClickGuardar(): void {
    this.dialogRef.close(this.data);
  }
  onClickCancelar(): void {
    this.dialogRef.close();
  }
}
