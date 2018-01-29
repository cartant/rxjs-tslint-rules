import { of } from "rxjs/Observable/of";

const observable = of([1, 2]);
observable.subscribe(value => console.log(value));
