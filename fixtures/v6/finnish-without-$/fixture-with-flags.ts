import { Observable, of } from "rxjs";

const someObservable = of(0);

const someEmptyObject = {};
/*tslint:disable-next-line:rxjs-finnish*/
const someObject = { ...someEmptyObject, someKey: someObservable };
/*tslint:disable-next-line:rxjs-finnish*/
const { someKey } = someObject;
/*tslint:disable-next-line:rxjs-finnish*/
const { someKey: someRenamedKey } = someObject;

const someArray = [someObservable];
/*tslint:disable-next-line:rxjs-finnish*/
const [someElement] = someArray;
/*tslint:disable-next-line:rxjs-finnish*/
someArray.forEach(function (element: Observable<any>): void {});
/*tslint:disable-next-line:rxjs-finnish*/
someArray.forEach((element: Observable<any>) => {});

/*tslint:disable-next-line:rxjs-finnish*/
function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }

class SomeClass {
    /*tslint:disable-next-line:rxjs-finnish*/
    someProperty: Observable<any>;
    /*tslint:disable-next-line:rxjs-finnish*/
    constructor (someParam: Observable<any>) {}
    /*tslint:disable-next-line:rxjs-finnish*/
    get someGetter(): Observable<any> { throw new Error("Some error."); }
    /*tslint:disable-next-line:rxjs-finnish*/
    set someSetter(someParam: Observable<any>) {}
    /*tslint:disable-next-line:rxjs-finnish*/
    someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
}

interface SomeInterface {
    /*tslint:disable-next-line:rxjs-finnish*/
    someProperty: Observable<any>;
    /*tslint:disable-next-line:rxjs-finnish*/
    someMethod(someParam: Observable<any>): Observable<any>;
}
