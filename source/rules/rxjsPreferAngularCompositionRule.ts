/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import * as peer from "../support/peer";
import { couldBeType, isThis } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description:
      "Enforces the composition of subscriptions within an Angular component.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-prefer-angular-composition",
    type: "style",
    typescriptOnly: true
  };

  public static FAILURE_STRING_NOT_COMPOSED = "Subscription not composed";
  public static FAILURE_STRING_NOT_IMPLEMENTED = "ngOnDestroy not implemented";
  public static FAILURE_STRING_NOT_UNSUBSCRIBED =
    "Composed subscription not unsubscribed";
  /*tslint:disable:semicolon*/
  public static FAILURE_MESSAGE_NOT_DECLARED = (name: string) =>
    `Composed subscription '${name}' not a class property`;
  /*tslint:enable:semicolon*/

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const classDeclarations = tsquery(
      sourceFile,
      `ClassDeclaration:has(Decorator[expression.expression.name="Component"])`
    ) as ts.ClassDeclaration[];
    classDeclarations.forEach(classDeclaration => {
      const subscriptions = new Set<string>();
      const callExpressions = tsquery(
        classDeclaration,
        `CallExpression[expression.name.text="subscribe"]`
      ) as ts.CallExpression[];
      callExpressions.forEach(callExpression => {
        const { expression } = callExpression;
        if (ts.isPropertyAccessExpression(expression)) {
          const { expression: object, name: property } = expression;
          const type = typeChecker.getTypeAtLocation(object);
          if (!couldBeType(type, "Observable")) {
            return;
          }
          if (isComposed(callExpression, typeChecker, subscriptions)) {
            return;
          }
          failures.push(
            new Lint.RuleFailure(
              sourceFile,
              property.getStart(),
              property.getStart() + property.getWidth(),
              Rule.FAILURE_STRING_NOT_COMPOSED,
              this.ruleName
            )
          );
        }
      });
      if (callExpressions.length === 0) {
        return;
      }

      const methodDeclarations = tsquery(
        classDeclaration,
        `MethodDeclaration[name.text="ngOnDestroy"]`
      ) as ts.MethodDeclaration[];
      if (methodDeclarations.length === 0) {
        const { name } = classDeclaration;
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            name.getStart(),
            name.getStart() + name.getWidth(),
            Rule.FAILURE_STRING_NOT_IMPLEMENTED,
            this.ruleName
          )
        );
        return;
      }
      const [methodDeclaration] = methodDeclarations;

      subscriptions.forEach(subscription => {
        const propertyDeclarations = tsquery(
          classDeclaration,
          `PropertyDeclaration[name.text="${subscription}"]`
        ) as ts.PropertyDeclaration[];
        if (propertyDeclarations.length === 0) {
          const { name } = classDeclaration;
          failures.push(
            new Lint.RuleFailure(
              sourceFile,
              name.getStart(),
              name.getStart() + name.getWidth(),
              Rule.FAILURE_MESSAGE_NOT_DECLARED(subscription),
              this.ruleName
            )
          );
          return;
        }
        const [propertyDeclaration] = propertyDeclarations;

        const callExpressions = tsquery(
          methodDeclaration,
          `CallExpression[expression.expression.name.text="${subscription}"][expression.name.text="unsubscribe"], CallExpression[expression.expression.text="${subscription}"][expression.name.text="unsubscribe"]`
        );
        if (callExpressions.length === 0) {
          const { name } = propertyDeclaration;
          failures.push(
            new Lint.RuleFailure(
              sourceFile,
              name.getStart(),
              name.getStart() + name.getWidth(),
              Rule.FAILURE_STRING_NOT_UNSUBSCRIBED,
              this.ruleName
            )
          );
        }
      });
    });
    return failures;
  }
}

function getBlock(node: ts.Node): ts.Block | undefined {
  let { parent } = node;
  while (parent && !ts.isBlock(parent)) {
    parent = parent.parent;
  }
  return parent as ts.Block | undefined;
}

function getCalledName(
  node: ts.Node
): ts.Identifier | ts.PrivateIdentifier | undefined {
  if (ts.isIdentifier(node)) {
    return node;
  } else if (ts.isPropertyAccessExpression(node) && isThis(node.expression)) {
    return node.name;
  }
  return undefined;
}

function getCalledObject(
  callExpression: ts.CallExpression
): ts.Node | undefined {
  const { expression } = callExpression;
  if (ts.isPropertyAccessExpression(expression)) {
    return expression.expression;
  }
  return undefined;
}

function isComposed(
  callExpression: ts.CallExpression,
  typeChecker: ts.TypeChecker,
  subscriptions: Set<string>
): boolean {
  const { parent } = callExpression;
  if (
    ts.isCallExpression(parent) &&
    ts.isPropertyAccessExpression(parent.expression)
  ) {
    const { expression: object, name: property } = parent.expression;
    const { text } = property;
    if (text !== "add") {
      return false;
    }
    if (!couldBeType(typeChecker.getTypeAtLocation(object), "Subscription")) {
      return false;
    }
    const name = getCalledName(object);
    if (!name) {
      return false;
    }
    subscriptions.add(name.text);
    return true;
  }
  if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
    return isVariableComposed(parent.name, typeChecker, subscriptions);
  }
  if (
    ts.isBinaryExpression(parent) &&
    ts.isIdentifier(parent.left) &&
    parent.operatorToken.kind === ts.SyntaxKind.EqualsToken
  ) {
    return isVariableComposed(parent.left, typeChecker, subscriptions);
  }
  return false;
}

function isVariableComposed(
  identifier: ts.Identifier,
  typeChecker: ts.TypeChecker,
  subscriptions: Set<string>
): boolean {
  const { text } = identifier;
  const block = getBlock(identifier);
  if (block) {
    const callExpressions = tsquery(
      block,
      `CallExpression[expression.name.text="add"] > Identifier[text="${text}"]`
    )
      .map(identifier => identifier.parent)
      .filter((callExpression: ts.CallExpression) => {
        if (callExpression.end < identifier.pos) {
          return false;
        }
        const object = getCalledObject(callExpression);
        if (!object) {
          return false;
        }
        if (
          !couldBeType(typeChecker.getTypeAtLocation(object), "Subscription")
        ) {
          return false;
        }
        return true;
      }) as ts.CallExpression[];
    if (callExpressions.length === 0) {
      return false;
    }
    const [callExpression] = callExpressions;
    const { expression } = callExpression;
    if (!ts.isPropertyAccessExpression(expression)) {
      return false;
    }
    const { expression: object } = expression;
    const name = getCalledName(object);
    if (!name) {
      return false;
    }
    subscriptions.add(name.text);
    return true;
  }
  return false;
}
