/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Enforces the use of Finnish notation.",
        options: {
            properties: {
                functions: { type: "boolean" },
                methods: { type: "boolean" },
                parameters: { type: "boolean" },
                properties: { type: "boolean" },
                variables: { type: "boolean" }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
            An optional object with optional \`functions\`, \`methods\`, \`parameters\`,
            \`properties\` and \`variables\` properties.
            The properies are booleans and determine whether or not Finnish notation is enforced.
            All properties default to \`true\`.`,
        requiresTypeInfo: true,
        ruleName: "rxjs-finnish",
        type: "style",
        typescriptOnly: true
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {

    private validate = {
        functions: true,
        methods: true,
        parameters: true,
        properties: true,
        variables: true
    };

    constructor(sourceFile: ts.SourceFile, rawOptions: Lint.IOptions, program: ts.Program) {

        super(sourceFile, rawOptions, program);

        const [options] = this.getOptions();
        if (options) {
            this.validate = { ...this.validate, ...options };
        }
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {

        if (this.validate.functions) {
            this.validateNode(node, node.type);
        }
        super.visitFunctionDeclaration(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {

        if (this.validate.functions) {
            this.validateNode(node, node.type);
        }
        super.visitFunctionExpression(node);
    }

    protected visitGetAccessor(node: ts.AccessorDeclaration): void {

        if (this.validate.properties) {
            this.validateNode(node);
        }
        super.visitGetAccessor(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {

        if (this.validate.methods) {
            this.validateNode(node, node.type);
        }
        super.visitMethodDeclaration(node);
    }

    protected visitMethodSignature(node: ts.SignatureDeclaration): void {

        if (this.validate.methods) {
            this.validateNode(node, node.type);
        }
        super.visitMethodSignature(node);
    }

    protected visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): void {

        if (this.validate.properties) {
            node.properties.forEach(property => {
                if (property.name && !tsutils.isComputedPropertyName(property.name)) {
                    this.validateNode(property);
                }
            });
        }
        super.visitObjectLiteralExpression(node);
    }

    protected visitParameterDeclaration(node: ts.ParameterDeclaration): void {

        if (this.validate.parameters) {
            this.validateNode(node);
        }
        super.visitParameterDeclaration(node);
    }

    protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {

        if (this.validate.properties) {
            this.validateNode(node);
        }
        super.visitPropertyDeclaration(node);
    }

    protected visitPropertySignature(node: ts.Node): void {

        if (this.validate.properties) {
            this.validateNode(node);
        }
        super.visitPropertySignature(node);
    }

    protected visitSetAccessor(node: ts.AccessorDeclaration): void {

        if (this.validate.properties) {
            this.validateNode(node);
        }
        super.visitSetAccessor(node);
    }

    protected visitVariableDeclarationList(node: ts.VariableDeclarationList): void {

        if (this.validate.variables) {
            tsutils.forEachDeclaredVariable(node, variable => {
                this.validateNode(variable);
            });
        }
        super.visitVariableDeclarationList(node);
    }

    private validateNode(node: ts.Node, typeNode?: ts.Node): void {

        const { name } = node as any;
        if (name) {
            const text = name.getText();
            const type = this.getTypeChecker().getTypeAtLocation(typeNode || node);
            if (!/\$$/.test(text) && couldBeType(type, "Observable")) {
                this.addFailureAtNode(node, `Finnish notation required for ${text}`);
            }
        }
    }
}
