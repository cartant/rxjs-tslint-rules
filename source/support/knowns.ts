/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";
import * as semver from "semver";

function read(dir: string): { [key: string]: boolean } {

    const entry = resolve.sync("rxjs");
    const dist = path.dirname(entry);

    // In RxJS 5.5.0-beta.5, toPromise was moved into the prototype.
    // However, to avoid breakage, the file in the add/operator directory was
    // left in-place.

    const root = dist.replace(/node_modules[\/\\]rxjs[\/\\](.*)$/, (match) => match);
    const { version } = require(path.join(root, "package.json"));
    const ignored = semver.satisfies(version, "<5.5.0-beta.5") ? {} : { "toPromise": true };

    const names = fs.readdirSync(path.join(dist, dir));
    return names
        .filter((name) => /^[a-z]\w+\.js$/.test(name))
        .map((name) => name.replace(/\.js/, ""))
        .filter((name) => !ignored[name])
        .reduce((acc, name) => ({ ...acc, [name]: true }), {});
}

export const knownObservables = read("add/observable");
export const knownOperators = read("add/operator");
