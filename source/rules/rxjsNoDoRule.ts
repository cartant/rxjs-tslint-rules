/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";

import { UsedWalker } from "../support/used-walker";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the use of the do operator.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-do",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "RxJS do/tap operator is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends UsedWalker {

    public visitImportDeclaration(node: ts.ImportDeclaration): void {

        const moduleSpecifier = node.moduleSpecifier.getText();

        if (/^['"]rxjs\/operators?/.test(moduleSpecifier)) {
            if (tsutils.isNamedImports(node.importClause.namedBindings)) {
                node.importClause.namedBindings.elements.forEach(binding => {
                    this.validateName(binding.propertyName || binding.name);
                });
            }
        } else if (/^['"]rxjs\/add\/operator\/do['"]/.test(moduleSpecifier)) {
            this.addFailureAtNode(node.moduleSpecifier, Rule.FAILURE_STRING);
        }

        super.visitImportDeclaration(node);
    }

    protected onSourceFileEnd(): void {

        if (this.usedOperators["do"]) {
            this.usedOperators["do"].forEach((node) => this.addFailureAtNode(node, Rule.FAILURE_STRING));
        }
    }

    private validateName(name: ts.Node): void {

        if (/^(_do|tap)$/.test(name.getText())) {
            this.addFailureAtNode(name, Rule.FAILURE_STRING);
        }
    }
}
