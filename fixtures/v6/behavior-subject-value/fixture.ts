import { BehaviorSubject } from "rxjs";

const subject = new BehaviorSubject<number>(1);
console.log(subject.value);
console.log(subject.getValue());
