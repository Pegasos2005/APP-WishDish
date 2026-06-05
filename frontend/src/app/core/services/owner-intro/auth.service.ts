import { Injectable } from '@angular/core';
// v--- ({RecaptchaVerifier, signInWithPhoneNumber, linkWithPhoneNumber} Estos son para el servicio móvil) ---v
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, RecaptchaVerifier, signInWithPhoneNumber, linkWithPhoneNumber } from '@angular/fire/auth';
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

  // =============== Login x móvil ================
  // --- NUEVA FUNCIÓN PARA VINCULACIÓN EN EL REGISTRO ---
  linkPhoneToAccount(phoneNumber: string, appVerifier: any) {
    // Cogemos al usuario que se acaba de crear (y que Firebase ha logueado automáticamente)
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return Promise.reject(new Error('No hay usuario logueado para vincular.'));
    }
    // Fusionamos su cuenta con este número de teléfono
    return linkWithPhoneNumber(currentUser, phoneNumber, appVerifier);
  }

  // 1. Inicializa el escudo invisible anti-bots de Google
  setupRecaptcha(containerId: string) {
    return new RecaptchaVerifier(this.auth, containerId, {
      size: 'invisible' // Lo hacemos invisible para no afear tu diseño
    });
  }

  // 2. Envía el SMS al teléfono
  sendSmsCode(phoneNumber: string, appVerifier: any) {
    // Es vital que el número lleve el prefijo internacional (ej: +34 para España)
    return signInWithPhoneNumber(this.auth, phoneNumber, appVerifier);
  }
  // ==============================================

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
