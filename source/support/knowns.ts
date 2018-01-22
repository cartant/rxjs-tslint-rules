/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";
import * as semver from "semver";

let aliasOperators: { [key: string]: string } = { flatMap: "mergeMap" };
let dist: string | undefined = undefined;
let prototypeMethods: { [key: string]: boolean } = {};

try {

    const entry = resolve.sync("rxjs");
    dist = path.dirname(entry);

    const root = dist.replace(/node_modules[\/\\]rxjs[\/\\](.*)$/, (match) => match);
    const { version } = require(path.join(root, "package.json"));
    prototypeMethods = semver.satisfies(version, "<5.5.0-beta.5") ? {} : { pipe: true, toPromise: true };

} catch (error) {
    /*tslint:disable-next-line:no-console*/
    console.warn("Cannot find rxjs in node_modules; some rxjs-tslint-rules will be ineffectual.");
}

function read(dir: string): { [key: string]: string } {

    if (!dist) {
        return {};
    }

    // In RxJS 5.5.0-beta.5, toPromise was moved into the prototype.
    // However, to avoid breakage, the file in the add/operator directory was
    // left in-place.

    const names = fs.readdirSync(path.join(dist, dir));
    return names
        .filter((name) => /^[a-z]\w+\.js$/.test(name))
        .map((name) => name.replace(/\.js/, ""))
        .filter((name) => !prototypeMethods[name])
        .reduce((acc, name) => ({ ...acc, [name]: name }), {});
}

export const knownObservables = read("add/observable");
export const knownOperators = { ...read("add/operator"), ...aliasOperators };
export const knownPrototypeMethods = { forEach: true, ...prototypeMethods };
export const knownStaticMethods = { create: true };
