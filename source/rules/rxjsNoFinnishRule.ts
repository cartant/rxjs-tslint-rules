/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the use of Finnish notation.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rxjs-no-finnish",
        type: "style",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Finnish notation is forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {

        this.validateNode(node, node.type);
        super.visitFunctionDeclaration(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {

        this.validateNode(node, node.type);
        super.visitFunctionExpression(node);
    }

    protected visitGetAccessor(node: ts.AccessorDeclaration): void {

        this.validateNode(node);
        super.visitGetAccessor(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {

        this.validateNode(node, node.type);
        super.visitMethodDeclaration(node);
    }

    protected visitMethodSignature(node: ts.SignatureDeclaration): void {

        this.validateNode(node, node.type);
        super.visitMethodSignature(node);
    }

    protected visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): void {

        node.properties.forEach(property => {
            if (property.name.kind !== ts.SyntaxKind.ComputedPropertyName) {
                this.validateNode(property);
            }
        });
        super.visitObjectLiteralExpression(node);
    }

    protected visitParameterDeclaration(node: ts.ParameterDeclaration): void {

        this.validateNode(node);
        super.visitParameterDeclaration(node);
    }

    protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {

        this.validateNode(node);
        super.visitPropertyDeclaration(node);
    }

    protected visitPropertySignature(node: ts.Node): void {

        this.validateNode(node);
        super.visitPropertySignature(node);
    }

    protected visitSetAccessor(node: ts.AccessorDeclaration): void {

        this.validateNode(node);
        super.visitSetAccessor(node);
    }

    protected visitVariableDeclarationList(node: ts.VariableDeclarationList): void {

        tsutils.forEachDeclaredVariable(node, variable => {
            this.validateNode(variable);
        });
        super.visitVariableDeclarationList(node);
    }

    private validateNode(node: ts.Node, typeNode?: ts.Node): void {

        const { name } = node as any;
        if (name) {
            const text = name.getText();
            const type = this.getTypeChecker().getTypeAtLocation(typeNode || node);
            if (/\$$/.test(text) && couldBeType(type, "Observable")) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
    }
}
