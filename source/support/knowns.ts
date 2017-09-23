/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";

function read(dir: string): { [key: string]: boolean } {

    const entry = resolve.sync("rxjs");
    const names = fs.readdirSync(path.join(path.dirname(entry), dir));
    return names
        .filter((name) => /^[a-z]\w+\.d\.ts$/.test(name))
        .map((name) => name.replace(/\.d\.ts$/, ""))
        .reduce((acc, name) => ({ ...acc, [name]: true }), {});
}

export const knownObservables = read("add/observable");
export const knownOperators = read("add/operator");
