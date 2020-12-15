import { User } from './../_models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseURL = 'https://localhost:5001/api/';
  private currentUserStore = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserStore.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseURL + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserStore.next(user);
        }
      })
    );
  }

  register(model: any){
    return this.http.post(this.baseURL + 'account/register', model).pipe(
      map((user: User) => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserStore.next(user);
        }
        // return user;
      })
    );
  }

  setCurrentUser(user: User){
    this.currentUserStore.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserStore.next(null);
  }
}
