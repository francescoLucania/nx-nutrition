import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public get apiUrl(): string {
    return environment.apiUrl
  }

  constructor(
    private http: HttpClient,
  ) { }

  public postRequest<Body, Response>(url: string, body: Body): Observable<Response> {
    return this.http.post<Response>(`${this.apiUrl}/${url}`, body)
  }

  public getRequest<Response>(url: string): Observable<Response> {
    return this.http.get<Response>(`${this.apiUrl}/${url}`)
  }

  public deleteRequest<Response>(url: string): Observable<Response> {
    return this.http.delete<Response>(`${this.apiUrl}/${url}`)
  }
}
