/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: "Disallows exposed subjects.",
    options: null,
    optionsDescription: "Not configurable.",
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
  constructor(
    sourceFile: ts.SourceFile,
    rawOptions: Lint.IOptions,
    program: ts.Program
  ) {
    super(sourceFile, rawOptions, program);
  }

  // CASE: Properties of classes declared in constructor
  protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
    node.parameters.forEach(param => this.validateNode(param));
    super.visitConstructorDeclaration(node);
  }

  // CASE: Standard properties of Classes.
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
      const privateModifier = node.modifiers
        ? node.modifiers.find(
            modifier => modifier.kind === ts.SyntaxKind.PrivateKeyword
          )
        : null;
      const type = this.getTypeChecker().getTypeAtLocation(typeNode || node);

      if (!privateModifier && couldBeType(type, "Subject")) {
        this.addFailureAtNode(name, `Subject '${text}' must be private.`);
      }
    }
  }
}
