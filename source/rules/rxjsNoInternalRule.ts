/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        deprecationMessage: undefined,
        description: "Disallows the importation of internals.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: false,
        ruleName: "rxjs-no-internal",
        type: "functionality",
        typescriptOnly: false
    };

    public static FAILURE_STRING = "RxJS imports from internal are forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {

    public visitImportDeclaration(node: ts.ImportDeclaration): void {

        const moduleSpecifier = node.moduleSpecifier.getText();
        const match = moduleSpecifier.match(/^['"]rxjs\/internal\/\w+/);
        if (match) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        super.visitImportDeclaration(node);
    }
}
