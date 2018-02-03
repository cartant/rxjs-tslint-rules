/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

import { couldBeType, isReferenceType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the calling of unsubscribe directly upon subject instances.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-subject-unsubscribe",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Calling unsubscribe on subjects is forbidden";

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

                if ((name === "unsubscribe") && isReferenceType(type) && couldBeType(type.target, "Subject")) {
                    this.addFailureAtNode(propertyAccessExpression.name, Rule.FAILURE_STRING);
                } else if ((name === "add") && isReferenceType(type) && couldBeType(type.target, "Subscription")) {
                    const [argument] = node.arguments;
                    const argumentType = typeChecker.getTypeAtLocation(argument);
                    if (couldBeType(argumentType, "Subject")) {
                        this.addFailureAtNode(propertyAccessExpression.name, Rule.FAILURE_STRING);
                    }
                }
            }
        });

        super.visitCallExpression(node);
    }
}
