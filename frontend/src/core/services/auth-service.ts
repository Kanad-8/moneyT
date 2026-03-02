import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import { Router } from '@angular/router';
import { JwtResponse, LoginRequest, RegisterRequest } from '../models/AuthModel';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  private readonly TOKEN_KEY = 'moneyt_auth_token';
  private readonly USER_KEY ='moneyt_user_info';

  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(){}

  setToken(token:string):void{
    localStorage.setItem(this.TOKEN_KEY,token);
  }

  getToken():string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout():void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.router.navigate(['/login']);
    
  }

  isLoggedIn():boolean {
    const token = this.getToken();
    if(!token){
      return false;
    }

    try{
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() /1000);

      if(decoded.exp && decoded.exp > now){
        return true;
      }
    }catch(error){
      return false;
    }
    return false;
  }

  register(user:RegisterRequest):Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`,user);
  }

  login(credentials:LoginRequest):Observable<JwtResponse>{
    return this.http.post<JwtResponse> (`${this.apiUrl}/signin`,credentials).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveUser(response);
      })
    );
  }

  private saveToken(token:string):void {
    localStorage.setItem(this.TOKEN_KEY,token);
  }

  private saveUser(user:JwtResponse):void{
    localStorage.setItem(this.USER_KEY,JSON.stringify(user));
  }

  getUser():any{
    const user = localStorage.getItem(this.USER_KEY);
    if(user) {
      return JSON.parse(user);
    }
    return null;
  }

  
}
