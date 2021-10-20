import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecordBean } from '../models/record-bean';


@Injectable()
export class ComunService {

  constructor(private _http: HttpClient) { }

  listarUsuarios(userId: string = ''): Observable<RecordBean[]> {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_usuarios',
        len: 1,
        param1: userId
      }
    }).pipe(map((result: any) => {
      return result.data;
    }));
  }
  obtenerProspectoPorPartner(partner:string):  Observable<RecordBean> {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'obtener_contacto_por_partner',
        len: 1,
        param1: partner
      }
    }).pipe(map((result: any) => {
      if (result.data && result.data.length > 0) {
        return result.data[0];
      } else {
        throw new Error('No existe asignado');
      }
    }));
  }
  obtenerAsignacion(firstName: string, lastName: string, phone: string): Observable<RecordBean> {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'obtener_asignacion',
        len: 3,
        param1: firstName,
        param2: lastName,
        param3: phone
      }
    }).pipe(map((result: any) => {
      if (result.data && result.data.length > 0) {
        return result.data[0];
      } else {
        throw new Error('No existe asignado');
      }
    }));
  }
  listarTiposProspectos(): Observable<any> {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_tipo_prospecto',
        kv: 'y'
      }
    }).pipe(map((result: any) => {
      return result.data;
    }));
  }

  listarPais(): Observable<any> {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_par_paises',
        kv: 'y'
      }
    }).pipe(map((result: any) => {
      let paises: any[] = [];
      let i = 0, j = 0, k = 0;
      result.data.forEach((a: any) => {
        i = paises.map(function (elem) { return elem.abr_pais }).indexOf(a.abr_pais);
        if (i < 0) {
          paises.push({ abr_pais: a.abr_pais, pais: a.pais, estados: [] });
        }
        i = paises.map(function (elem) { return elem.abr_pais }).indexOf(a.abr_pais);
        j = paises[i].estados.map(function (elem: any) { return elem.abr_estado }).indexOf(a.abr_estado);
        if (j < 0) {
          paises[i].estados.push({ abr_estado: a.abr_estado, estado: a.estado, regiones: [] });
        }
        if (a.codreg) {
          j = paises[i].estados.map(function (elem: any) { return elem.abr_estado }).indexOf(a.abr_estado);
          k = paises[i].estados[j].regiones.map(function (elem: any) { return elem.codreg }).indexOf(a.codreg);
          if (k < 0) {
            paises[i].estados[j].regiones.push({ codreg: a.codreg, region: a.region });
          }
        }
      });
      return paises;
    }));
  }

  listarRegistrosPipeline(userId: string = '', assignedUserId: string = '', nombre: string = '') {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_registros_pipeline',
        len: 3,
        param1: userId,
        param2: assignedUserId,
        param3: nombre
      }
    }).pipe(map((result: any) => {
      return result.data;
    }));
  }

  listarComoLlego() {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_como_llego',
        kv: 'y'
      }
    }).pipe(map((result: any) => {
      return result.data;
    }));
  }

  listarComoEntero() {
    return this._http.get<RecordBean[]>(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_como_entero',
        kv: 'y'
      }
    }).pipe(map((result: any) => {
      return result.data;
    }));
  }

  listarTareasExitosas(id: string = '') {
    return this._http.get<RecordBean[]>(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_historial_exito_prospecto',
        len: 2,
        param1: id,
        param2: 'All'
      }
    }).pipe(map((result: any) => {
      return result.data;
    }));
  }
}
