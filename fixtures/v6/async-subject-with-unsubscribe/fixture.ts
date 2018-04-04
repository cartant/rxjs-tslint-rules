import { AsyncSubject } from "rxjs";

const subject = new AsyncSubject<number>();
subject.unsubscribe();
