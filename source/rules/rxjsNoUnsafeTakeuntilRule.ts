/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { couldBeType, isReferenceType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: "Disallows the application of operators after takeUntil.",
    options: {
      properties: {
        alias: { type: "array", items: { type: "string" } },
        allow: { type: "array", items: { type: "string" } }
      },
      type: "object"
    },
    optionsDescription: Lint.Utils.dedent`
      An optional object with optional \`alias\` and \`allow\` properties.
      The \`alias\` property is an array containing the names of operators that aliases for \`takeUntil\`.
      The \`allow\` property is an array containing the names of the operators that are allowed to follow \`takeUntil\`.`,
    requiresTypeInfo: true,
    ruleName: "rxjs-no-unsafe-takeuntil",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING =
    "Applying operators after takeUntil is forbidden";

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
  private allow: string[] = [
    "count",
    "defaultIfEmpty",
    "endWith",
    "every",
    "finalize",
    "finally",
    "isEmpty",
    "last",
    "max",
    "min",
    "publish",
    "publishBehavior",
    "publishLast",
    "publishReplay",
    "reduce",
    "share",
    "shareReplay",
    "skipLast",
    "takeLast",
    "throwIfEmpty",
    "toArray"
  ];
  private match = /^takeUntil$/;

  constructor(
    sourceFile: ts.SourceFile,
    options: Lint.IOptions,
    program: ts.Program
  ) {
    super(sourceFile, options, program);

    const [ruleOptions] = this.getOptions();
    if (ruleOptions) {
      if (ruleOptions.hasOwnProperty("alias")) {
        this.match = new RegExp(
          `^(${ruleOptions.alias.concat("takeUntil").join("|")})$`
        );
      }
      if (ruleOptions.hasOwnProperty("allow")) {
        this.allow = ruleOptions.allow;
      }
    }
  }

  protected visitCallExpression(node: ts.CallExpression): void {
    const { expression: propertyAccessExpression } = node;
    if (tsutils.isPropertyAccessExpression(propertyAccessExpression)) {
      const { expression } = propertyAccessExpression;
      const propertyName = propertyAccessExpression.name.getText();
      const typeChecker = this.getTypeChecker();
      const type = typeChecker.getTypeAtLocation(expression);

      if (isReferenceType(type) && couldBeType(type.target, "Observable")) {
        if (this.match.test(propertyName)) {
          this.walkPatchedOperators(node, propertyAccessExpression.name);
        } else if (propertyName === "pipe") {
          this.walkPipedOperators(node);
        }
      }
    }

    super.visitCallExpression(node);
  }

  private walkPatchedOperators(node: ts.Node, identifier: ts.Identifier): void {
    let name: ts.Identifier | undefined = undefined;
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (tsutils.isCallExpression(parent)) {
        if (name) {
          if (name.getText() === "pipe") {
            this.walkPipedOperators(parent, identifier);
          } else if (this.allow.indexOf(name.getText()) === -1) {
            const typeChecker = this.getTypeChecker();
            const type = typeChecker.getTypeAtLocation(parent);
            if (
              isReferenceType(type) &&
              couldBeType(type.target, "Observable")
            ) {
              this.addFailureAtNode(identifier, Rule.FAILURE_STRING);
              return;
            }
          }
        }
      } else if (tsutils.isPropertyAccessExpression(parent)) {
        name = parent.name;
      } else {
        break;
      }
    }
  }

  private walkPipedOperators(
    node: ts.CallExpression,
    identifier: ts.Identifier | null = null
  ): void {
    const some = (args: {
      some(callback: (arg: ts.Expression) => boolean): boolean;
    }) =>
      args.some(arg => {
        if (
          tsutils.isCallExpression(arg) &&
          tsutils.isIdentifier(arg.expression) &&
          this.allow.indexOf(arg.expression.getText()) !== -1
        ) {
          return false;
        }
        return true;
      });

    if (identifier) {
      if (some(node.arguments.slice(0))) {
        this.addFailureAtNode(identifier, Rule.FAILURE_STRING);
      }
    } else {
      node.arguments.forEach((arg, index) => {
        if (
          tsutils.isCallExpression(arg) &&
          tsutils.isIdentifier(arg.expression) &&
          this.match.test(arg.expression.text)
        ) {
          const after = node.arguments.slice(index + 1);
          if (some(after)) {
            this.addFailureAtNode(arg.expression, Rule.FAILURE_STRING);
          }
        }
      });
    }
  }
}
