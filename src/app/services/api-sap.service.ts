import { HttpClient } from '@angular/common/http';
import { isNgTemplate } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecordBean } from '../models/record-bean';

@Injectable()
export class ApiSapService {

  constructor(private _http: HttpClient) { }
  /*
   idnumber: "9585588 SC"
  nameFirst: "SENAIDA"
  nameLast: "GONZALES"
  nameLast2: "CONDORI"
  nameLst2: null
  partner: "0001078126"
  prefix1: ""
  prefix1Desc: ""
  refInterlocutor: null
  refNombre: null
  refRelacion: null
  refTelefono: null
  smtpAddr: null
  strSuppl: ". DOBLE VIA LA GUARDIA,  B/ CUMBRE DE LAS AMERICAS, C/ GUYANA AV"
  telNumber1: "59167872290"
  telNumber2: "67872290"
  type: "ZID001"
  */
  obtenerCliente(numdoc: string = '') {
    return this._http.get(environment.urlApi100 + '/sd/1300/clientes', {
      params: {
        numeroDocumento: numdoc
      },
      headers: {
        apikey: environment.apikey100
      }
    }).pipe(
      map((result: any) => {
        if (result && result.length > 0) {
          return {
            type: 'Contact', attributes: {
              numero_documento_c: result[0].idnumber,
              first_name: result[0].nameFirst,
              last_name: result[0].nameLast,
              last_name2_c: result[0].nameLast2 ?? '',
              last_name3_prefix_c: result[0].prefix1Desc ?? '',
              last_name3_c: result[0].nameLst2 ?? '',
              partner: result[0].partner,
              phone_mobile: result[0].telNumber1,
              email1: result[0].smtpAddr ?? ''
            }
          };
        } else {
          throw new Error('No existe cliente!');
        }

      })
    );
  }
}
