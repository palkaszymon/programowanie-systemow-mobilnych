import { Injectable } from '@angular/core';
import {User} from "../model/user";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  usersCollection: AngularFirestoreCollection<User>;
  currentUser: User | null = null;
  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.usersCollection = this.afs.collection<User>('users');
  }

  addUser(newUser: User): void {
    this.usersCollection.add(newUser).catch(error => console.error(error));
  }

  async getUserById(userId: string): Promise<User | null> {
    const snapshot = await this.usersCollection.ref.where('userId', '==', userId).get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return <User>doc.data();
    } else {
      return null;
    }
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      return JSON.parse(currentUserJson);
    } else {
      return null;
    }
  }

  async logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    await this.authService.logout();
  }
}
