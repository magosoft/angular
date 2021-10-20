import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ComunService } from 'src/app/services/comun.service';
import { SuiteCrmService } from 'src/app/services/suite-crm.service';
import { RecordBean } from 'src/app/models/record-bean';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { SpinnerOverlayService } from 'src/app/services/spinner-overlay.service';


@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
  providers: [ComunService, SuiteCrmService, AuthService]
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
  public usuarioLogueado: RecordBean;
  public search: string;
  public assignedUserId: string;

  constructor(
    public _serv: ComunService,
    private _crm: SuiteCrmService,
    private _auth: AuthService,
    private _spin: SpinnerOverlayService,
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
    this.usuarioLogueado = { type: 'User', attributes: {} };
    this.search = '';
    this.assignedUserId = 'TODOS';

  }

  ngOnInit(): void {
    setTimeout(() => {
      this._spin.show();
      this._auth.currentUser().subscribe(user => {
        this._spin.hide();
        this.usuarioLogueado = user;
        this.listarUsuarios();
      });
    });
  }

  onDrop(event: CdkDragDrop<RecordBean[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let elem = event.previousContainer.data[event.previousIndex];
      if (event.previousContainer.id == 'list-captados' && event.container.id == 'list-interesados') {
        this.cambiarEtapaInteres(elem.id);
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
  onShowError(err: any): void {
    Swal.fire({
      width: '350px',
      icon: 'error',
      title: err.error ? err.error.error : 'Error desconocido',
      text: err.error ? err.error.message : 'Error servicio!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar'
    });
  }
  onShowWarning(text: string = ''): void {
    Swal.fire({
      width: '350px',
      icon: 'warning',
      text: text,
      showConfirmButton: false,
      timer: 3000
    });
  }
  onShowSuccess(text: string = ''): void {
    Swal.fire({
      width: '350px',
      icon: 'success',
      text: text,
      showConfirmButton: false,
      timer: 3000
    });
  }
  onClickLead(id?: string) {
    if (id) {
      this._crm.generateToken().subscribe({
        next: () => {
          this._crm.getModuleByID('Leads', id).subscribe({
            next: (result: RecordBean) => {
              this.openDialogLead(result);
            },
            error: (e) => {
              this.onShowError(e);
            }
          });
        }
      });
    } else {
      this.openDialogLead({
        type: 'Lead', attributes: {
          modified_user_id: this.usuarioLogueado.id,
          created_by: this.usuarioLogueado.id,
          assigned_user_id: this.usuarioLogueado.id,
          primary_address_country: 'BO',
          primary_address_state: '03',
          tipo_prospecto_c: 'NORMAL',
          etapa_c: environment.etapas[0],
          status: environment.status[0],
          status_description: 'Asignado por PIPELINE',
        }
      });
    }
  }
  onClickOpportunity(id?: string) {
    if (id) {
      this._crm.generateToken().subscribe({
        next: () => {
          this._crm.getModuleByID('Opportunities', id).subscribe({
            next: (result: RecordBean) => {
              //this.openDialogOpportunity(result);
            },
            error: (e) => {
              this.onShowError(e);
            }
          });
        }
      });
    } else {
      /*this.openDialogOpportunity({
        type: 'Opportunity', attributes: {
          modified_user_id: this.usuarioLogueado.id,
          created_by: this.usuarioLogueado.id,
          assigned_user_id: this.usuarioLogueado.id,
          etapa_c: environment.etapas[0],
          status: environment.status[0],
          status_description: 'Asignado por PIPELINE',

        }
      });*/
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
            if (result.attributes.fecha_validez_c) {
              result.attributes.fecha_validez_c = formatDate(result.attributes.fecha_validez_c, 'yyyy-MM-dd', 'en-GB');
            }
            if (result.id) {
              this._crm.updateModuleRecord(result).subscribe({
                next: (r) => {
                  this.updatePipeline();
                  this.onShowSuccess('Prospecto registrado exitosamente.');
                }
              });
            } else {
              this._crm.createModuleRecord(result).subscribe({
                next: (r) => {
                  this.updatePipeline();
                  this.onShowSuccess('Prospecto registrado exitosamente.');
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
    this._spin.show();
    this._serv.listarUsuarios(this.usuarioLogueado.id).subscribe({
      next: (result: RecordBean[]) => {
        this._spin.hide();
        this.usuarios = result;
        if(this.usuarios.length == 1){
          this.assignedUserId = this.usuarios[0].id ?? 'TODOS';
        }
        this.updatePipeline();
      },
      error: (e) => {
        this._spin.hide();
        this.onShowError(e);
      }
    });
  }

  updatePipeline(): void {
    this._spin.show();
    this._serv.listarRegistrosPipeline(this.usuarioLogueado.id, this.assignedUserId, this.search).subscribe({
      next: (result: RecordBean[]) => {
        this._spin.hide();
        if (result.length > 0) {
          this.captados = result.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[0]);
          this.interesados = result.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[1]);
          this.negociaciones = result.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[2]);
          this.propuestas = result.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[3]);
          this.reservas = result.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[4]);
          this.contratos = result.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[5]);
          this.ganados = result.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[6]);
          this.perdidos = result.filter((o: RecordBean) => o.attributes.etapa_c == environment.etapas[7]);
        } else {
          this.onShowWarning('No se encontraron resultados para su criterio de búsqueda.');
        }
      },
      error: (e) => {
        this._spin.hide();
        this.onShowError(e);
      }
    });
  }

  cambiarEtapaInteres(id = ''): void {
    this._spin.show();
    this._serv.listarTareasExitosas(id).subscribe({
      next: (result: RecordBean[]) => {
        if (result.length > 0) {
          this._crm.generateToken().subscribe({
            next: () => {
              this._crm.updateModuleRecord({ id: id, type: 'Leads', attributes: { etapa_c: environment.etapas[1] } }).subscribe({
                next: (res: RecordBean) => {
                  this._spin.hide();
                  this.onShowSuccess(res.attributes.full_name + ' avanzó a la etapa Interés.');
                  this.updatePipeline();
                },
                error: (e) => {
                  this._spin.hide();
                  this.onShowError(e);
                }
              });
            },
            error: (e) => {
              this._spin.hide();
              this.onShowError(e);
            }
          });
        } else {
          this._spin.hide();
          Swal.fire({
            icon: 'error',
            text: 'Debe realizar al menos una tarea exitosa para avanzar.',
            showConfirmButton: false,
            timer: 3000
          });
        }
      },
      error: (e) => {
        this._spin.hide();
        this.onShowError(e);
      }
    });
  }

}
