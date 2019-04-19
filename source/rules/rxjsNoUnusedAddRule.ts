/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as tsutils from "tsutils";
import * as peer from "../support/peer";

import { UsedWalker } from "../support/used-walker";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage:
      peer.v6 && !peer.compat ? "Rule not needed for v6." : undefined,
    description:
      "Disallows the importation of patched observables or operators that are not used in the module.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-unused-add",
    type: "maintainability",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "RxJS add import is unused";

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions(), program)
    );
  }
}

class Walker extends UsedWalker {
  protected onSourceFileEnd(): void {
    Object.keys(this.addedObservables).forEach(key => {
      if (!this.usedObservables[key]) {
        this.addedObservables[key].forEach(node =>
          this.addFailureAtNode(
            tsutils.isImportDeclaration(node) ? node.moduleSpecifier : node,
            `${Rule.FAILURE_STRING}: ${key}`
          )
        );
      }
    });

    Object.keys(this.addedOperators).forEach(key => {
      if (!this.usedOperators[key]) {
        this.addedOperators[key].forEach(node =>
          this.addFailureAtNode(
            tsutils.isImportDeclaration(node) ? node.moduleSpecifier : node,
            `${Rule.FAILURE_STRING}: ${key}`
          )
        );
      }
    });
  }
}
