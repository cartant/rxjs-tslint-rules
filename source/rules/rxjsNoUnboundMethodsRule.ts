/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";
import * as peer from "../support/peer";

import { tsquery } from "@phenomnomnominal/tsquery";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        deprecationMessage: (peer.v5 || peer.compat) ? "Rule is v6-only." : undefined,
        description: "Disallows the passing of unbound methods.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-unbound-methods",
        type: "maintainability",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Unbound methods are forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {

    walk(sourceFile: ts.SourceFile): void {

        const typeChecker = this.getTypeChecker();

        const propertyAccessExpressions = tsquery(
            sourceFile,
            `CallExpression PropertyAccessExpression[name.name=/^(add|pipe|subscribe)$/]`
        );
        propertyAccessExpressions.forEach(propertyAccessExpression => {
            const { parent: callExpression } = propertyAccessExpression;
            if (tsutils.isCallExpression(callExpression)) {
                if (tsutils.isPropertyAccessExpression(propertyAccessExpression)) {
                    const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);
                    if (couldBeType(type, /^(Observable|Subscription)$/)) {
                        const { arguments: args } = callExpression;
                        const { name } = propertyAccessExpression;
                        if (name.getText() === "pipe") {
                            args.forEach(arg => {
                                if (tsutils.isCallExpression(arg)) {
                                    this.validateArgs(arg.arguments);
                                }
                            });
                        } else {
                            this.validateArgs(args);
                        }
                    }
                }
            }
        });

        const subscriptionIdentifiers = tsquery(
            sourceFile,
            `NewExpression Identifier[escapedText="Subscription"]`
        );
        subscriptionIdentifiers.forEach(subscriptionIdentifier => {
            const { parent: newExpression } = subscriptionIdentifier;
            if (tsutils.isNewExpression(newExpression)) {
                this.validateArgs(newExpression.arguments);
            }
        });
    }

    private validateArgs(args: ts.NodeArray<ts.Expression>): void {
        args.forEach(arg => {
            if (tsutils.isPropertyAccessExpression(arg)) {
                const thisKeywords = tsquery(arg, `ThisKeyword`);
                if (thisKeywords.length) {
                    this.addFailureAtNode(arg, Rule.FAILURE_STRING);
                }
            }
        });
    }
}
