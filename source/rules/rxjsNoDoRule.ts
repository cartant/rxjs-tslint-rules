/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

import { UsedWalker } from "../support/used-walker";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the use of the do operator.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-do",
        type: "style",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "RxJS do operator is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends UsedWalker {

    protected onSourceFileEnd(): void {

        if (this.usedOperators["do"]) {
            this.usedOperators["do"].forEach((node) => this.addFailureAtNode(node, Rule.FAILURE_STRING));
        }
    }
}
