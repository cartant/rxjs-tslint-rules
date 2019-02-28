/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import { tsquery } from "@phenomnomnominal/tsquery";
import { couldBeFunction } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows calling the `publish` and `publishReplay` operators without selectors.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: false,
        ruleName: "rxjs-no-connectable",
        type: "functionality",
        typescriptOnly: false
    };

    public static FAILURE_STRING = "Calling publish without a selector is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        const failures: Lint.RuleFailure[] = [];
        const typeChecker = program.getTypeChecker();

        const callIdentifiers = tsquery(
            sourceFile,
            `CallExpression Identifier[name=/^publish(Replay)?$/]`
        );
        callIdentifiers.forEach(identifier => {
            const callExpression = identifier.parent as ts.CallExpression;
            if (!callExpression.arguments.some(arg => couldBeFunction(typeChecker.getTypeAtLocation(arg)))) {
                failures.push(new Lint.RuleFailure(
                    sourceFile,
                    identifier.getStart(),
                    identifier.getStart() + identifier.getWidth(),
                    Rule.FAILURE_STRING,
                    this.ruleName
                ));
            }
        });
        return failures;
    }
}
