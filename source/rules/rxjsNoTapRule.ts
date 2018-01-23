/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

import { Rule as NoDoRule } from "./rxjsNoDoRule";

export class Rule extends NoDoRule {

    public static metadata: Lint.IRuleMetadata = Object.assign({}, NoDoRule.metadata, {
        ruleName: "rxjs-no-tap"
    });
}
