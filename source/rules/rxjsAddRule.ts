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

    public static FAILURE_STRING = "RxJS add import is missing";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends UsedWalker {

    protected onSourceFileEnd(): void {

        Object.keys(this.usedObservables).forEach((key) => {

            if (!this.addedObservables[key]) {
                this.usedObservables[key].forEach((node) => this.addFailureAtNode(
                    node,
                    `${Rule.FAILURE_STRING}: ${key}`
                ));
            }
        });

        Object.keys(this.usedOperators).forEach((key) => {

            if (!this.addedOperators[key]) {
                this.usedOperators[key].forEach((node) => this.addFailureAtNode(
                    node,
                    `${Rule.FAILURE_STRING}: ${key}`
                ));
            }
        });
    }
}
