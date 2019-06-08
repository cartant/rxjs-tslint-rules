/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { expect } from "chai";
import * as semver from "semver";
import {
  knownObservables,
  knownOperators,
  knownPipeableOperators,
  knownPrototypeMethods,
  knownStaticMethods
} from "./knowns";
import * as peer from "./peer";

describe("knowns", () => {
  it("should determine the observable factories", () => {
    expect(knownObservables).to.have.property("concat");
    expect(knownObservables).to.have.property("from");
    expect(knownObservables).to.have.property("merge");
    expect(knownObservables).to.have.property("of");
  });

  it("should determine the operators", () => {
    expect(knownOperators).to.have.property("concatMap");
    expect(knownOperators).to.have.property("exhaustMap");
    expect(knownOperators).to.have.property("flatMap");
    expect(knownOperators).to.have.property("mergeMap");
    expect(knownOperators).to.have.property("switchMap");
  });

  it("should determine the pipeable operators", () => {
    expect(knownPipeableOperators).to.have.property("concatMap");
    expect(knownPipeableOperators).to.have.property("exhaustMap");
    expect(knownPipeableOperators).to.have.property("flatMap");
    expect(knownPipeableOperators).to.have.property("mergeMap");
    expect(knownPipeableOperators).to.have.property("switchMap");
  });

  it("should determine the prototype methods", () => {
    expect(knownPrototypeMethods).to.have.property("forEach");
    if (semver.satisfies(peer.version, ">=5.5.0-beta.5")) {
      expect(knownPrototypeMethods).to.have.property("pipe");
      expect(knownPrototypeMethods).to.have.property("toPromise");
    }
  });

  it("should determine the static methods", () => {
    expect(knownStaticMethods).to.have.property("create");
  });
});
