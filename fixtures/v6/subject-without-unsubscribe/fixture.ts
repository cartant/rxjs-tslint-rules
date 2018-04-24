import { Subject } from "rxjs";

const subject = new Subject<number>();
const subscription = subject.subscribe();
subscription.unsubscribe();
