/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as fs from "fs";
import * as path from "path";
import * as semver from "semver";
import * as peer from "./peer";

const aliasOperators: { [key: string]: string } = { flatMap: "mergeMap" };
const prototypeMethods: { [key: string]: boolean } = semver.satisfies(
  peer.version,
  "<5.5.0-beta.5"
)
  ? {}
  : { pipe: true, toPromise: true };

function read(dir: string): { [key: string]: string } {
  if (!peer.dir) {
    return {};
  }
  try {
    // In RxJS 5.5.0-beta.5, toPromise was moved into the prototype.
    // However, to avoid breakage, the file in the add/operator directory was
    // left in-place.
    const names = fs.readdirSync(path.join(peer.dir, dir));
    return names
      .filter(name => /^[a-z]\w+\.js$/.test(name))
      .map(name => name.replace(/\.js/, ""))
      .filter(name => !prototypeMethods[name])
      .reduce((acc, name) => ({ ...acc, [name]: name }), {});
  } catch (error) {
    peer.warn(dir);
  }
}

export const knownObservables = read("add/observable");
export const knownOperators = { ...read("add/operator"), ...aliasOperators };
export const knownPipeableOperators = {
  ...read("operators"),
  ...aliasOperators
};
export const knownPrototypeMethods = { forEach: true, ...prototypeMethods };
export const knownStaticMethods = { create: true };
