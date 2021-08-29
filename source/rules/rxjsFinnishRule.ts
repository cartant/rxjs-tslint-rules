/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { couldBeType } from "../support/util";

const defaultNamesRegExp =
  /^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$/;
const defaultTypesRegExp = /^EventEmitter$/;

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: "Enforces the use of Finnish notation.",
    options: {
      properties: {
        functions: { type: "boolean" },
        methods: { type: "boolean" },
        names: { type: "object" },
        parameters: { type: "boolean" },
        properties: { type: "boolean" },
        types: { type: "object" },
        variables: { type: "boolean" },
      },
      type: "object",
    },
    optionsDescription: Lint.Utils.dedent`
      An optional object with optional \`functions\`, \`methods\`, \`parameters\`,
      \`properties\` and \`variables\` properties.
      The properties are booleans and determine whether or not Finnish notation is enforced.
      All properties default to \`true\`.
      The object also has optional \`names\` and \`types\` properties which are themselves
      objects containing keys that are regular expressions and values that are booleans -
      indicating whether Finnish notation is required for particular names or types.`,
    requiresTypeInfo: true,
    ruleName: "rxjs-finnish",
    type: "style",
    typescriptOnly: true,
  };

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions(), program)
    );
  }
}

class Walker extends Lint.ProgramAwareRuleWalker {
  private names: { regExp: RegExp; validate: boolean }[] = [];
  private types: { regExp: RegExp; validate: boolean }[] = [];
  private validate = {
    functions: true,
    methods: true,
    parameters: true,
    properties: true,
    variables: true,
  };

  constructor(
    sourceFile: ts.SourceFile,
    rawOptions: Lint.IOptions,
    program: ts.Program
  ) {
    super(sourceFile, rawOptions, program);

    const [options] = this.getOptions();
    if (options) {
      if (options.names) {
        Object.entries(options.names).forEach(
          ([key, validate]: [string, boolean]) => {
            this.names.push({ regExp: new RegExp(key), validate });
          }
        );
      } else {
        this.names.push({ regExp: defaultNamesRegExp, validate: false });
      }
      if (options.types) {
        Object.entries(options.types).forEach(
          ([key, validate]: [string, boolean]) => {
            this.types.push({ regExp: new RegExp(key), validate });
          }
        );
      } else {
        this.types.push({ regExp: defaultTypesRegExp, validate: false });
      }
      this.validate = { ...this.validate, ...options };
    } else {
      this.names.push({ regExp: defaultNamesRegExp, validate: false });
      this.types.push({ regExp: defaultTypesRegExp, validate: false });
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

  protected visitObjectLiteralExpression(
    node: ts.ObjectLiteralExpression
  ): void {
    if (this.validate.properties) {
      node.properties.forEach((property) => {
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

  protected visitVariableDeclarationList(
    node: ts.VariableDeclarationList
  ): void {
    if (this.validate.variables) {
      tsutils.forEachDeclaredVariable(node, (variable) => {
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
        for (let i = 0; i < this.names.length; ++i) {
          const { regExp, validate } = this.names[i];
          if (regExp.test(text) && !validate) {
            return;
          }
        }
        for (let i = 0; i < this.types.length; ++i) {
          const { regExp, validate } = this.types[i];
          if (couldBeType(type, regExp) && !validate) {
            return;
          }
        }
        this.addFailureAtNode(name, `Finnish notation required for ${text}`);
      }
    }
  }
}
