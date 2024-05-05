import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Restaurant} from "../model/restaurant";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {switchMap} from "rxjs/operators";
import {from} from "rxjs";
import {Review} from "../model/review";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  restaurantCollection: AngularFirestoreCollection<Restaurant>;
  reviewCollection: AngularFirestoreCollection<Review>;
  constructor(private afs: AngularFirestore, private photoStorage: AngularFireStorage) {
    this.restaurantCollection = this.afs.collection<Restaurant>('restaurants');
    this.reviewCollection = this.afs.collection<Review>('reviews');
  }

  async getRestaurantByOwnerId(ownerId: string): Promise<Restaurant | null> {
    const snapshot = await this.restaurantCollection.ref.where('ownerId', '==', ownerId).get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return <Restaurant>doc.data();
    } else {
      return null;
    }
  }

  async getRestaurantByName(name: string): Promise<Restaurant | null> {
    const snapshot = await this.restaurantCollection.ref.where('name', '==', name).get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return <Restaurant>doc.data();
    } else {
      return null;
    }
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    const snapshot = await this.restaurantCollection.ref.get();
    return snapshot.docs.map(doc => <Restaurant>doc.data());
  }

  uploadFile(file: File, filePath: string) {
    const task = this.photoStorage.upload(filePath, file);
    return from(task).pipe(
      switchMap(() => this.photoStorage.ref(filePath).getDownloadURL())
    );
  }

  async saveRestaurant(restaurant: Restaurant) {
    await this.restaurantCollection.add(restaurant);
  }

  async updateRestaurantRating(restaurantName: string): Promise<void> {
    const snapshot = await this.restaurantCollection.ref.where('name', '==', restaurantName).get();
    if (!snapshot.empty) {
      const restaurantDoc = snapshot.docs[0];

      const reviewsSnapshot = await this.reviewCollection.ref.where('restaurant', '==', restaurantName).get();
      let totalRating: number = 0;
      reviewsSnapshot.docs.forEach(doc => {
        const review = <Review>doc.data();
        const numericRating = Number(review.rating);
        totalRating += numericRating;
      });
      const numberOfRatings = reviewsSnapshot.size;
      const averageRating = totalRating / numberOfRatings;

      await this.restaurantCollection.doc(restaurantDoc.id).update({
        rating: Math.round(averageRating),
        numberOfRatings: numberOfRatings
      });
    }
  }

  async getReviewsForRestaurant(restaurantName: string): Promise<Review[] | null> {
    const snapshot = await this.reviewCollection.ref.where('restaurant', '==', restaurantName).get();
    if (!snapshot.empty) {
      let reviews: Review[] = [];
      const doc = snapshot.docs;
      doc.forEach(review => {
        reviews.push(review.data() as Review);
      })
      return reviews;
    } else {
      return null;
    }
  }

  async getReviewsForAuthor(authorId: string): Promise<Review[] | null> {
    const snapshot = await this.reviewCollection.ref.where('authorId', '==', authorId).get();
    if (!snapshot.empty) {
      let reviews: Review[] = [];
      const doc = snapshot.docs;
      doc.forEach(review => {
        reviews.push(review.data() as Review);
      })
      return reviews;
    } else {
      return null;
    }
  }

  async submitReview(review: Review): Promise<void> {
    await this.reviewCollection.add(review);
    await this.updateRestaurantRating(review.restaurant);
  }
}
