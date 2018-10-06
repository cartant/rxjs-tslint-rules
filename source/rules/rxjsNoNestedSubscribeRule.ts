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
        description: "Disallows the calling of `subscribe` within a `subscribe` callback.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-nested-subscribe",
        type: "style",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Nested subscribe calls are forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        const failures: Lint.RuleFailure[] = [];
        const typeChecker = program.getTypeChecker();

        const subscribeQuery = `CallExpression PropertyAccessExpression[name.name="subscribe"]`;
        const propertyAccessExpressions = tsquery(sourceFile, subscribeQuery);
        propertyAccessExpressions.forEach(propertyAccessExpression => {
            const { parent: callExpression } = propertyAccessExpression;
            if (tsutils.isCallExpression(callExpression)) {
                if (tsutils.isPropertyAccessExpression(propertyAccessExpression)) {
                    const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);
                    if (couldBeType(type, "Observable")) {
                        callExpression.arguments.forEach(arg => {
                            const propertyAccessExpressions = tsquery(arg, subscribeQuery);
                            propertyAccessExpressions.forEach(propertyAccessExpression => {
                                if (tsutils.isPropertyAccessExpression(propertyAccessExpression)) {
                                    const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);
                                    if (couldBeType(type, "Observable")) {
                                        const { name } = propertyAccessExpression;
                                        failures.push(new Lint.RuleFailure(
                                            sourceFile,
                                            name.getStart(),
                                            name.getStart() + name.getWidth(),
                                            Rule.FAILURE_STRING,
                                            this.ruleName
                                        ));
                                    }
                                }
                            });
                        });
                    }
                }
            }
        });
        return failures;
    }
}
