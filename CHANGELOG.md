<a name="2.1.2"></a>
## [2.1.2](https://github.com/cartant/rxjs-tslint-rules/compare/v2.1.0...v2.1.2) (2017-07-19)

### Non-breaking Changes

* **rxjs-add:** Skip `.d.ts` files when looking for unused imports with the `file` option ([ba18815](https://github.com/cartant/rxjs-tslint-rules/commit/ba18815))

<a name="2.1.0"></a>
## [2.1.0](https://github.com/cartant/rxjs-tslint-rules/compare/v2.0.0...v2.1.0) (2017-07-18)

### Features

* **rxjs-no-do:** Add `rxjs-no-do` rule ([1d7b352](https://github.com/cartant/rxjs-tslint-rules/commit/1d7b352))

<a name="2.0.0"></a>
## [2.0.0](https://github.com/cartant/rxjs-tslint-rules/compare/v1.4.0...v2.0.0) (2017-07-18)

### Features

* **rxjs-add options:** Add `allowElsewhere` and `allowUnused` options for the `rxjs-add` rule ([98a65f4](https://github.com/cartant/rxjs-tslint-rules/commit/98a65f4))

### Breaking Changes

* The `allowElsewhere` and `allowUnused` options for the `rxjs-add` rule default to `false`, so configurations that specified the `file` option for `rxjs-add` might see errors effected if patched observables or operators are imported outside of the file, or if there are unused imports. For behaviour identical to the previous version, configure both options as `true`.

<a name="1.4.0"></a>
## [1.4.0](https://github.com/cartant/rxjs-tslint-rules/compare/v1.3.0...v1.4.0) (2017-07-17)

### Features

* **rxjs-no-wholesale:** Deprecate and replace `rxjs-prefer-add` with `rxjs-no-wholesale` (which makes more sense when used in conjunction with `rxjs-no-add`) ([e6648e5](https://github.com/cartant/rxjs-tslint-rules/commit/e6648e5))

<a name="1.3.0"></a>
## [1.3.0](https://github.com/cartant/rxjs-tslint-rules/compare/v1.2.0...v1.3.0) (2017-07-15)

### Features

* **rxjs-no-patched:** Add the rule ([c9b7405](https://github.com/cartant/rxjs-tslint-rules/commit/c9b7405))

<a name="1.2.0"></a>
## [1.2.0](https://github.com/cartant/rxjs-tslint-rules/compare/v1.1.0...v1.2.0) (2017-07-15)

### Features

* **rxjs-no-subject-unsubscribe:** Add the rule ([acc1885](https://github.com/cartant/rxjs-tslint-rules/commit/acc1885))

<a name="1.1.0"></a>
## [1.1.0](https://github.com/cartant/rxjs-tslint-rules/compare/v1.0.5...v1.1.0) (2017-05-30)

### Features

* **rxjs-add:** Add the file option ([3743ccd](https://github.com/cartant/rxjs-tslint-rules/commit/3743ccd))

<a name="1.0.5"></a>
## [1.0.5](https://github.com/cartant/rxjs-tslint-rules/compare/v1.0.4...v1.0.5) (2017-05-26)

### Bug Fixes

* **base types:** Account for reference types in base types ([f9eb8a2](https://github.com/cartant/rxjs-tslint-rules/commit/f9eb8a2))

<a name="1.0.4"></a>
## [1.0.4](https://github.com/cartant/rxjs-tslint-rules/compare/v1.0.3...v1.0.4) (2017-05-06)

### Doc

* **gotcha:** Document `Observable.create` gotcha ([4be98ab](https://github.com/cartant/rxjs-tslint-rules/commit/4be98ab))

### Test

* **rxjs-no-unused-add:** Add `Observable.create` fixture ([56a8af0](https://github.com/cartant/rxjs-tslint-rules/commit/56a8af0))

<a name="1.0.3"></a>
## [1.0.3](https://github.com/cartant/rxjs-tslint-rules/compare/v1.0.2...v1.0.3) (2017-05-05)

### Bug Fixes

* **messages:** Clarify failure messages ([03d8ae8](https://github.com/cartant/rxjs-tslint-rules/commit/03d8ae8))

<a name="1.0.2"></a>
## [1.0.2](https://github.com/cartant/rxjs-tslint-rules/compare/v1.0.0...v1.0.2) (2017-05-05)

### Build

* **build:** Add missing dependency ([08212e0](https://github.com/cartant/rxjs-tslint-rules/commit/08212e0))
* **NPM:** Ignore fixtures ([b818b39](https://github.com/cartant/rxjs-tslint-rules/commit/b818b39))
* **build:** Add missing dependency ([ffebed2](https://github.com/cartant/rxjs-tslint-rules/commit/ffebed2))