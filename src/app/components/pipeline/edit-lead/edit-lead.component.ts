import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecordBean } from 'src/app/models/record-bean';
import { ApiSapService } from 'src/app/services/api-sap.service';
import { AuthService } from 'src/app/services/auth.service';
import { ComunService } from 'src/app/services/comun.service';
import { SpinnerOverlayService } from 'src/app/services/spinner-overlay.service'
@Component({
  selector: 'app-edit-lead',
  templateUrl: './edit-lead.component.html',
  styleUrls: ['./edit-lead.component.scss'],
  providers: [ComunService, ApiSapService]
})

export class EditLeadComponent implements OnInit {
  public paises: any[];
  public estados: any[];
  public tiposProspectos: any[];
  public listaComoLlego: any[];
  public listaComoSeEntero: any[];
  public dataSource: RecordBean[];
  public columnsToDisplay: string[];
  public searchCliente: string;
  public numberDocument?: string;
  public busqueda?: string;
  public busquedaText?: string;
  public user: RecordBean;
  public assignedUserId: string;
  constructor(public dialogRef: MatDialogRef<EditLeadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecordBean,
    private _serv: ComunService,
    private _aut: AuthService,
    private _apisap: ApiSapService,
    private _spin: SpinnerOverlayService) {
    this.paises = [];
    this.estados = [];
    this.tiposProspectos = [];
    this.listaComoLlego = [];
    this.listaComoSeEntero = [];
    this.searchCliente = 'NO';
    this.busqueda = '0';
    this.dataSource = [];
    this.columnsToDisplay = ['full_name', 'securitygroup_name', 'select'];
    this.user = { type: 'User', attributes: {} };
    this.assignedUserId = '';
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.assignedUserId = this.data.attributes.assigned_user_id;
      this._aut.currentUser().subscribe({
        next: (usuario: RecordBean) => {
          this._spin.show();
          this._serv.listarUsuarios(usuario.id).subscribe({
            next: (usuarios: RecordBean[]) => {
              this._spin.hide();
              this.dataSource = usuarios;
              this.selectUserById(this.data.attributes.assigned_user_id);
              this.listarPaises();
            },
            error: () => {
              this._spin.hide();
            }
          });
        }
      });
    });
  }

  listarPaises(): void {
    this._spin.show();
    this._serv.listarPais().subscribe({
      next: (paises: any) => {
        this._spin.hide();
        this.paises = paises;
        this.onSelectPais(this.data.attributes.primary_address_country);
        this.listarTiposProspectos();
      },
      error: () => {
        this._spin.hide();
      }
    });
  }

  listarTiposProspectos(): void {
    this._spin.show();
    this._serv.listarTiposProspectos().subscribe({
      next: (tipos: any) => {
        this._spin.hide();
        this.tiposProspectos = tipos;
        if (!this.data.attributes.fecha_validez_c) {
          this.onSelectTipoProspecto(this.data.attributes.tipo_prospecto_c);
        }
        this.listarComoLLego();
      },
      error: () => {
        this._spin.hide();
      }
    });
  }



  listarComoLLego(): void {
    this._spin.show();
    this._serv.listarComoLlego().subscribe({
      next: (listaComoLLego: any) => {
        this._spin.hide();
        this.listaComoLlego = listaComoLLego;       
        this.listarComoEntero();
      },
      error: () => {
        this._spin.hide();
      }
    });
  }

  listarComoEntero(): void {
    this._spin.show();
    this._serv.listarComoEntero().subscribe({
      next: (listaComoSeEntero: any) => {
        this._spin.hide();
        this.listaComoSeEntero = listaComoSeEntero;
      },
      error: () => {
        this._spin.hide();
      }
    });
  }

  onAsignarUsuarioId(): void {
    if (this.data.attributes.first_name && this.data.attributes.last_name && this.data.attributes.phone_mobile) {
      this._serv.obtenerAsignacion(this.data.attributes.first_name, this.data.attributes.last_name, this.data.attributes.phone_mobile).subscribe({
        next: (user: RecordBean) => {
          this.data.attributes.assigned_user_id = user.id;
          this.onSelectAsesor(user);
        },
        error: () => {
          this.data.attributes.assigned_user_id = this.assignedUserId;
          
          //this.onSelectAsesor(user);
        }
      });
    }
  }

  selectUserById(id: string = ''): void {
    if (id) {
      let i = this.dataSource.map(function (elem) { return elem.id }).indexOf(id);
      if (i >= 0) {
        this.user = this.dataSource[i];
      }
    }
  }
  onSelectAsesor(itemUser: RecordBean): void {
    this.user = itemUser;
  }
  onSelectPais(abr_pais: any): void {
    this.estados = [];
    let i = this.paises.map(function (elem) { return elem.abr_pais }).indexOf(abr_pais);
    if (i >= 0) {
      this.estados = this.paises[i].estados;
    }
  }
  onSelectTipoProspecto(name: any): void {
    let i = this.tiposProspectos.map(function (elem) { return elem.name }).indexOf(name);
    if (i >= 0) {
      if (this.data.attributes.date_entered) {
        this.data.attributes.date_entered = new Date(this.data.attributes.date_entered);
      } else {
        this.data.attributes.date_entered = new Date();
      }
      this.data.attributes.fecha_validez_c = new Date();
      if (this.tiposProspectos[i].tiempo_de_vigencia_dma == 'DAY') {     
        this.data.attributes.fecha_validez_c.setDate(this.data.attributes.date_entered.getDate() + Number(this.tiposProspectos[i].tiempo_de_vigencia_cantidad));
      }
      if (this.tiposProspectos[i].tiempo_de_vigencia_dma == 'MONTH') {
        let fecha = this.data.attributes.date_entered;
        fecha.setMonth(this.data.attributes.date_entered.getMonth() + Number(this.tiposProspectos[i].tiempo_de_vigencia_cantidad));
        this.data.attributes.fecha_validez_c = fecha;
      }
      if (this.tiposProspectos[i].tiempo_de_vigencia_dma == 'YEAR') {
        let fecha = this.data.attributes.date_entered;      
        fecha.setFullYear(this.data.attributes.date_entered.getFullYear() + Number(this.tiposProspectos[i].tiempo_de_vigencia_cantidad));
        this.data.attributes.fecha_validez_c = fecha;
      }
    }
  }
  setUpperCase(): void {
    this.data.attributes.last_name2_c = this.data.attributes.last_name2_c ?? '';
    this.data.attributes.last_name3_c = this.data.attributes.last_name3_c ?? '';
    this.data.attributes.first_name = this.data.attributes.first_name.toUpperCase();
    this.data.attributes.last_name = this.data.attributes.last_name.toUpperCase();
    this.data.attributes.last_name2_c = this.data.attributes.last_name2_c.toUpperCase();
    this.data.attributes.last_name3_c = this.data.attributes.last_name3_c.toUpperCase();
  }



  onClickBuscarCliente(): void {
    if (this.numberDocument) {
      this._apisap.obtenerCliente(this.numberDocument).subscribe({
        next: (value: RecordBean) => {
          //this._serv.obtenerProspectoPorPartner(value.attributes.partner).
          this.data.attributes.first_name = value.attributes.first_name;
          this.data.attributes.last_name = value.attributes.last_name;
          this.data.attributes.last_name2_c = value.attributes.last_name2_c;
          this.data.attributes.last_name3_prefix_c = value.attributes.last_name3_prefix_c;
          this.data.attributes.last_name3_c = value.attributes.last_name3_c;
          this.data.attributes.phone_mobile = value.attributes.phone_mobile;
          this.data.attributes.mail1 = value.attributes.mail1;
          this.data.attributes.primary_address_country = value.attributes.primary_address_country;
          this.data.attributes.primary_address_state = value.attributes.primary_address_state;
          this.data.attributes.primary_address_city = value.attributes.primary_address_city;
          this.data.attributes.primary_address_street = value.attributes.primary_address_street;
        }
      }
      );
    }

  }
  onClickBuscar(): void {

  }
  onClickGuardar(): void {
    this.setUpperCase();
    this.dialogRef.close(this.data);
  }
  onClickCancelar(): void {
    this.dialogRef.close();
  }
}
