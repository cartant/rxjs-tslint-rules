/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

import { UsedWalker } from "../support/used-walker";

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: "Disallows the calling of Observable.create.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: true,
    ruleName: "rxjs-no-create",
    type: "functionality",
    typescriptOnly: true,
  };

  public static FAILURE_STRING =
    "Observable.create is forbidden; use new Observable.";

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
    if (this.usedStaticMethods["create"]) {
      this.usedStaticMethods["create"].forEach((node) =>
        this.addFailureAtNode(node, Rule.FAILURE_STRING)
      );
    }
  }
}
