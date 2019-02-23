/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";

import { couldBeType, isAny, isReferenceType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Enforces the passing of Error values to error notifications.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-throw-error",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Passing non-Error values is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

export class Walker extends Lint.ProgramAwareRuleWalker {

    protected visitCallExpression(node: ts.CallExpression): void {

        const { arguments: [argument], expression } = node;
        const typeChecker = this.getTypeChecker();

        const validate = (argument: ts.Node) => {
            let fail = true;
            if (argument) {
                const type = typeChecker.getTypeAtLocation(argument);
                fail = !(isAny(type) || couldBeType(type, "Error"));
            }
            if (fail) {
                this.addFailureAtNode(argument, Rule.FAILURE_STRING);
            }
        };

        if (tsutils.isPropertyAccessExpression(expression)) {

            const name = expression.name.getText();
            const type = typeChecker.getTypeAtLocation(expression.expression);

            if ((name === "throw") && couldBeType(type, "Observable")) {
                validate(argument);
            }

        } else if (tsutils.isIdentifier(expression)) {

            const name = expression.getText();
            const type = typeChecker.getTypeAtLocation(expression);
            const [signature] = typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
            if (signature) {
                const returnType = typeChecker.getReturnTypeOfSignature(signature);
                if (((name === "_throw") || (name === "throwError")) && couldBeType(returnType, "Observable")) {
                    validate(argument);
                }
            }
        }

        super.visitCallExpression(node);
    }

    protected visitThrowStatement(node: ts.ThrowStatement): void {

        const typeChecker = this.getTypeChecker();
        const type = typeChecker.getTypeAtLocation(node.expression);

        if (!isAny(type) && !couldBeType(type, "Error")) {
            this.addFailureAtNode(node.expression, Rule.FAILURE_STRING);
        }

        super.visitThrowStatement(node);
    }
}
