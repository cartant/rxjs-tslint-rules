/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";

import { UsedWalker } from "../support/used-walker";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the use of banned operators.",
        options: {
            "type": "object"
        },
        optionsDescription: Lint.Utils.dedent`
            An object containing keys that are names of operators
            and values that are either booleans or strings containing the explanation for the ban.`,
        requiresTypeInfo: true,
        ruleName: "rxjs-ban-operators",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "RxJS operator is banned";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends UsedWalker {

    private _bans: { explanation: string, regExp: RegExp }[] = [];

    constructor(sourceFile: ts.SourceFile, rawOptions: Lint.IOptions, program: ts.Program) {

        super(sourceFile, rawOptions, program);

        const [options] = this.getOptions();
        if (options) {
            Object.entries(options).forEach(([key, value]) => {
                if (value !== false) {
                    this._bans.push({
                        explanation: (typeof value === "string") ? value : "",
                        regExp: new RegExp(`^${key}$`)
                    });
                }
            });
        }
    }

    public visitImportDeclaration(node: ts.ImportDeclaration): void {

        const moduleSpecifier = node.moduleSpecifier.getText();

        if (/^['"]rxjs\/operators?/.test(moduleSpecifier)) {
            if (tsutils.isNamedImports(node.importClause.namedBindings)) {
                node.importClause.namedBindings.elements.forEach(binding => {
                    this.validateNode(binding.propertyName || binding.name);
                });
            }
        } else {
            const match = moduleSpecifier.match(/^['"]rxjs\/add\/operator\/(\w+)['"]/);
            if (match) {
                const failure = this.getFailure(match[1]);
                if (failure) {
                    this.addFailureAtNode(node, failure);
                }
            }
        }

        super.visitImportDeclaration(node);
    }

    protected onSourceFileEnd(): void {

        Object.entries(this.usedOperators).forEach(([key, value]) => {
            const failure = this.getFailure(key);
            if (failure) {
                value.forEach(node => this.addFailureAtNode(node, failure));
            }
        });
    }

    private getFailure(name: string): string | undefined {

        const { _bans } = this;
        for (let b = 0, length = _bans.length; b < length; ++b) {
            const ban = _bans[b];
            if (ban.regExp.test(name)) {
                const explanation = ban.explanation ? `: ${ban.explanation}` : "";
                return `${Rule.FAILURE_STRING}: ${name}${explanation}`;
            }
        }
        return undefined;
    }

    private validateNode(name: ts.Node): void {

        const failure = this.getFailure(name.getText());
        if (failure) {
            this.addFailureAtNode(name, failure);
        }
    }
}
