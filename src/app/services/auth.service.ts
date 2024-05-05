import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseAuth: AngularFireAuth) { }

  async register(email: string, password: string) {
      return await this.firebaseAuth.createUserWithEmailAndPassword(email, password).catch(error => alert(error.message));
  }

  async login(email: string, password: string) {
    return await this.firebaseAuth.signInWithEmailAndPassword(email, password).catch(error => alert(error.message));
  }

  async loginWithGoogle() {
    return await this.firebaseAuth.signInWithPopup(new GoogleAuthProvider()).catch(error => alert(error.message));
  }

  async updatePassword(newPassword: string) {
    const user = await this.firebaseAuth.currentUser;
    if (user) {
      return user.updatePassword(newPassword);
    } else {
      throw new Error('No user logged in.');
    }
  }

  async logout() {
    await this.firebaseAuth.signOut();
  }
}
