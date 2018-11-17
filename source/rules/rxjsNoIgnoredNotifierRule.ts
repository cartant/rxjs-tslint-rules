/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";
import { tsquery } from "@phenomnomnominal/tsquery";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows observables not composed from the `repeatWhen` or `retryWhen` notifier.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-ignored-notifier",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Ignoring the notifier is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        const failures: Lint.RuleFailure[] = [];
        const typeChecker = program.getTypeChecker();

        const identifiers = tsquery(
            sourceFile,
            `CallExpression Identifier[name=/(repeatWhen|retryWhen)/]`
        );
        identifiers.forEach(identifier => {
            const callExpression = identifier.parent as ts.CallExpression;
            if (callExpression.arguments.length > 0) {
                const type = typeChecker.getTypeAtLocation(callExpression);
                if (couldBeType(type, "MonoTypeOperatorFunction")) {
                    const [arg] = callExpression.arguments;
                    if (tsutils.isArrowFunction(arg) || tsutils.isFunctionExpression(arg)) {
                        let fail = false;
                        const [parameter] = arg.parameters;
                        if (parameter) {
                            fail = tsquery(
                                arg.body,
                                `Identifier[name=${parameter.name.getText()}]`
                            ).length === 0;
                        } else {
                            fail = true;
                        }
                        if (fail) {
                            failures.push(new Lint.RuleFailure(
                                sourceFile,
                                identifier.getStart(),
                                identifier.getStart() + identifier.getWidth(),
                                Rule.FAILURE_STRING,
                                this.ruleName
                            ));
                        }
                    }
                }
            }
        });
        return failures;
    }
}
