import { AsyncSubject } from "rxjs/AsyncSubject";
import { Subscription } from "rxjs/Subscription";

const subscription = new Subscription();
const subject = new AsyncSubject<number>();
subscription.add(subject);
