import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

const subscription = new Subscription();
const subject = new Subject<number>();
subscription.add(subject);
