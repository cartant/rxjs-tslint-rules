/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { knownObservables, knownOperators } from "./knowns";

export class AddedWalker extends Lint.ProgramAwareRuleWalker {
  static add(
    map: { [key: string]: ts.Node[] },
    key: string,
    node: ts.Node
  ): void {
    let nodes = map[key];
    if (nodes === undefined) {
      map[key] = nodes = [];
    }
    nodes.push(node);
  }

  public addedObservables: { [key: string]: ts.Node[] } = {};
  public addedOperators: { [key: string]: ts.Node[] } = {};
  public sourceFilePath: string;
  protected onSourceFileEnd(): void {}

  protected visitImportDeclaration(node: ts.ImportDeclaration): void {
    const moduleSpecifier = node.moduleSpecifier.getText();

    let match = moduleSpecifier.match(/["']rxjs\/add\/observable\/(\w+)["']/);
    if (match && knownObservables[match[1]]) {
      AddedWalker.add(this.addedObservables, match[1], node);
    } else {
      match = moduleSpecifier.match(/["']rxjs\/add\/operator\/(\w+)["']/);
      if (match && knownOperators[match[1]]) {
        AddedWalker.add(this.addedOperators, match[1], node);
      }
    }

    super.visitImportDeclaration(node);
  }

  protected visitNode(node: ts.Node): void {
    super.visitNode(node);

    if (tsutils.isSourceFile(node)) {
      this.sourceFilePath = node["path"];
      this.onSourceFileEnd();
    }
  }
}
