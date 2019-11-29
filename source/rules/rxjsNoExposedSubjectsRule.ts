/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import * as peer from "../support/peer";
import { couldBeType } from "../support/util";

const defaultAllowedTypesRegExp = /^EventEmitter$/;

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description: "Disallows exposed subjects.",
    options: {
      properties: {
        allowProtected: { type: "boolean" }
      },
      type: "object"
    },
    optionsDescription: Lint.Utils.dedent`
      An optional object with optional \`allowProtected\` property - which defaults to \`false\`.`,
    requiresTypeInfo: true,
    ruleName: "rxjs-no-exposed-subjects",
    type: "functionality",
    typescriptOnly: true
  };

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new RxjsNoExposedSubjects(sourceFile, this.getOptions(), program)
    );
  }
}

class RxjsNoExposedSubjects extends Lint.ProgramAwareRuleWalker {
  private allowProtected = false;

  constructor(
    sourceFile: ts.SourceFile,
    rawOptions: Lint.IOptions,
    program: ts.Program
  ) {
    super(sourceFile, rawOptions, program);
    const [options] = this.getOptions();
    if (options) {
      this.allowProtected = options.allowProtected;
    }
  }

  protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
    node.parameters.forEach(param => this.validateNode(param));
    super.visitConstructorDeclaration(node);
  }

  protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
    this.validateNode(node);
    super.visitPropertyDeclaration(node);
  }

  protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
    this.validateNode(node, node.type);
    super.visitMethodDeclaration(node);
  }

  protected visitMethodSignature(node: ts.SignatureDeclaration): void {
    this.validateNode(node, node.type);
    super.visitMethodSignature(node);
  }

  protected visitGetAccessor(node: ts.AccessorDeclaration): void {
    this.validateNode(node);
    super.visitGetAccessor(node);
  }

  protected visitSetAccessor(node: ts.AccessorDeclaration): void {
    this.validateNode(node);
    super.visitSetAccessor(node);
  }

  private validateNode(node: ts.Node, typeNode?: ts.Node): void {
    const { name } = node as any;
    if (name) {
      const text = name.getText();
      const { allowProtected } = this;
      const protectedModifier =
        allowProtected &&
        tsutils.getModifier(node, ts.SyntaxKind.ProtectedKeyword);
      const privateModifier = tsutils.getModifier(
        node,
        ts.SyntaxKind.PrivateKeyword
      );
      const type = this.getTypeChecker().getTypeAtLocation(typeNode || node);

      if (
        !(protectedModifier || privateModifier) &&
        couldBeType(type, "Subject") &&
        !couldBeType(type, defaultAllowedTypesRegExp)
      ) {
        this.addFailureAtNode(
          name,
          `Subject '${text}' must be private${
            allowProtected ? " or protected" : ""
          }.`
        );
      }
    }
  }
}
