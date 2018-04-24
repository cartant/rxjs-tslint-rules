import { Observable, of } from "rxjs";

const observable = of([1, 2]);
observable.subscribe(value => console.log(value));
