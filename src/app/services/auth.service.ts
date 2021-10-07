import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecordBean } from '../models/record-bean';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: RecordBean;
  constructor(private _http: HttpClient) {
    this.user = { type: 'User' };
  }
  currentUser(): Observable<RecordBean> {
    if (this.user.id) {
      return new Observable<RecordBean>((observer) => {
        observer.next(this.user);
      });
    } else {
      let userId = sessionStorage.getItem('CURRENT_USER_ID') ?? 'a7e346e4-47ed-c596-2bcb-5be199070c40';
      return this._http.get(environment.urlIndex, {
        params: {
          entryPoint: 'Call_SP_EntryPoint',
          action: 'obtener_usuario',
          len: 1,
          param1: userId
        }
      }).pipe(tap((result: any) => {
        if(result.data && result.data.length > 0){
          this.user = result.data[0];
        }       
      }), map((val: RecordBean) => {
        return this.user;
      }));
    }
  }
}
