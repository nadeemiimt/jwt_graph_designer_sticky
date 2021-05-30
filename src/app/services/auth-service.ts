import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { UserLogin } from '../model/user-login';

const AUTH_API = 'http://localhost:8000/api/auth/';
const API = 'http://localhost:8000/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<UserLogin> {
    return this.http.post<UserLogin>(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(user: User): Observable<any> {
    return this.http.post(AUTH_API + 'register', user, httpOptions);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(AUTH_API + 'users', httpOptions);
  }
}