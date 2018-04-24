import { Subject } from "rxjs";

const subject = new Subject<number>();
subject.unsubscribe();
