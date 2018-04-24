import { AsyncSubject, Subscription } from "rxjs";

const subscription = new Subscription();
const subject = new AsyncSubject<number>();
subscription.add(subject);
