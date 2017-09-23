/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the wholesale importation of `rxjs` or `rxjs/Rx`.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: false,
        ruleName: "rxjs-no-wholesale",
        type: "functionality",
        typescriptOnly: false
    };

    public static FAILURE_STRING = "Wholesale RxJS imports are forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {

    public visitImportDeclaration(node: ts.ImportDeclaration): void {

        const moduleSpecifier = node.moduleSpecifier.getText();

        if (/^['"]rxjs(\/Rx)?['"]/.test(moduleSpecifier)) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }

        super.visitImportDeclaration(node);
    }
}
