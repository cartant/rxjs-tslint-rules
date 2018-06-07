/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";
import { knownOperators, knownPipeableOperators } from "../support/knowns";
import { couldBeType, isThis } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the use of variables/properties from unsafe/outer scopes in operator callbacks.",
        options: {
            properties: {
                allowDo: { type: "boolean" },
                allowParameters: { type: "boolean" },
                allowTap: { type: "boolean" }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
            An optional object with optional \`allowDo\`, \`allowParameters\` and \`allowTap\` properties all of which default to \`true\`.
            If the \`allowDo\` and \`allowTap\` options are \`true\`, the rule is not applied within \`do\` and \`tap\` operators respectively.
            If the \`allowParameters\` option is \`true\`, referencing function parameters from outer scopes is allowed.`,
        requiresTypeInfo: true,
        ruleName: "rxjs-no-unsafe-scopes",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Unsafe scopes are forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {

    private allowDo = true;
    private allowParameters = true;
    private allowTap = true;
    private callbackMap: Map<ts.Node, string> = new Map<ts.Node, string>();
    private callbackStack: (ts.ArrowFunction | ts.FunctionExpression)[] = [];

    constructor(sourceFile: ts.SourceFile, rawOptions: Lint.IOptions, program: ts.Program) {

        super(sourceFile, rawOptions, program);

        const [options] = this.getOptions();
        if (options) {
            this.allowDo = (options.allowDo !== undefined) ? options.allowDo : this.allowDo;
            this.allowParameters = (options.allowParameters !== undefined) ? options.allowParameters : this.allowParameters;
            this.allowTap = (options.allowTap !== undefined) ? options.allowTap : this.allowTap;
        }
    }

    protected visitArrowFunction(node: ts.ArrowFunction): void {

        if (this.callbackMap.has(node)) {
            this.callbackStack.push(node);
            super.visitArrowFunction(node);
            this.callbackStack.pop();
        } else {
            super.visitArrowFunction(node);
        }
    }

    protected visitCallExpression(node: ts.CallExpression): void {

        const { arguments: args, expression } = node;
        let name: string;

        if (tsutils.isIdentifier(expression)) {
            name = expression.getText();
        } else if (tsutils.isPropertyAccessExpression(expression)) {
            const { name: propertyName } = expression;
            name = propertyName.getText();
        }

        if (name && (knownOperators[name] || knownPipeableOperators[name])) {
            const callbacks = args.filter(arg => tsutils.isArrowFunction(arg) || tsutils.isFunctionExpression(arg));
            callbacks.forEach(callback => this.callbackMap.set(callback, name));
            super.visitCallExpression(node);
            callbacks.forEach(callback => this.callbackMap.delete(callback));
        } else {
            super.visitCallExpression(node);
        }
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {

        if (this.callbackMap.has(node)) {
            this.callbackStack.push(node);
            super.visitFunctionExpression(node);
            this.callbackStack.pop();
        } else {
            super.visitFunctionExpression(node);
        }
    }

    protected visitNode(node: ts.Node): void {

        if (this.callbackStack.length) {
            const validateNode = tsutils.isIdentifier(node) || isThis(node);
            if (validateNode && this.isUnsafe(node)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        super.visitNode(node);
    }

    private isUnsafe(node: ts.Node): boolean {

        const { callbackMap, callbackStack } = this;
        const leafCallback = callbackStack[callbackStack.length - 1];
        const leafOperator = callbackMap.get(leafCallback);
        const rootCallback = callbackStack[0];

        if (this.allowDo && (leafOperator === "do")) {
            return false;
        }
        if (this.allowTap && (leafOperator === "tap")) {
            return false;
        }

        const typeChecker = this.getTypeChecker();
        const symbol = typeChecker.getSymbolAtLocation(node);
        if (!symbol) {
            return false;
        }

        const [declaration] = symbol.getDeclarations();
        if (this.allowParameters && tsutils.isParameterDeclaration(declaration)) {
            return false;
        }
        if ((declaration.pos >= rootCallback.pos) && (declaration.pos < rootCallback.end)) {
            return false;
        }

        if (tsutils.isCallExpression(node.parent)) {
            return false;
        }
        if (tsutils.isNewExpression(node.parent)) {
            return false;
        }
        if (tsutils.isPropertyAccessExpression(node.parent)) {
            if (node === node.parent.name) {
                return false;
            } else if (tsutils.isCallExpression(node.parent.parent)) {
                return false;
            }
            const type = typeChecker.getTypeAtLocation(node.parent.name);
            /*tslint:disable-next-line:no-bitwise*/
            if ((type.flags & ts.TypeFlags.EnumLiteral) !== 0) {
                return false;
            }
        }

        if (tsutils.isVariableDeclarationList(declaration.parent)) {
            if (tsutils.getVariableDeclarationKind(declaration.parent) === tsutils.VariableDeclarationKind.Const) {
                return false;
            }
        }

        if (tsutils.isImportSpecifier(declaration)) {
            return false;
        }

        return true;
    }
}
