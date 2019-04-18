/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";
import { tsquery } from "@phenomnomnominal/tsquery";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows async functions to subscribe.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: false,
        ruleName: "rxjs-no-async-subscribe",
        type: "functionality",
        typescriptOnly: false
    };

    public static FAILURE_STRING = "Passing async functions to subscribe is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        const failures: Lint.RuleFailure[] = [];
        const typeChecker = program.getTypeChecker();

        const callExpressions = tsquery(
            sourceFile,
            `CallExpression[expression.name.text="subscribe"]`
        );
        callExpressions.forEach(node => {
            const callExpression = node as ts.CallExpression;
            if (tsutils.isPropertyAccessExpression(callExpression.expression)) {
                const propertyAccessExpression = callExpression.expression;
                const { arguments: args } = callExpression;
                let observable: boolean | undefined = undefined;
                args.forEach(arg => {
                    if (tsutils.isArrowFunction(arg) || tsutils.isFunctionExpression(arg)) {
                        const modifier = tsutils.getModifier(arg, ts.SyntaxKind.AsyncKeyword);
                        if (modifier) {
                            if (observable === undefined) {
                                const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);
                                observable = couldBeType(type, "Observable");
                            }
                            if (observable) {
                                failures.push(new Lint.RuleFailure(
                                    sourceFile,
                                    modifier.getStart(),
                                    modifier.getStart() + modifier.getWidth(),
                                    Rule.FAILURE_STRING,
                                    this.ruleName
                                ));
                            }
                        }
                    }
                });
            }
        });
        return failures;
    }
}
