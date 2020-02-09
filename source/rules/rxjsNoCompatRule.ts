/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import * as peer from "../support/peer";

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description:
      "Disallows importation from locations that depend upon 'rxjs-compat'.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: false,
    ruleName: "rxjs-no-compat",
    type: "functionality",
    typescriptOnly: false
  };

  public static FAILURE_STRING =
    "'rxjs-compat' dependent import locations are forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const importDeclarations = tsquery(
      sourceFile,
      String.raw`ImportDeclaration:has(StringLiteral[value=/^rxjs\u002f/])`
    );
    importDeclarations.forEach(node => {
      const importDeclaration = node as ts.ImportDeclaration;
      const { moduleSpecifier } = importDeclaration;
      if (
        !/^['"]rxjs\/(ajax|fetch|operators|testing|webSocket)['"]$/.test(
          moduleSpecifier.getText()
        )
      ) {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            moduleSpecifier.getStart(),
            moduleSpecifier.getStart() + moduleSpecifier.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      }
    });
    return failures;
  }
}
