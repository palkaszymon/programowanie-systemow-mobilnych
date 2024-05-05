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
    const task = this.photoStorage.upload(filePath, file)
    return from(task).pipe(
      switchMap(() => this.photoStorage.ref(filePath).getDownloadURL())
    );
  }

  async saveRestaurant(restaurant: Restaurant) {
    await this.restaurantCollection.add(restaurant);
  }

  async updateRestaurantRating(review: Review): Promise<void> {
    const snapshot = await this.restaurantCollection.ref.where('name', '==', review.restaurant).get();
    if (!snapshot.empty) {
      const restaurantDoc = snapshot.docs[0];
      const restaurant = <Restaurant> restaurantDoc.data();
      let numberOfRatings = restaurant.numberOfRatings + 1;
      let averageRating = ((restaurant.rating * restaurant.numberOfRatings) + Number(review.rating)) / (numberOfRatings);
      return await this.restaurantCollection.doc(restaurantDoc.id).update({
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
        let fetchedReview = review.data() as Review;
        fetchedReview.reviewId = review.id;
        reviews.push(fetchedReview);
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
        let fetchedReview = review.data() as Review;
        fetchedReview.reviewId = review.id;
        reviews.push(fetchedReview);
      })
      return reviews;
    } else {
      return null;
    }
  }

  async updateReviewPhotoLink(reviewId: string, reviewPhotoPath: string) {
    await this.reviewCollection.doc(reviewId).update({
      reviewPhoto: reviewPhotoPath
    });
  }

  async submitReview(review: Review): Promise<string> {
    return this.reviewCollection.add(review).then(reviewDocument => {
      this.updateRestaurantRating(review);
      return reviewDocument.id;
      }
    );
  }
}
