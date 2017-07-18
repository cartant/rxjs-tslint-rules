import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";

const ob = Observable.of(1).do((value) => console.log(value));
