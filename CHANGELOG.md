<a name="3.2.1"></a>
## [3.2.1](https://github.com/cartant/rxjs-tslint-rules/compare/v3.2.1...v3.2.1) (2017-11-27)

### Documentation

* Fix copy/paste errors in README.

<a name="3.2.0"></a>
## [3.2.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.1.3...v3.2.0) (2017-11-27)

### Features

* Add options for the `rxjs-no-patched` rule. ([b9af023](https://github.com/cartant/rxjs-tslint-rules/commit/b9af023))

<a name="3.1.3"></a>
## [3.1.3](https://github.com/cartant/rxjs-tslint-rules/compare/v3.1.2...v3.1.3) (2017-11-27)

### Bug Fixes

* Support the `flatMap` alias for `mergeMap`. ([40169e8](https://github.com/cartant/rxjs-tslint-rules/commit/40169e8))

<a name="3.1.2"></a>
## [3.1.2](https://github.com/cartant/rxjs-tslint-rules/compare/v3.1.1...v3.1.2) (2017-11-23)

### Bug Fixes

* Don't throw an error if `rxjs` cannot be found in `node_modules` - it's possible a common rule set might be used with a project that does not depend upon RxJS. ([17a5e61](https://github.com/cartant/rxjs-tslint-rules/commit/17a5e61))

<a name="3.1.1"></a>
## [3.1.1](https://github.com/cartant/rxjs-tslint-rules/compare/v3.1.0...v3.1.1) (2017-11-17)

### Bug Fixes

* Add `tslib` as a dependency; it was used, but was missing from the `package.json`.

<a name="3.1.0"></a>
## [3.1.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.0.4...v3.1.0) (2017-11-11)

### Features

* **rxjs-no-create:** Add a rule to forbid the calling of `Observable.create`. ([f025106](https://github.com/cartant/rxjs-tslint-rules/commit/f025106))

<a name="3.0.4"></a>
## [3.0.4](https://github.com/cartant/rxjs-tslint-rules/compare/v3.0.3...v3.0.4) (2017-11-01)

### Documentation

* Trivial documentation changes.

<a name="3.0.3"></a>
## [3.0.3](https://github.com/cartant/rxjs-tslint-rules/compare/v3.0.2...v3.0.3) (2017-10-07)

### Bug Fixes

* **rxjs-no-unused-add:** Consider only known, added imports - as `toPromise` is moving to `Observable.prototype` and will have a no-op import. ([2489a13](https://github.com/cartant/rxjs-tslint-rules/commit/2489a13))

<a name="3.0.2"></a>
## [3.0.2](https://github.com/cartant/rxjs-tslint-rules/compare/v3.0.1...v3.0.2) (2017-10-06)

### Bug Fixes

* **knowns:** Support 5.5.0-beta.5's move of `toPromise` to `Observable.prototype`. ([8641a1b](https://github.com/cartant/rxjs-tslint-rules/commit/8641a1b))

<a name="3.0.1"></a>
## [3.0.1](https://github.com/cartant/rxjs-tslint-rules/compare/v3.0.0...v3.0.1) (2017-09-23)

### Bug Fixes

* **knowns:** Support 5.5.0-beta.0. ([cdcad3a](https://github.com/cartant/rxjs-tslint-rules/commit/cdcad3a))

<a name="3.0.0"></a>
## [3.0.0](https://github.com/cartant/rxjs-tslint-rules/compare/v2.1.7...v3.0.0) (2017-09-23)

### Breaking Changes

* The list of known observables and operators is now compiled by reading the file names from disk. That means that RxJS is now a required peer dependency. It's unlikely that this will be a breaking change for most projects, as I'd expect RxJS to already be present in projects that are using these rules.

### Features

* **rxjs-no-operator:** Add a rule to forbid the importation of [non-'lettable' operators](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md). ([392f995](https://github.com/cartant/rxjs-tslint-rules/commit/392f995))

<a name="2.1.7"></a>
## [2.1.7](https://github.com/cartant/rxjs-tslint-rules/compare/v2.1.6...v2.1.7) (2017-09-16)

### Documentation

* Add notes on gotchas with `@angular/cli`.

<a name="2.1.6"></a>
## [2.1.6](https://github.com/cartant/rxjs-tslint-rules/compare/v2.1.5...v2.1.6) (2017-09-06)

### Bug Fixes

* **knowns:** Use `hasOwnProperty` when checking known observables and operators ([88e4ef7](https://github.com/cartant/rxjs-tslint-rules/commit/88e4ef7))

<a name="2.1.5"></a>
## [2.1.5](https://github.com/cartant/rxjs-tslint-rules/compare/v2.1.4...v2.1.5) (2017-09-05)

### Bug Fixes

* **knowns:** Add missing observables and operators ([051b8a0](https://github.com/cartant/rxjs-tslint-rules/commit/051b8a0))

<a name="2.1.4"></a>
## [2.1.4](https://github.com/cartant/rxjs-tslint-rules/compare/v2.1.3...v2.1.4) (2017-08-23)

### Non-breaking Changes

* **rxjs-add:** Improve error message relating to central imports file not being found ([5b12ee6](https://github.com/cartant/rxjs-tslint-rules/commit/5b12ee6))

<a name="2.1.3"></a>
## [2.1.3](https://github.com/cartant/rxjs-tslint-rules/compare/v2.1.2...v2.1.3) (2017-07-21)

### Documentation

* Trivial documentation changes.

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