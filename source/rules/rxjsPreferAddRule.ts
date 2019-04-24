/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import { Rule as NoWholesaleRule } from "./rxjsNoWholesaleRule";

export class Rule extends NoWholesaleRule {
  public static metadata: Lint.IRuleMetadata = Object.assign(
    {},
    NoWholesaleRule.metadata,
    {
      deprecationMessage:
        "rxjs-prefer-add has been renamed to rxjs-no-wholesale.",
      ruleName: "rxjs-prefer-add"
    }
  );
}
