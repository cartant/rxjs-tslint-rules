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

    public static FAILURE_STRING = "RxJS add missing";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends AddWalker {

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
