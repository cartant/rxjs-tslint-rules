/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import * as peer from "../support/peer";

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description: "Disallows the importation from index modules.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: false,
    ruleName: "rxjs-no-index",
    type: "functionality",
    typescriptOnly: false
  };

  public static FAILURE_STRING =
    "RxJS imports from index modules are forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
  }
}

class Walker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration): void {
    const moduleSpecifier = node.moduleSpecifier.getText();
    const match = moduleSpecifier.match(/^['"]rxjs(\/\w+)?\/index/);
    if (match) {
      this.addFailureAtNode(
        node.moduleSpecifier,
        "RxJS imports from index are forbidden - see https://github.com/ReactiveX/rxjs/issues/4230"
      );
    }
    super.visitImportDeclaration(node);
  }
}
