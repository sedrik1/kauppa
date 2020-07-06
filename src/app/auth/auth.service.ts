import { Injectable, inject, Inject } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private cart: Product[];
  private tokenTimer: any;
  private isAuthenticated = false;
  private currentUser: string;
  private currentUserId: string;
  private currentUserAuthLevel: string;
  private isAuthenticatedListener = new Subject<boolean>();
  private currentUserListener = new Subject<string>();
  private currentUserIdListener = new Subject<string>();
  private currentUserAuthLevelListener = new Subject<string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private prodcutsService: ProductsService
  ) { }

  getUserEmail(): string {
    return this.currentUser;
  }

  getUserId(): string {
    return this.currentUserId;
  }

  getUserAuthLevel(): string {
    return this.currentUserAuthLevel;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getIsAuthListener(): Observable<boolean> {
    return this.isAuthenticatedListener.asObservable();
  }

  getCurrentUserIdListener(): Observable<string> {
    return this.currentUserIdListener.asObservable();
  }

  getCurrentUserListener(): Observable<string> {
    return this.currentUserListener.asObservable();
  }

  getCurrentUserAuthLevelListener(): Observable<string> {
    return this.currentUserAuthLevelListener.asObservable();
  }

  changeAuth(changeLevel: boolean) {
    this.isAuthenticatedListener.next(changeLevel);
  }

  guestToken(): void {
    this.http.get<{
      guestId: string,
      authLevel: string,
      token: string;
      expiresIn: number;
    }>('http://localhost:3000/api/user/tokenForGuest')
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.currentUser = response.authLevel;
        this.currentUserId = response.guestId;
        this.currentUserAuthLevel = response.authLevel;
        this.currentUserListener.next(this.currentUser);
        this.currentUserIdListener.next(this.currentUserId);
        this.currentUserAuthLevelListener.next(this.currentUserAuthLevel);
        const currentTime = new Date();
        const expirationDate = new Date(
          currentTime.getTime() + expiresInDuration * 2000
        );
        this.saveAuthData(token, expirationDate, this.currentUserId, this.currentUser, this.cart);
        this.isAuthenticatedListener.next(false);
      }
    }, error => {
      this.isAuthenticatedListener.next(false);
   });
  }

  loginUser(email: string, pwd: string): void {
    const user = { email, pwd };
    this.http.post<{
      email: string,
      userId: string,
      authLevel: string,
      token: string;
      expiresIn: number;
    }>
    ('http://localhost:3000/api/user/login', user)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        this.clearAuthData();
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.isAuthenticatedListener.next(true);
        this.currentUser = response.email;
        this.currentUserId = response.userId;
        this.currentUserAuthLevel = response.authLevel;
        this.currentUserListener.next(this.currentUser);
        this.currentUserIdListener.next(this.currentUserId);
        this.currentUserAuthLevelListener.next(this.currentUserAuthLevel);
        const currentTime = new Date();
        const expirationDate = new Date(
          currentTime.getTime() + expiresInDuration * 2000
        );
        this.saveAuthData(token, expirationDate, this.currentUserId, this.currentUser, this.cart);
        this.router.navigate(['/']);
      }
    }, error => {
       this.isAuthenticatedListener.next(false);
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.currentUserAuthLevel = null;
    this.currentUserId = null;
    this.isAuthenticatedListener.next(false);
    this.currentUserAuthLevelListener.next('');
    this.currentUserIdListener.next('');
    this.currentUserListener.next('');
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  createUser(email: string, pwd: string, confirmPwd: string): boolean {
    let outcome: boolean;
    const user = { email, pwd, confirmPwd, authLevel: 'customer' };
    this.http.post<{message: string}>('http://localhost:3000/api/user/signup', user)
    .subscribe((result) => {
      if (result.message !== 'Rekisteröityminen onnistui') {
        outcome = false;
      } else {
        setTimeout(() => {
          this.router.navigate(['../login']);
        }, 3000);
        outcome = true;
      }
    }, err => {
      this.isAuthenticatedListener.next(false);
    });
    return outcome;
  }

  changePassword(email: string, newPassword: string): void {
    this.http.put<{message: string}>
    ('http://localhost:3000/api/user/changeUserPassword',
    { email, newPassword })
    .subscribe(asd => {
      console.log(asd.message);
    });
  }

  changeUserEmail(newEmail: string, oldEmail: string) {
    this.http.put<{message: string, updatedEmail: string}>
    ('http://localhost:3000/api/user/changeUserEmail',
    { newEmail, oldEmail })
    .subscribe((res) => {
      this.currentUser = res.updatedEmail;
      this.currentUserListener.next(this.currentUser);
    });
  }

  checkForExcistingToken() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return undefined;
    } else {
      const currentTime = new Date();
      const expiresIn = authInformation.expiration.getTime() - currentTime.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.currentUserId = authInformation.userId;
        this.currentUser = authInformation.userEmail;
        // this.cart = authInformation.cart;
        this.setAuthTimer(expiresIn / 2000);
        this.currentUserListener.next(authInformation.userEmail);
        if (
          authInformation.userEmail !== 'guest' &&
          authInformation.userEmail !== undefined &&
          authInformation.userEmail !== null
        ) {
          this.isAuthenticated = true;
          this.isAuthenticatedListener.next(true);
          return true;
        } else {
          this.isAuthenticated = false;
          this.isAuthenticatedListener.next(false);
          return undefined;
        }
      }
    }
  }

  private saveAuthData(token: string, expiration: Date, userId: string, userEmail: string, cart: Product[]) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('expiration', expiration.toISOString());
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const expiration = localStorage.getItem('expiration');
    const cart = localStorage.getItem('cart');
    if (!token || !expiration) {
      return;
    }
    return {
      token, expiration: new Date(expiration), userId, userEmail, cart
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 2000);
  }

  clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('cart');
  }
}
