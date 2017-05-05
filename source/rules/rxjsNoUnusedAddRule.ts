/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

import { AddWalker } from "../support/add-walker";

export class Rule extends Lint.Rules.TypedRule {

    public static FAILURE_STRING = "RxJS add import is unused";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends AddWalker {

    protected onSourceFileEnd(): void {

        Object.keys(this.addedObservables).forEach((key) => {

            if (!this.usedObservables[key]) {
                this.addedObservables[key].forEach((node) => this.addFailureAtNode(
                    node,
                    `${Rule.FAILURE_STRING}: ${key}`
                ));
            }
        });

        Object.keys(this.addedOperators).forEach((key) => {

            if (!this.usedOperators[key]) {
                this.addedOperators[key].forEach((node) => this.addFailureAtNode(
                    node,
                    `${Rule.FAILURE_STRING}: ${key}`
                ));
            }
        });
    }
}
