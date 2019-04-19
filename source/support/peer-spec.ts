/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { expect } from "chai";
import * as path from "path";
import * as peer from "./peer";

describe("peer", () => {
  it("should determine the dir", () => {
    expect(peer.dir).to.equal(
      path.join(
        process.env["RXJS_TSLINT_FIXTURES_DIR"]
          ? path.resolve(process.env["RXJS_TSLINT_FIXTURES_DIR"])
          : path.resolve("."),
        "node_modules/rxjs"
      )
    );
  });

  it("should determine the version", () => {
    const pack = require(path.join(peer.dir, "package.json"));
    expect(peer.version).to.equal(pack.version);
  });
});
