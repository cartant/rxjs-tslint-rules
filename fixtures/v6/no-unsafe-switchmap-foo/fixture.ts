import { EMPTY, Observable, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
}

type Actions = Observable<any>;
const actions = of({});

const fooEffect = actions.pipe(ofType("FOO"), tap(() => {}), switchMap(() => EMPTY));
const barEffect = actions.pipe(ofType("BAR"), tap(() => {}), switchMap(() => EMPTY));
const bazEffect = actions.pipe(ofType("BAZ"), tap(() => {}), switchMap(() => EMPTY));
