/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";

import { couldBeType, isReferenceType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows calling the unsubscribe method of a subject instance.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-subject-unsubscribe",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Calling unsubscribe on a subject is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

export class Walker extends Lint.ProgramAwareRuleWalker {

    protected visitCallExpression(node: ts.CallExpression): void {

        const { expression } = node;
        if (tsutils.isPropertyAccessExpression(expression)) {

            const name = expression.name.getText();
            const typeChecker = this.getTypeChecker();
            const type = typeChecker.getTypeAtLocation(expression.expression);

            if ((name === "unsubscribe") && isReferenceType(type) && couldBeType(type.target, "Subject")) {
                this.addFailureAtNode(expression.name, Rule.FAILURE_STRING);
            } else if ((name === "add") && isReferenceType(type) && couldBeType(type.target, "Subscription")) {
                const [argument] = node.arguments;
                const argumentType = typeChecker.getTypeAtLocation(argument);
                if (couldBeType(argumentType, "Subject")) {
                    this.addFailureAtNode(argument, Rule.FAILURE_STRING);
                }
            }
        }

        super.visitCallExpression(node);
    }
}
