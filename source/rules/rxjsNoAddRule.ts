/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

    public static FAILURE_STRING = "RxJS add is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {

    public visitImportDeclaration(node: ts.ImportDeclaration): void {

        const moduleSpecifier = node.moduleSpecifier.getText();

        if (/^['"]rxjs\/add\//.test(moduleSpecifier)) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }

        super.visitImportDeclaration(node);
    }
}
