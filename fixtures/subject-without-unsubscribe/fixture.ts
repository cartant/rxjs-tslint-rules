import { Subject } from "rxjs/Subject";

const subject = new Subject<number>();
const subscription = subject.subscribe();
subscription.unsubscribe();
