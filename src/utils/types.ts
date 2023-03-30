export interface Schema<T> {
  _id?: T;
}

export interface Appointment<T = undefined> extends Schema<T> {
  _id?: T;
  customerId: string;
  hairdresserId: string;
  startTime: number;
  endTime: number;
  service: string;
  comments: string;
  price: number;
  stString?: string; // start time as string
  etString?: string; // end time as string
}

export interface Review<T = undefined> extends Schema<T> {
  _id?: T;
  posterId: string;
  hairdresserId: string;
  // appointmentId: string;
  body: string;
  rating: number;
}

export interface User<T = undefined> extends Schema<T> {
  _id?: T;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  appointmentIds: Array<string>;
  reviewIds: Array<string>;
  job: string;
  biography: string;
  level: string;
}

export interface Discount<T = undefined> extends Schema<T> {
  _id?: T;
  name: string;
  amount: number;
}

export interface LoginAttempt {
  email: string;
  password: string; // Note: This password is NOT hashed. It is hashed when it is stored in the DB.
}
