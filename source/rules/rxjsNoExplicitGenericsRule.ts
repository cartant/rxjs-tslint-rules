/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import { tsquery } from "@phenomnomnominal/tsquery";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows explicit generic type arguments.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: false,
        ruleName: "rxjs-no-explicit-generics",
        type: "functionality",
        typescriptOnly: false
    };

    public static FAILURE_STRING = "Explicit generic type arguments are forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        const failures: Lint.RuleFailure[] = [];
        const callIdentifiers = tsquery(
            sourceFile,
            `CallExpression[expression.name.text="pipe"] > CallExpression[typeArguments.length>0] > Identifier`
        );

        callIdentifiers.forEach(identifier => {
            failures.push(new Lint.RuleFailure(
                sourceFile,
                identifier.getStart(),
                identifier.getStart() + identifier.getWidth(),
                Rule.FAILURE_STRING,
                this.ruleName
            ));
        });
        return failures;
    }
}
