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
        description: "Disallows the use of variables/properties from outer scopes in takeWhile.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-unsafe-takewhile",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Outer scopes are forbidden in takeWhile";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {

    private callbackMap: Map<ts.Node, string> = new Map<ts.Node, string>();
    private callbackStack: (ts.ArrowFunction | ts.FunctionExpression)[] = [];

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

        const typeChecker = this.getTypeChecker();
        const symbol = typeChecker.getSymbolAtLocation(node);
        const [declaration] = symbol.getDeclarations();

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
