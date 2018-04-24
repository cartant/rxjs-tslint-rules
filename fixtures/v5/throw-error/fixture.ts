import { Observable } from "rxjs";
import { _throw } from "rxjs/observable/throw";
import "rxjs/add/observable/throw";

const ob1 = Observable.throw("Boom!");
const ob2 = Observable.throw(new Error("Boom!"));
const ob3 = _throw("Boom!");
const ob4 = _throw(new Error("Boom!"));
