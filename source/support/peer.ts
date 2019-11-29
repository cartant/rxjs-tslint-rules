/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";
import * as semver from "semver";

let peerDir: string | undefined = undefined;
let peerVersion: string | undefined = undefined;

const fixturesDir = process.env["RXJS_TSLINT_FIXTURES_DIR"];
if (fixturesDir) {
  peerDir = path.join(path.resolve(fixturesDir), "node_modules/rxjs");
  peerVersion = require(path.join(peerDir, "package.json")).version;
} else {
  try {
    const entry = resolve.sync("rxjs");
    peerDir = path.dirname(entry);
    const root = peerDir.replace(
      /node_modules[\/\\]rxjs[\/\\](.*)$/,
      match => match
    );
    const pack = require(path.join(root, "package.json"));
    peerVersion = pack.version;
  } catch (error) {
    warn();
  }
}

export const compat = peerDir
  ? fs.existsSync(path.join(path.dirname(peerDir), "rxjs-compat"))
  : false;
export const dir = peerDir;
export const version = peerVersion;
export const v5 = peerVersion && semver.satisfies(peerVersion, "^5.0.0");
export const v5NotSupportedMessage =
  "This rule is v6-only. The rule might work with v5, but it has not been tested and is not supported.";
export const v6 = peerVersion && semver.satisfies(peerVersion, "^6.0.0-rc.0");
export const v6NotNeededMessage = "Rule not needed for v6.";
export const v6OnlyMessage = "This rule is v6-only.";

export function warn(dir: string = ""): void {
  /*tslint:disable-next-line:no-console*/
  console.warn(
    `Cannot find node_modules/rxjs/${dir}; some rxjs-tslint-rules will be ineffectual.`
  );
}
