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
        description: "Disallows unsafe switchMap usage in effects and epics.",
        options: {
            properties: {
                allow: {
                    oneOf: [
                        { type: "string" },
                        { type: "array", items: { type: "string" } }
                    ]
                },
                disallow: {
                    oneOf: [
                        { type: "string" },
                        { type: "array", items: { type: "string" } }
                    ]
                }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
            An optional object with the optional properties \`allow\` or \`disallow\`.
            Either can be specified, but not both.
            The properties can be specifed as regular expression strings or as arrays containing
            the string fragments that are allowed or disallowed.`,
        requiresTypeInfo: true,
        ruleName: "rxjs-no-unsafe-switchmap",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Unsafe switchMap usage in effects and epics is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {

    public static ACTIONS_REGEXP = /action(s|\$)?/i;
    public static METHODS_REGEXP = /(ofType|pipe)/;
    public static DEFAULT_DISALLOW = [
        "create",
        "delete",
        "post",
        "put",
        "remove",
        "set",
        "update"
    ];

    private allowRegExp: RegExp | null;
    private disallowRegExp: RegExp | null;

    private static createRegExp(value: any): RegExp | null {

        if (!value || !value.length) {
            return null;
        }
        const flags = "i";
        if (typeof value === "string") {
            return new RegExp(value, flags);
        }
        const fragments = value as string[];
        const joined = fragments.map(fragment => `(\\b|[_'"])${fragment}(\\b|[_'"])`).join("|");
        return new RegExp(`(${joined})`, flags);
    }

    constructor(sourceFile: ts.SourceFile, rawOptions: Lint.IOptions, program: ts.Program) {

        super(sourceFile, rawOptions, program);

        const [options] = this.getOptions();
        if (options && (options.allow || options.disallow)) {
            this.allowRegExp = Walker.createRegExp(options.allow);
            this.disallowRegExp = Walker.createRegExp(options.disallow);
        } else {
            this.disallowRegExp = Walker.createRegExp(Walker.DEFAULT_DISALLOW);
        }
    }

    protected visitCallExpression(node: ts.CallExpression): void {

        node.forEachChild((child) => {

            if (tsutils.isPropertyAccessExpression(child)) {
                const { expression } = child;
                if (tsutils.isIdentifier(expression)) {

                    const propertyName = child.name.getText();
                    const expressionText = expression.getText();
                    const typeChecker = this.getTypeChecker();
                    const type = typeChecker.getTypeAtLocation(expression);

                    if (isReferenceType(type) &&
                        Walker.ACTIONS_REGEXP.test(expressionText) &&
                        Walker.METHODS_REGEXP.test(propertyName) &&
                        couldBeType(type.target, "Observable")) {

                        switch (propertyName) {
                        case "ofType":
                            this.walkPatchedTypes(node);
                            break;
                        case "pipe":
                            this.walkPipedTypes(node);
                            break;
                        default:
                            break;
                        }
                    }
                }
            }
        });

        super.visitCallExpression(node);
    }

    private shouldDisallow(args: ts.NodeArray<ts.Expression>): boolean {

        const names = args.map(arg => arg.getText());
        if (this.allowRegExp && !names.every(name => this.allowRegExp.test(name))) {
            return true;
        }
        if (this.disallowRegExp && names.some(name => this.disallowRegExp.test(name))) {
            return true;
        }
        return false;
    }

    private walkPatchedOperators(): void {
    }

    private walkPatchedTypes(node: ts.CallExpression): void {

        if (this.shouldDisallow(node.arguments)) {
            let name: ts.Identifier | undefined = undefined;
            for (let parent = node.parent; parent; parent = parent.parent) {
                if (tsutils.isCallExpression(parent)) {
                    if (name) {
                        switch (name.getText()) {
                        case "pipe":
                            this.walkPipedOperators(parent);
                            break;
                        case "switchMap":
                            this.addFailureAtNode(parent, Rule.FAILURE_STRING);
                            break;
                        default:
                            break;
                        }
                    }
                } else if (tsutils.isPropertyAccessExpression(parent)) {
                    name = parent.name;
                } else {
                    break;
                }
            }
        }
    }

    private walkPipedOperators(node: ts.CallExpression): void {
        node.arguments.forEach(arg => {
            if (tsutils.isCallExpression(arg)) {
                const { expression } = arg;
                if (tsutils.isIdentifier(expression) && (expression.getText() === "switchMap")) {
                    this.addFailureAtNode(arg, Rule.FAILURE_STRING);
                }
            }
        });
    }

    private walkPipedTypes(node: ts.CallExpression): void {

        node.arguments.forEach(arg => {
            if (tsutils.isCallExpression(arg)) {
                const { expression } = arg;
                if (tsutils.isIdentifier(expression) && (expression.getText() === "ofType")) {
                    if (this.shouldDisallow(arg.arguments)) {
                        this.walkPipedOperators(node);
                    }
                }
            }
        });
    }
}
