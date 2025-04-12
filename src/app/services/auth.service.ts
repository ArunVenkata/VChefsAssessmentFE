import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = "http://localhost:3000";
  
  constructor(private httpClient: HttpClient) {
    this.API_URL = environment.API_URL;
  }
  getAccessToken(){
    return sessionStorage.getItem("token") || null
  }
  setAccessToken(token: string){
    return sessionStorage.setItem("token", token);
  }
  removeAccessToken(){
    sessionStorage.removeItem("token");
  }
  loginWithGoogle(token: string) {
    return this.httpClient.post(`${this.API_URL}/auth/google`, { token }, { withCredentials: true });
  }

  getGoogleLoginDetails() {
    return this.httpClient.get(`${this.API_URL}/auth/google`, { withCredentials: true });
  }
}
