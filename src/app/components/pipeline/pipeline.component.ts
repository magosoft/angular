import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ComunService } from 'src/app/services/comun.service';
import { SuiteCrmService } from 'src/app/services/suite-crm.service';
import { RecordBean } from 'src/app/models/record-bean';
import Swal from 'sweetalert2';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
  providers: [ComunService, SuiteCrmService]
})
export class PipelineComponent implements OnInit {

  public captados: RecordBean[];
  public interesados: RecordBean[];
  public negociaciones: RecordBean[];
  public propuestas: RecordBean[];
  public reservas: RecordBean[];
  public contratos: RecordBean[];
  public ganados: RecordBean[];
  public perdidos: RecordBean[];
  public usuarios: RecordBean[];
  public search: string;
  public userId: string;
  public assignedUserId: string;
  constructor(
    public _serv: ComunService,
    private _crm: SuiteCrmService,
    public dialog: MatDialog) {
    this.captados = [];
    this.interesados = [];
    this.negociaciones = [];
    this.propuestas = [];
    this.reservas = [];
    this.contratos = [];
    this.ganados = [];
    this.perdidos = [];
    this.usuarios = [];
    this.search = '';
    this.userId = '';
    this.assignedUserId = '';
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.userId = document.getElementById('ng_user_id')?.getAttribute('value') ?? '';
      this.assignedUserId = this.userId;
      this.listarUsuarios();
    }, 10);
  }

  onDrop(event: CdkDragDrop<RecordBean[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.id == 'list-captados' && event.container.id == 'list-interesados') {
        this.validarTieneTareas(event);
      }
      if (event.previousContainer.id == 'list-captados' && event.container.id == 'list-perdidos') {
        this.openDialogCierrePerdido(event);
      }
      if (event.previousContainer.id == 'list-interesados' && event.container.id == 'list-perdidos') {
        this.openDialogCierrePerdido(event);
      }
      if (event.previousContainer.id == 'list-interesados' && event.container.id == 'list-negociaciones') {
        console.log('entro');
      }
      if (event.previousContainer.id == 'list-negociaciones' && event.container.id == 'list-propuestas') {
        console.log('entro');
      }
    }
  }

  async onClickLead(id?: string) {
    if (id) {
      this._crm.generateToken().subscribe({
        next: () => {
          this._crm.getModuleByID('Leads', id).subscribe({
            next: (result: any) => {
              this.openDialogLead(result.data);
            },
            error: (e) => {
              this.showError(e);
            }
          });
        }
      });
    } else {
      this.openDialogLead({
        type: 'Lead', attributes: {
          modified_user_id: this.userId,
          created_by: this.userId,
          assigned_user_id: this.userId,
          etapa_c: environment.etapas[0],
          status: environment.status[0],
          status_description: 'Asignado por PIPELINE' 
        }
      });
    }
  }
  openDialogLead(data: RecordBean) {
    const dialogRef = this.dialog.open(EditLeadComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._crm.generateToken().subscribe({
          next: () => {
            if (result.id) {
              this._crm.updateModuleRecord(result).subscribe({
                next: (r) => {
                  console.log(r);
                }
              });
            } else {
              this._crm.createModuleRecord(result).subscribe({
                next: (r) => {
                  console.log(r);
                }
              });
            }
          }
        });
      }
    });
  }

  openDialogCierrePerdido(event: CdkDragDrop<RecordBean[]>): void {
    /*let elem = event.previousContainer.data[event.previousIndex];
    const dialogRef = this.dialog.open(DialogPerdidoComponent, {
      data: elem
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          0);
        Swal.fire({
           icon: 'success',
           title: '' + elem.first_name + ' avanzo a la etapa ' + elem.etapa_c,
           showConfirmButton: false,
           timer: 3000
         });
      }
    });*/
  }

  listarUsuarios(): void {
    this._serv.listarUsuarios(this.userId).subscribe({
      next: (result: any) => {
        this.usuarios = result.data;
        this.listarProspectos();
      },
      error: (e) => {
        Swal.fire({
          width: '350px',
          icon: 'error',
          title: e.error ? e.error.error : 'Error desconocido',
          text: e.error ? e.error.message : 'Error servicio!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
  listarProspectos(): void {
    this._serv.listarProspectos(this.userId, this.assignedUserId, this.search).subscribe({
      next: (result: any) => {
        this.captados = result.data.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[0]);
        this.interesados = result.data.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[1]);
        this.negociaciones = result.data.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[2]);
        this.propuestas = result.data.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[3]);
        this.reservas = result.data.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[4]);
        this.contratos = result.data.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[5]);
        this.ganados = result.data.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[6]);
        this.perdidos = result.data.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[7]);
      },
      error: (e) => {
        Swal.fire({
          width: '350px',
          icon: 'error',
          title: e.error ? e.error.error : 'Error desconocido',
          text: e.error ? e.error.message : 'Error servicio!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  validarTieneTareas(event: CdkDragDrop<RecordBean[]>): void {
    let elem = event.previousContainer.data[event.previousIndex];
    this._serv.listarTareas(elem.id).subscribe({
      next: (result) => {
        if (result.length > 0) {
          this.cambiarEtapaInteres(event);
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Debe realizar al menos una tarea exitosa para avanzar.',
            showConfirmButton: false,
            timer: 3000
          });
        }
      },
      error: (e) => {
        Swal.fire({
          width: '350px',
          icon: 'error',
          title: e.error ? e.error.error : 'Error desconocido',
          text: e.error ? e.error.message : 'Error servicio!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  tokenEtapaInteres(event: CdkDragDrop<RecordBean[]>) {
    /*this._token.conectar().subscribe({
      next: (result) => {
        this.cambiarEtapaInteres(event, result.access_token);
      },
      error: (e) => {
        Swal.fire({
          width: '350px',
          icon: 'error',
          title: e.error ? e.error.error : 'Error desconocido',
          text: e.error ? e.error.message : 'Error servicio!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Cerrar'
        });
      }
    });*/
  }

  cambiarEtapaInteres(event: CdkDragDrop<RecordBean[]>) {
    this._crm.generateToken().subscribe({
      next: () => {
        let bean = event.previousContainer.data[event.previousIndex];

        this._crm.updateModuleRecord({ id: bean.id, type: 'Leads', attributes: { etapa_c: '' } });
      }
    });
    /*let elem = event.previousContainer.data[event.previousIndex];
    elem.etapa_c = 'INTERES';
    this._crm.modificarEtapaProspecto(elem, token).subscribe({
      next: (result) => {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          0);
      },
      error: (e) => {
        Swal.fire({
          width: '350px',
          icon: 'error',
          title: e.error ? e.error.error : 'Error desconocido',
          text: e.error ? e.error.message : 'Error servicio!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Cerrar'
        });
      }
    });*/
  }
  showError(e: any): void {
    Swal.fire({
      width: '350px',
      icon: 'error',
      title: e.error ? e.error.error : 'Error desconocido',
      text: e.error ? e.error.message : 'Error servicio!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar'
    });
  }
}
