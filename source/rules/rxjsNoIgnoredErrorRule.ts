/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

import { couldBeType, isReferenceType } from "../support/util";
import { InternalSymbolName } from "typescript";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the calling of subscribe without specifying a error handler.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-ignored-error",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Calling subscribe without a second parameter is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

export class Walker extends Lint.ProgramAwareRuleWalker {

    protected visitCallExpression(node: ts.CallExpression): void {

        node.forEachChild((child) => {

            if (child.kind === ts.SyntaxKind.PropertyAccessExpression) {
                const propertyAccessExpression = child as ts.PropertyAccessExpression;
                const name = propertyAccessExpression.name.getText();
                const typeChecker = this.getTypeChecker();
                const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);

                if ((name === "subscribe") &&
                    isReferenceType(type) &&
                    couldBeType(type.target, "Observable") &&
                    (node.arguments.length && this.nodeIsLikelyAFunction(node.arguments[0])) &&
                    node.arguments.length < 2
                ) {
                    this.addFailureAtNode(propertyAccessExpression.name, Rule.FAILURE_STRING);
                }
            }
        });

        super.visitCallExpression(node);
    }

    private nodeIsLikelyAFunction(node: ts.Expression): boolean {
        // Fast check
        if (node.kind === ts.SyntaxKind.ArrowFunction ||
            node.kind === ts.SyntaxKind.FunctionExpression
        ) {
            return true;
        }
        // Check with a type checker
        const typeChecker = this.getTypeChecker();
        const type: ts.Type = typeChecker.getTypeAtLocation(node);
        return couldBeType(type, "Function") ||
            couldBeType(type, "ArrowFunction") ||
            couldBeType(type, InternalSymbolName.Function);
    }
}
