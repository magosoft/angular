import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RecordBean } from '../models/record-bean';


@Injectable()
export class ComunService {
  constructor(private _http: HttpClient) { }
  listarUsuarios(userId: string) {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_usuarios',
        len: 1,
        param1: userId
      }
    });
  }
  listarProspectos(userId: string, assignedUserId: string, nombre: string) {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_prospectos',
        len: 3,
        param1: userId,
        param2: assignedUserId,
        param3: nombre
      }
    });
  }
  listarComoLlego() {
    return this._http.get(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_como_llego',
        len: 0
      }
    });
  }
  listarComoEntero() {
    return this._http.get<RecordBean[]>(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_como_entero',
        len: 0
      }
    });
  }
  listarTareas(id: string = '') {
    return this._http.get<RecordBean[]>(environment.urlIndex, {
      params: {
        entryPoint: 'Call_SP_EntryPoint',
        action: 'listar_tareas_prospecto',
        len: 2,
        param1: id,
        param2: 'REALIZADO_EXITO'
      }
    });
  }
}
