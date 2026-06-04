import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Un observable que nos dirá en tiempo real si el usuario está logueado o no
  public user$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {
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

  // Función que guarda los datos extra en el Firestore (ciudad, país, nombre_rest...)
  saveOwnerData(uid: string, data: any) {
    // 1. Apuntamos a la colección 'owners' y creamos un documento con el UID del usuario
    const documentReference = doc(this.firestore, `owners/${uid}`);

    // 2. Guardamos los datos en ese documento
    return setDoc(documentReference, data);
  }

  // Función para obtener el perfil del usuario desde Firestore
  async getOwnerProfile(uid: string) {
    const documentReference = doc(this.firestore, `owners/${uid}`);
    const docSnap = await getDoc(documentReference);

    if (docSnap.exists()) {
      return docSnap.data(); // Devuelve todo el JSON con el nombre, ciudad, etc.
    } else {
      return null;
    }
  }
}
