/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { expect } from "chai";
import * as path from "path";
import * as peer from "./peer";

describe("peer", () => {

    it("should determine the dir", () => {

        expect(peer.dir).to.equal(path.resolve("./node_modules/rxjs"));
    });

    it("should determine the version", () => {

        const installed = require("rxjs/package.json");
        expect(peer.version).to.equal(installed.version);
    });
});
