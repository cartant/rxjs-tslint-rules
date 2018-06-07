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

const defaultNamesRegExp = /^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$/;
const defaultTypesRegExp = /^EventEmitter$/;

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Enforces the use of a `just` alias for `of`.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-just",
        type: "style",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Use just alias";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {

    walk(sourceFile: ts.SourceFile): void {

        const typeChecker = this.getTypeChecker();
        let importIdentifier: ts.Identifier | undefined = undefined;

        const importDeclarations = tsquery(
            sourceFile,
            `ImportDeclaration:has(StringLiteral[value="rxjs"]),ImportDeclaration:has(StringLiteral[value="rxjs/observable/of"])`
        );
        importDeclarations.forEach(importDeclaration => {
            let importSpecifiers = tsquery(
                importDeclaration,
                `ImportSpecifier:has(Identifier[escapedText="of"])`
            );
            importSpecifiers.forEach(importSpecifier => {
                if (tsutils.isImportSpecifier(importSpecifier)) {
                    if (!importSpecifier.propertyName && (importSpecifier.name.getText() === "of")) {
                        importIdentifier = importSpecifier.name;
                        const fix = Lint.Replacement.replaceFromTo(
                            importIdentifier.getStart(),
                            importIdentifier.getStart() + importIdentifier.getWidth(),
                            "of as just"
                        );
                        this.addFailureAtNode(importIdentifier, Rule.FAILURE_STRING, fix);
                    }
                }
            });
        });

        if (importIdentifier) {
            const callExpressions = tsquery(
                sourceFile,
                `CallExpression:has(Identifier[escapedText="of"])`
            );
            callExpressions.forEach(callExpression => {
                if (tsutils.isCallExpression(callExpression)) {
                    const expression = callExpression.expression;
                    if (tsutils.isIdentifier(expression)) {

                        const symbol = typeChecker.getSymbolAtLocation(expression);
                        if (symbol) {

                            const [declaration] = symbol.getDeclarations();
                            if (declaration === importIdentifier.parent) {
                                const fix = Lint.Replacement.replaceFromTo(
                                    expression.getStart(),
                                    expression.getStart() + expression.getWidth(),
                                    "just"
                                );
                                this.addFailureAtNode(expression, Rule.FAILURE_STRING, fix);
                            }
                        }
                    }
                }
            });
        }
    }
}
