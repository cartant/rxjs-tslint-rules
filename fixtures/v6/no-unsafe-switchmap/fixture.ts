import { EMPTY, Observable, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
}

type Actions = Observable<any>;
const actions = of({});
const action$ = of({});

const GET_SOMETHING = "GET_SOMETHING";
const PUT_SOMETHING = "PUT_SOMETHING";
const GetSomething = GET_SOMETHING;
const PutSomething = PUT_SOMETHING;

const pipedGetEffect = actions.pipe(ofType("GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
const pipedPutEffect = actions.pipe(ofType("PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));

const pipedMoreGetEffect = actions.pipe(ofType("DO_SOMETHING", "GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
const pipedMorePutEffect = actions.pipe(ofType("DO_SOMETHING", "PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));

const pipedGetEpic = (action$: Actions) => action$.pipe(ofType("GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
const pipedPutEpic = (action$: Actions) => action$.pipe(ofType("PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));

const pipedMoreGetEpic = (action$: Actions) => action$.pipe(ofType("DO_SOMETHING", "GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
const pipedMorePutEpic = (action$: Actions) => action$.pipe(ofType("DO_SOMETHING", "PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));

const pipedSymbolGetEffect = actions.pipe(ofType(GET_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
const pipedSymbolPutEffect = actions.pipe(ofType(PUT_SOMETHING), tap(() => {}), switchMap(() => EMPTY));

const pipedOfTypeCamelCaseGetEffect = actions.pipe(ofType(GetSomething), tap(() => {}), switchMap(() => EMPTY));
const pipedOfTypeCamelCasePutEffect = actions.pipe(ofType(PutSomething), tap(() => {}), switchMap(() => EMPTY));
