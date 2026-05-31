import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Un observable que nos dirá en tiempo real si el usuario está logueado o no
  public user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  // Función para Registrarse
  register(email: string, passwd: string) {
    return createUserWithEmailAndPassword(this.auth, email, passwd);
  }

  // Función para Iniciar Sesión
  login(email: string, passwd: string) {
    return signInWithEmailAndPassword(this.auth, email, passwd);
  }

  // Función para Cerrar Sesión
  logout() {
    return signOut(this.auth);
  }
}
