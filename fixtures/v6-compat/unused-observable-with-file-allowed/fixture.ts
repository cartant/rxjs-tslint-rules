import { Observable } from "rxjs/Observable";

const ob1 = Observable.of(1).map((value) => value + 1);

const ob2 = Observable.of(2);
ob2.filter((value) => value > 1);

function ob3(): Observable<number> {
    return Observable.of(3);
}
ob3().filter((value) => value > 1);

class Thing {

    public ob4 = Observable.of(4);

    get ob5(): Observable<number> {
        return Observable.of(5);
    }

    ob6(): Observable<number> {
        return Observable.of(6);
    }
};

const thing = new Thing();
thing.ob4.filter((value) => value > 1);
thing.ob5.filter((value) => value > 1);
thing.ob6().filter((value) => value > 1);

const array = [Observable.of(7)];
array[0].filter((value) => value > 1);

const OtherObservable = Observable;
const ob8 = OtherObservable.of(8);

const OtherObservables = [Observable];
const ob9 = OtherObservables[0].of(9);
