import { AsyncSubject } from "rxjs/AsyncSubject";

const subject = new AsyncSubject<number>();
subject.unsubscribe();
