/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as path from "path";
import * as ts from "typescript";

import { UsedWalker } from "../support/used-walker";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the calling of patched methods.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-patched",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "RxJS patched methods are forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends UsedWalker {

    protected onSourceFileEnd(): void {

        Object.keys(this.usedObservables).forEach((key) => {

            this.usedObservables[key].forEach((node) => this.addFailureAtNode(
                node,
                `${Rule.FAILURE_STRING}: ${key}`
            ));
        });

        Object.keys(this.usedOperators).forEach((key) => {

            this.usedOperators[key].forEach((node) => this.addFailureAtNode(
                node,
                `${Rule.FAILURE_STRING}: ${key}`
            ));
        });
    }
}
