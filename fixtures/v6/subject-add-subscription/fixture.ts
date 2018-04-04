import { Subject, Subscription } from "rxjs";

const subscription = new Subscription();
const subject = new Subject<number>();
subscription.add(subject);
