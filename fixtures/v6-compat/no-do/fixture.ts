import { Observable } from "rxjs/Observable";
import { _do } from "rxjs/operator/do";
import { _do as doAlias } from "rxjs/operator/do";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";

const ob = Observable.of(1).do((value) => console.log(value));
const done = _do.call(ob, (value) => console.log(value));
const redone = _doAlias.call(done, (value) => console.log(value));
