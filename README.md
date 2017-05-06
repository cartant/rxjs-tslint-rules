# rxjs-tslint-rules

[![NPM version](https://img.shields.io/npm/v/rxjs-tslint-rules.svg)](https://www.npmjs.com/package/rxjs-tslint-rules)
[![Build status](https://img.shields.io/travis/cartant/rxjs-tslint-rules.svg)](http://travis-ci.org/cartant/rxjs-tslint-rules)
[![dependency status](https://img.shields.io/david/cartant/rxjs-tslint-rules.svg)](https://david-dm.org/cartant/rxjs-tslint-rules)
[![devDependency Status](https://img.shields.io/david/dev/cartant/rxjs-tslint-rules.svg)](https://david-dm.org/cartant/rxjs-tslint-rules#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/rxjs-tslint-rules.svg)](https://david-dm.org/cartant/rxjs-tslint-rules#info=peerDependencies)

### What is it?

`rxjs-tslint-rules` is small set of TSLint rules to help manage projects that use `rxjs/add/...` imports.

### Why might I need it?

When using imports that patch `Observable`:

```ts
import { Observable } from "rxjs/Observable";
import from "rxjs/add/observable/of";
import from "rxjs/add/operator/map";
```

TypeScript will see the merged declarations in all modules, making it difficult to find `rxjs/add/...` imports that are missing from modules in which patched observables and operators are used.

This can cause problems, as whether or not `Observable` is patched then depends upon the order in which the modules are executed.

The rules in this package can be used to highlight missing - or unused - imports.

## Install

Install the package using NPM:

    npm install rxjs-tslint-rules --save-dev

Update your `tslint.json` file to extend this package:

```json
{
  "extends": [
    "rxjs-tslint-rules"
  ],
  "rules": {
    "rxjs-add": { "severity": "error" },
    "rxjs-no-unused-add": { "severity": "error" }
  }
}
```

The package includes the following rules:

| Rule | Description |
| --- | --- |
| `rxjs-add` | Enforces the importation of patched observables or operators used in the module. |
| `rxjs-no-add` | Disallows the importation of patched observables and operators. |
| `rxjs-no-unused-add` | Disallows the importation of patched observables or operators that are not used in the module. |
| `rxjs-prefer-add` | Disallows the importation of `rxjs` or `rxjs/Rx`. |

## Gotchas

### `Observable.create`

`Observable.create` is [declared as a `Function`](https://github.com/ReactiveX/rxjs/blob/5.3.1/src/Observable.ts#L46-L58), which means that its return type is `any`. This results in an observable that's not seen by the rules, as they use TypeScript's [TypeChecker](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker) to determine whether or not a call involves an observable.

The rule implementations include no special handling for this case, so if spurious errors are effected due to `Observable.create`, explicit typing can resolve them. For example:

```ts
const ob: Observable<number> = Observable.create((observer: Observer<number>) => { ...
```