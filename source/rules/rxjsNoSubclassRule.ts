/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import * as peer from "../support/peer";
import { couldBeType } from "../support/util";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description: "Disallows subclassing RxJS classes.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-subclass",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Subclassing RxJS classes is forbidden";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    const queryNames = [
      "AsyncSubject",
      "BehaviorSubject",
      "Observable",
      "ReplaySubject",
      "Scheduler",
      "Subject",
      "Subscriber"
    ];

    // Subject extends Observable, so there's no need to explicitly check
    // for it and the classes that extend it.
    const couldBeNames = ["Observable", "Scheduler", "Subscriber"];

    const classDeclarations = tsquery(
      sourceFile,
      `ClassDeclaration:has(HeritageClause ExpressionWithTypeArguments Identifier[name=/^(${queryNames.join(
        "|"
      )})$/])`
    );
    classDeclarations.forEach(node => {
      const classDeclaration = node as ts.ClassDeclaration;
      const heritageClauses = classDeclaration.heritageClauses as ts.NodeArray<
        ts.HeritageClause
      >;
      heritageClauses.forEach(heritageClause => {
        if (heritageClause.token === ts.SyntaxKind.ExtendsKeyword) {
          heritageClause.types.forEach(heritageType => {
            const type = typeChecker.getTypeAtLocation(heritageType);
            if (
              couldBeNames.some(name =>
                couldBeType(type, name, {
                  name: /[\/\\]rxjs[\/\\]/,
                  typeChecker
                })
              )
            ) {
              failures.push(
                new Lint.RuleFailure(
                  sourceFile,
                  heritageType.getStart(),
                  heritageType.getStart() + heritageType.getWidth(),
                  Rule.FAILURE_STRING,
                  this.ruleName
                )
              );
            }
          });
        }
      });
    });
    return failures;
  }
}
