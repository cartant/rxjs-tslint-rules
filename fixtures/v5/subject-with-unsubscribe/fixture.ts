import { Subject } from "rxjs/Subject";

const subject = new Subject<number>();
subject.unsubscribe();
