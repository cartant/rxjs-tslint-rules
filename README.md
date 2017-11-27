# rxjs-tslint-rules

[![NPM version](https://img.shields.io/npm/v/rxjs-tslint-rules.svg)](https://www.npmjs.com/package/rxjs-tslint-rules)
[![Build status](https://img.shields.io/travis/cartant/rxjs-tslint-rules.svg)](http://travis-ci.org/cartant/rxjs-tslint-rules)
[![dependency status](https://img.shields.io/david/cartant/rxjs-tslint-rules.svg)](https://david-dm.org/cartant/rxjs-tslint-rules)
[![devDependency Status](https://img.shields.io/david/dev/cartant/rxjs-tslint-rules.svg)](https://david-dm.org/cartant/rxjs-tslint-rules#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/rxjs-tslint-rules.svg)](https://david-dm.org/cartant/rxjs-tslint-rules#info=peerDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/cartant/rxjs-tslint-rules.svg)](https://greenkeeper.io/)

### What is it?

`rxjs-tslint-rules` is small set of TSLint rules to help manage projects that use `rxjs/add/...` imports and to highlight other potential problems.

### Why might you need it?

When using imports that patch `Observable`:

```ts
import { Observable } from "rxjs/Observable";
import from "rxjs/add/observable/of";
import from "rxjs/add/operator/map";
```

TypeScript will see the merged declarations in all modules, making it difficult to find `rxjs/add/...` imports that are missing from modules in which patched observables and operators are used.

This can cause problems, as whether or not `Observable` is patched then depends upon the order in which the modules are executed.

The rules in this package can be used to highlight missing - or unused - imports and other potential problems with RxJS.

There are some examples of policies that can be implemented using particular rule combinations in:

* [Managing RxJS Imports with TSLint](https://medium.com/@cartant/managing-rxjs-imports-with-tslint-828cdc66b5ee); and
* [Understanding Lettable Operators](https://blog.angularindepth.com/rxjs-understanding-lettable-operators-fe74dda186d3).

And [Christian Liebel](https://github.com/chliebel) has written about his approach to importing RxJS in his blog post:

* [Angular & TypeScript: How to Import RxJS Correctly?](https://christianliebel.com/2017/07/import-rxjs-correctly/)

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

### Rules

The package includes the following rules:

| Rule | Description | Options |
| --- | --- | --- |
| `rxjs-add` | Enforces the importation of patched observables and operators used in the module. | See below |
| `rxjs-no-add` | Disallows the importation of patched observables and operators. | None |
| `rxjs-no-create` | Disallows the calling of `Observable.create`. | None |
| `rxjs-no-do` | I do without `do` operators. [Do you not?](https://youtu.be/spG-Yj0zEyc) | None |
| `rxjs-no-operator` | Disallows importation from the `operator` directory. Useful if you prefer ['lettable' operators](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md) - which are located in the `operators` directory. | None |
| `rxjs-no-patched` | Disallows the calling of patched methods. Methods must be imported and called explicitly - not via `Observable` or `Observable.prototype`. | See below |
| `rxjs-no-subject-unsubscribe` | Disallows the calling of `unsubscribe` directly upon `Subject` instances. For an explanation of why this can be a problem, see [this](https://stackoverflow.com/a/45112125/6680611) Stack Overflow answer. | None |
| `rxjs-no-unused-add` | Disallows the importation of patched observables or operators that are not used in the module. | None |
| `rxjs-no-wholesale` | Disallows the wholesale importation of `rxjs` or `rxjs/Rx`. | None |

### Options

#### `rxjs-add`

The `rxjs-add` rule takes an optional object with the property `file`. This is the path of the module - relative to the `tsconfig.json` - that imports the patched observables and operators.

For example:

```json
"rules": {
  "rxjs-add": {
    "options": [{
      "allowElsewhere": false,
      "allowUnused": false,
      "file": "./source/rxjs-imports.ts"
    }],
    "severity": "error"
  }
}
```

Specifying the `file` option allows all of the patched observables and operators to be kept in a central location. Said module should be imported before other modules that use patched observables and operators. The importation of said module is not enforced; the rule only ensures that it imports observables and operators that are used in other modules.

If `file` is specified, the `allowElsewhere` and `allowUnused` options can be used to configure whether or not patched imports are allowed in other files and whether or not unused patched imports are allowed. Both `allowElsewhere` and `allowUnused` default to `false`.

Note that there is no `file` option for the `rxjs-no-unused-add` rule, so that rule should not be used in conjunction with the `rxjs-add` rule - if the `file` option is specified for the latter. Use the `rxjs-add` rule's `allowUnused` option instead.

If the `file` option is not specified, patched observables and operators must be imported in the modules in which they are used.

#### `rxjs-no-patched`

The `rxjs-no-patched` rule takes an optional object with the optional properties `allowObservables` and `allowOperators`. The properties can be specified as booleans - to allow or disallow all observables or operators - or as arrays of strings - to allow or disallow a subset of observables or operators.

For example:

```json
"rules": {
  "rxjs-no-patched": {
    "options": [{
      "allowObservables": ["never", "throw"],
      "allowOperators": false
    }],
    "severity": "error"
  }
}
```

## Gotchas

### `@angular/cli`

Angular's CLI runs TSLint three times:

* first, with application files from `src/` (using `src/tsconfig.app.json`);
* then with the test files from `src/` (using `src/tsconfig.spec.json`);
* and, finally, with files from `e2e/` (using `e2e/tsconfig.e2e.json`).

If you are using the `file` option of the `rxjs-add` rule to ensure patched observables and operators are kept in a central location, there are some configuration changes that you should make:

* I'd recommend switching off `rxjs-add` for the `e2e` linting, as the central file isn't necessary or appropriate. The simplest way to do this is to create an `e2e/tslint.json` file with the following content:

        {
          "extends": ["../tslint.json"],
          "rules": {
            "rxjs-add": { "severity": "off" }
          }
        }

* And, for the test linting, I'd recommend adding the central file to the TypeScript configuration. If the central file is, say, `src/rxjs.imports.ts`, add that file to the `"files"` in `src/tsconfig.spec.json`:

        "files": [
          "rxjs.imports.ts",
          "test.ts"
        ]

    Alternatively, you can import `rxjs.imports.ts` directly into `tests.ts`, like this:

        import "./rxjs.imports";

With these changes, the rule should play nice with the CLI's running of TSLint. If you are using `"allowUnused": false` and receive errors about unused operators, you should make sure that files in which those operators are used are imported into at least one test. (The rule will walk **all files** included in the TypeScript program - not just the specs - so if an unused error is effected, the file using the unused operator is not present in the program and needs to be imported into a test.)

If you experience difficulties in configuring the rules with an `@angular/cli`-generated application, there is an example in this repo of a working configuration. To see the configuration changes that were made to a vanilla CLI application, have a look at [this commit](https://github.com/cartant/rxjs-tslint-rules/commit/73872cc381765d2fcc9fc22cb686128b76dfd6fb).

### `Observable.create`

`Observable.create` is [declared as a `Function`](https://github.com/ReactiveX/rxjs/blob/5.3.1/src/Observable.ts#L46-L58), which means that its return type is `any`. This results in an observable that's not seen by the rules, as they use TypeScript's [TypeChecker](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker) to determine whether or not a call involves an observable.

The rule implementations include no special handling for this case, so if spurious errors are effected due to `Observable.create`, explicit typing can resolve them. For example:

```ts
const ob: Observable<number> = Observable.create((observer: Observer<number>) => { ...
```