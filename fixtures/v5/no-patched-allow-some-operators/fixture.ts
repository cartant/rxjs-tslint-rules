import { Subject } from "rxjs/Subject";

const subject = new Subject<number>();
const mapped = subject.filter(Boolean).map((value) => value + 1);
