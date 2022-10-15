import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getContractAddress() : Observable<any> {
    return this.http.get("http://localhost:3000/get-contract-address");
  }

  claimTokens(body: any) : Observable<any> {
    return this.http.post("http://localhost:3000/claim-tokens", body);
  }
}
