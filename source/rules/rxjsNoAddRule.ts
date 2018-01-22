/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the importation of patched observables and operators.",
        options: {
            properties: {
                allowObservables: {
                    oneOf: [
                        { type: "boolean" },
                        { type: "array", items: { type: "string" } }
                    ]
                },
                allowOperators: {
                    oneOf: [
                        { type: "boolean" },
                        { type: "array", items: { type: "string" } }
                    ]
                }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
            An optional object with the optional properties \`allowObservables\` and \`allowOperators\`.
            The properties can be specifed as booleans (they default to \`false\`) or as arrays containing
            the names of the observables or operators that are allowed.`,
        requiresTypeInfo: false,
        ruleName: "rxjs-no-add",
        type: "functionality",
        typescriptOnly: false
    };

    public static FAILURE_STRING = "RxJS add import is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {

    private allowAllObservables = false;
    private allowAllOperators = false;
    private allowedObservables: string[] = [];
    private allowedOperators: string[] = [];

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {

        super(sourceFile, options);

        const [ruleOptions] = this.getOptions();
        if (ruleOptions) {
            if (ruleOptions.hasOwnProperty("allowObservables")) {
                if (typeof ruleOptions.allowObservables.length === "number") {
                    this.allowedObservables = ruleOptions.allowObservables;
                } else {
                    this.allowAllObservables = Boolean(ruleOptions.allowObservables);
                }
            }
            if (ruleOptions.hasOwnProperty("allowOperators")) {
                if (typeof ruleOptions.allowOperators.length === "number") {
                    this.allowedOperators = ruleOptions.allowOperators;
                } else {
                    this.allowAllOperators = Boolean(ruleOptions.allowOperators);
                }
            }
        }
    }

    public visitImportDeclaration(node: ts.ImportDeclaration): void {

        const moduleSpecifier = node.moduleSpecifier.getText();
        const match = moduleSpecifier.match(/^['"]rxjs\/add\/(\w+)\/(\w+)/);
        if (match) {
            if ((match[1] === "observable") && !this.allowAllObservables) {
                if (this.allowedObservables.indexOf(match[2]) === -1) {
                    this.addFailureAtNode(node, Rule.FAILURE_STRING);
                }
            } else if ((match[1] === "operator") && !this.allowAllOperators) {
                if (this.allowedOperators.indexOf(match[2]) === -1) {
                    this.addFailureAtNode(node, Rule.FAILURE_STRING);
                }
            }
        }
        super.visitImportDeclaration(node);
    }
}
