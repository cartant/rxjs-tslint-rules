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

    npm install rxjs-tslint-rules --save

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