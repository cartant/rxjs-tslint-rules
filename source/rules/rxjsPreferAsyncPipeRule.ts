/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import { Rule as PreferAngularAsyncPipeRule } from "./rxjsPreferAngularAsyncPipeRule";

export class Rule extends PreferAngularAsyncPipeRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: "Use the rxjs-prefer-angular-async-pipe rule instead.",
    description:
      "Disallows the calling of `subscribe` within an Angular component.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-prefer-async-pipe",
    type: "style",
    typescriptOnly: true
  };
}
