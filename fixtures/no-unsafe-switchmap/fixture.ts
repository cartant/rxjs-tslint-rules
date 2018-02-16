import { Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";
import "rxjs/add/operator/switchMap";

declare module "rxjs/Observable" {
    interface Observable<T> {
        ofType(type: string, ...moreTypes: string[]): Observable<T>;
    }
}

function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
}

const actions = Observable.of({});
const action$ = Observable.of({});
const empty = Observable.empty() as Observable<never>;

const GET_SOMETHING = "GET_SOMETHING";
const PUT_SOMETHING = "PUT_SOMETHING";

const patchedGetEffect = actions.ofType("GET_SOMETHING").do(() => {}).switchMap(() => empty);
const patchedPutEffect = actions.ofType("PUT_SOMETHING").do(() => {}).switchMap(() => empty);
const pipedGetEffect = actions.ofType("GET_SOMETHING").pipe(tap(() => {}), switchMap(() => empty));
const pipedPutEffect = actions.ofType("PUT_SOMETHING").pipe(tap(() => {}), switchMap(() => empty));

const patchedMoreGetEffect = actions.ofType("DO_SOMETHING", "GET_SOMETHING").do(() => {}).switchMap(() => empty);
const patchedMorePutEffect = actions.ofType("DO_SOMETHING", "PUT_SOMETHING").do(() => {}).switchMap(() => empty);
const pipedMoreGetEffect = actions.ofType("DO_SOMETHING", "GET_SOMETHING").pipe(tap(() => {}), switchMap(() => empty));
const pipedMorePutEffect = actions.ofType("DO_SOMETHING", "PUT_SOMETHING").pipe(tap(() => {}), switchMap(() => empty));

const patchedGetEpic = (action$) => action$.ofType("GET_SOMETHING").do(() => {}).switchMap(() => empty);
const patchedPutEpic = (action$) => action$.ofType("PUT_SOMETHING").do(() => {}).switchMap(() => empty);
const pipedGetEpic = (action$) => action$.ofType("GET_SOMETHING").pipe(tap(() => {}), switchMap(() => empty));
const pipedPutEpic = (action$) => action$.ofType("PUT_SOMETHING").pipe(tap(() => {}), switchMap(() => empty));

const patchedMoreGetEpic = (action$) => action$.ofType("DO_SOMETHING", "GET_SOMETHING").do(() => {}).switchMap(() => empty);
const patchedMorePutEpic = (action$) => action$.ofType("DO_SOMETHING", "PUT_SOMETHING").do(() => {}).switchMap(() => empty);
const pipedMoreGetEpic = (action$) => action$.ofType("DO_SOMETHING", "GET_SOMETHING").pipe(tap(() => {}), switchMap(() => empty));
const pipedMorePutEpic = (action$) => action$.ofType("DO_SOMETHING", "PUT_SOMETHING").pipe(tap(() => {}), switchMap(() => empty));

const patchedSymbolGetEffect = actions.ofType(GET_SOMETHING).do(() => {}).switchMap(() => empty);
const patchedSymbolPutEffect = actions.ofType(PUT_SOMETHING).do(() => {}).switchMap(() => empty);
const pipedSymbolGetEffect = actions.ofType(GET_SOMETHING).pipe(tap(() => {}), switchMap(() => empty));
const pipedSymbolPutEffect = actions.ofType(PUT_SOMETHING).pipe(tap(() => {}), switchMap(() => empty));

const pipedOfTypeGetEffect = actions.pipe(ofType(GET_SOMETHING), tap(() => {}), switchMap(() => empty));
const pipedOfTypePutEffect = actions.pipe(ofType(PUT_SOMETHING), tap(() => {}), switchMap(() => empty));
