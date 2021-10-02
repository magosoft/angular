import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RecordBean } from '../models/record-bean';
import { tap } from 'rxjs';

@Injectable()
export class SuiteCrmService {
  private access_token: string = '';
  constructor(public _http: HttpClient) {
  }

  generateToken() {
    return this._http.post(environment.auth.url, environment.auth.credential).pipe(
      tap((result: any) => {
        this.access_token = 'Bearer ' + result.access_token;
      })
    );
  }
  //GET {{suitecrm.url}}/Api/V8/module/{moduleName}/{id}
  getModuleByID(moduleName: string, id: string) {
    return this._http.get<any>(environment.urlApi + '/' + moduleName + '/' + id, { headers: { Authorization: this.access_token } });
  }
  //GET {{suitecrm.url}}/Api/V8/module/{moduleName}
  getCollectionModules(moduleName: string) {
    return this._http.get<any>(environment.urlApi + '/' + moduleName, { headers: { Authorization: this.access_token } });
  }
  //POST {{suitecrm.url}}/Api/V8/module
  createModuleRecord(record: RecordBean) {
    return this._http.post<any>(environment.urlApi, { data: this.copiar(record) }, { headers: { Authorization: this.access_token } });
  }
  //PATCH {{suitecrm.url}}/Api/V8/module
  updateModuleRecord(record: RecordBean) {
    return this._http.patch<any>(environment.urlApi, { data: this.copiar(record) }, { headers: { Authorization: this.access_token } });
  }
  //DELETE {{suitecrm.url}}/Api/V8/module/{moduleName}/{id}
  deleteModuleRecord(moduleName: string, id: string) {
    return this._http.patch<any>(environment.urlApi + '/' + moduleName + '/' + id, { headers: { Authorization: this.access_token } });
  }
  copiar(record: RecordBean): any {
    let data = { type: record.type, attributes: {} };
    if (record.id) {
      Object.defineProperty(data, 'id', { value: record.id, enumerable: true });
    }
    for (let [key, value] of Object.entries(record.attributes)) {
      if (value) {
        Object.defineProperty(data.attributes, key, { value: value, enumerable: true });
      }
    }
    return data;
  }

}
