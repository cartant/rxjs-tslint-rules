<a name="4.4.1"></a>
## [4.4.1](https://github.com/cartant/rxjs-tslint-rules/compare/v4.4.0...v4.4.1) (2018-06-04)

## Fixes

* Fixed a non-dev dependency that was added to `devDependencies`.

<a name="4.4.0"></a>
## [4.4.0](https://github.com/cartant/rxjs-tslint-rules/compare/v4.3.1...v4.4.0) (2018-06-03)

## Features

* Add an `rxjs-just` rule. ([a34bd66](https://github.com/cartant/rxjs-tslint-rules/commit/a34bd66))

<a name="4.3.1"></a>
## [4.3.1](https://github.com/cartant/rxjs-tslint-rules/compare/v4.3.0...v4.3.1) (2018-05-31)

## Fixes

* Fixes a problem the `rxjs-finnish` rule had with optional types. ([989c615](https://github.com/cartant/rxjs-tslint-rules/commit/989c615))

<a name="4.3.0"></a>
## [4.3.0](https://github.com/cartant/rxjs-tslint-rules/compare/v4.2.1...v4.3.0) (2018-05-27)

## Features

* Add an `rxjs-no-unsafe-takeuntil` rule. ([80e11e0](https://github.com/cartant/rxjs-tslint-rules/commit/80e11e0))

<a name="4.2.1"></a>
## [4.2.1](https://github.com/cartant/rxjs-tslint-rules/compare/v4.2.0...v4.2.1) (2018-05-19)

## Fixes

* In the `rxjs-throw-error` rule, ignore calls for which a signature is not available. ([deb87de](https://github.com/cartant/rxjs-tslint-rules/commit/deb87de))

<a name="4.2.0"></a>
## [4.2.0](https://github.com/cartant/rxjs-tslint-rules/compare/v4.1.1...v4.2.0) (2018-05-16)

## Features

* Add an `rxjs-no-unsafe-catch` rule for effects and epics. ([b3a3e01](https://github.com/cartant/rxjs-tslint-rules/commit/b3a3e01))

<a name="4.1.1"></a>
## [4.1.1](https://github.com/cartant/rxjs-tslint-rules/compare/v4.1.0...v4.1.1) (2018-05-02)

## Fixes

* Correctly configure the Angular whitelist for `rxjs-finnish` and add Angular interface methods that return `Observable`. ([4f1401e](https://github.com/cartant/rxjs-tslint-rules/commit/4f1401e))

<a name="4.1.0"></a>
## [4.1.0](https://github.com/cartant/rxjs-tslint-rules/compare/v4.0.2...v4.1.0) (2018-05-02)

## Features

* Add whitelist support to `rxjs-finnish` and default to not enforcing Finnish notation for Angular's `EventEmitter`. ([5051876](https://github.com/cartant/rxjs-tslint-rules/commit/5051876))

<a name="4.0.2"></a>
## [4.0.2](https://github.com/cartant/rxjs-tslint-rules/compare/v4.0.1...v4.0.2) (2018-04-30)

## Fixes

* The `rxjs-throw-error` rule now fails for thrown non-errors, as well as non-errors passed to `throw` or `throwError`. ([11158f1](https://github.com/cartant/rxjs-tslint-rules/commit/11158f1))

<a name="4.0.1"></a>
## [4.0.1](https://github.com/cartant/rxjs-tslint-rules/compare/v4.0.0...v4.0.1) (2018-04-30)

## Fixes

* Include ban explanation in failure message. ([5e993fe](https://github.com/cartant/rxjs-tslint-rules/commit/5e993fe))

<a name="4.0.0"></a>
## [4.0.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.17.0...v4.0.0) (2018-04-25)

## Features

* Supports `rxjs` version 5 and 6 and supports the use of `rxjs-compat` with version 6.
* Adds an `rxjs-no-internal` rule.
* Adds an `rxjs-ban-observables` rule.
* Adds an `rxjs-ban-operators` rule.

<a name="3.17.0"></a>
## [3.17.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.16.1...v3.17.0) (2018-04-07)

## Features

* Add options for `rxjs-no-unsafe-scope`. ([43bd486](https://github.com/cartant/rxjs-tslint-rules/commit/43bd486))

<a name="3.16.1"></a>
## [3.16.1](https://github.com/cartant/rxjs-tslint-rules/compare/v3.16.0...v3.16.1) (2018-04-05)

### Fixes

* Fix `tsconfig.json`-based source file discovery when packages within `node_modules` themselves contain `tsconfig.json` files. ([79bc163](https://github.com/cartant/rxjs-tslint-rules/commit/79bc163))

<a name="3.16.0"></a>
## [3.16.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.15.0...v3.16.0) (2018-03-30)

### Features

* Added an `rxjs-no-unsafe-scope` rule to disallow the use of variables/properties in unsafe/outer scopes. ([da22b6d](https://github.com/cartant/rxjs-tslint-rules/commit/da22b6d))

<a name="3.15.0"></a>
## [3.15.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.14.0...v3.15.0) (2018-03-07)

### Features

* Added an `rxjs-throw-error` rule to enforce the passing of `Error` values to `error` notifications. ([26beb0e](https://github.com/cartant/rxjs-tslint-rules/commit/26beb0e))

<a name="3.14.0"></a>
## [3.14.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.13.1...v3.14.0) (2018-02-21)

### Features

* Added an `rxjs-deep-operators` rule to enforce deep operator imports (e.g. `rxjs/operators/map`) for situations in which tree shaking is not available. ([95cc17c](https://github.com/cartant/rxjs-tslint-rules/commit/95cc17c))

<a name="3.13.1"></a>
## [3.13.1](https://github.com/cartant/rxjs-tslint-rules/compare/v3.13.0...v3.13.1) (2018-02-19)

### Docs

* Added a warning regarding TSLint's `no-unused-variable` rule. ([44fa739](https://github.com/cartant/rxjs-tslint-rules/commit/44fa739))

<a name="3.13.0"></a>
## [3.13.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.12.0...v3.13.0) (2018-02-19)

### Features

* Added options for the `rxjs-finnish` rule. ([d249119](https://github.com/cartant/rxjs-tslint-rules/commit/d249119))

<a name="3.12.0"></a>
## [3.12.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.11.1...v3.12.0) (2018-02-18)

### Features

* Added an `observable` option for the `rxjs-no-unsafe-switchmap` rule. ([9bffe6e](https://github.com/cartant/rxjs-tslint-rules/commit/9bffe6e))

<a name="3.11.1"></a>
## [3.11.1](https://github.com/cartant/rxjs-tslint-rules/compare/v3.11.0...v3.11.1) (2018-02-18)

### Fixes

* Support camel-case actions in the `rxjs-no-unsafe-switchmap` rule. ([c1caa8c](https://github.com/cartant/rxjs-tslint-rules/commit/c1caa8c))

<a name="3.11.0"></a>
## [3.11.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.10.0...v3.11.0) (2018-02-17)

### Features

* Added the `rxjs-no-unsafe-switchmap` rule to disallow the use of `switchMap` in effects and epics with actions for which it is likely to be unsafe. See [this tweet](https://mobile.twitter.com/victorsavkin/status/963486303118557185) from Victor Savkin. ([c08d98b](https://github.com/cartant/rxjs-tslint-rules/commit/c08d98b))

<a name="3.10.0"></a>
## [3.10.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.9.0...v3.10.0) (2018-02-16)

### Features

* Added the `rxjs-no-deep-operators` rule to disallow deep imports from `rxjs/operators`. Deep imports will not be available in RxJS v6 and deep imports from `rxjs/operators` can be avoided - in v5.5 - if a tree-shaking bundler is used. ([ada59c0](https://github.com/cartant/rxjs-tslint-rules/commit/ada59c0))

<a name="3.9.0"></a>
## [3.9.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.8.0...v3.9.0) (2018-02-08)

### Features

* Added the `rxjs-no-subject-value` rule to disallow accessing a `BehaviorSubject`'s `value` property. ([9c8f966](https://github.com/cartant/rxjs-tslint-rules/commit/9c8f966))

<a name="3.8.0"></a>
## [3.8.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.7.2...v3.8.0) (2018-02-03)

### Features

* The `rxjs-no-subject-unsubscribe` rule now disallows the adding of a `Subject` to a `Subscription`. ([20b2927](https://github.com/cartant/rxjs-tslint-rules/commit/20b2927))

<a name="3.7.2"></a>
## [3.7.2](https://github.com/cartant/rxjs-tslint-rules/compare/v3.7.1...v3.7.2) (2018-01-30)

### Fixes

* Fixed a bug with the object spread syntax and the `rxjs-finnish` and `rxjs-no-finnish` rules. ([6c6695b](https://github.com/cartant/rxjs-tslint-rules/commit/6c6695b))

<a name="3.7.1"></a>
## [3.7.1](https://github.com/cartant/rxjs-tslint-rules/compare/v3.7.0...v3.7.1) (2018-01-29)

### Fixes

* Fixed the `rxjs-no-ignored-subscribe` tests to account for [this problem](https://github.com/cartant/rxjs-tslint-rules/issues/32). ([b78d76a](https://github.com/cartant/rxjs-tslint-rules/commit/b78d76a))

<a name="3.7.0"></a>
## [3.7.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.6.0...v3.7.0) (2018-01-29)

### Features

* Add `rxjs-no-ignored-subscribe` rule. ([37dd346](https://github.com/cartant/rxjs-tslint-rules/commit/37dd346))

<a name="3.6.0"></a>
## [3.6.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.5.0...v3.6.0) (2018-01-24)

### Features

* Add `rxjs-no-tap` alias for `rxjs-no-do`. ([96babda](https://github.com/cartant/rxjs-tslint-rules/commit/96babda))

<a name="3.5.0"></a>
## [3.5.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.4.2...v3.5.0) (2018-01-22)

### Features

* Add `rxjs-no-ignored-error` rule. ([2f6c771](https://github.com/cartant/rxjs-tslint-rules/commit/2f6c771))

<a name="3.4.2"></a>
## [3.4.2](https://github.com/cartant/rxjs-tslint-rules/compare/v3.4.1...v3.4.2) (2018-01-19)

### Fixes

* Add `tsutils` to the `package.json`. ([e2873a9](https://github.com/cartant/rxjs-tslint-rules/commit/e2873a9))

<a name="3.4.1"></a>
## [3.4.1](https://github.com/cartant/rxjs-tslint-rules/compare/v3.4.0...v3.4.1) (2018-01-19)

### Documentation

* Trivial documentation changes.

<a name="3.4.0"></a>
## [3.4.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.3.0...v3.4.0) (2018-01-19)

### Features

* Add `rxjs-finnish` notation rule. ([6adbd05](https://github.com/cartant/rxjs-tslint-rules/commit/6adbd05))
* Add `rxjs-no-finnish` notation rule. ([8426905](https://github.com/cartant/rxjs-tslint-rules/commit/8426905))

<a name="3.3.0"></a>
## [3.3.0](https://github.com/cartant/rxjs-tslint-rules/compare/v3.2.1...v3.3.0) (2017-11-27)

### Features

* Add options for the `rxjs-no-add` rule. ([775e81d](https://github.com/cartant/rxjs-tslint-rules/commit/775e81d))

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