/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as tsutils from "tsutils";
import * as ts from "typescript";
import { AddedWalker } from "./added-walker";
import {
  knownObservables,
  knownOperators,
  knownPrototypeMethods,
  knownStaticMethods
} from "./knowns";
import { couldBeType, isReferenceType } from "./util";

export class UsedWalker extends AddedWalker {
  public usedObservables: { [key: string]: ts.Node[] } = {};
  public usedOperators: { [key: string]: ts.Node[] } = {};
  public usedPrototypeMethods: { [key: string]: ts.Node[] } = {};
  public usedStaticMethods: { [key: string]: ts.Node[] } = {};

  protected visitCallExpression(node: ts.CallExpression): void {
    const { expression } = node;
    if (tsutils.isPropertyAccessExpression(expression)) {
      const name = expression.name.getText();
      const typeChecker = this.getTypeChecker();
      const type = typeChecker.getTypeAtLocation(expression.expression);
      if (isReferenceType(type)) {
        if (
          knownOperators.hasOwnProperty(name) &&
          couldBeType(type.target, "Observable")
        ) {
          const actual = knownOperators[name];
          UsedWalker.add(this.usedOperators, actual, expression.name);
        } else if (
          knownPrototypeMethods.hasOwnProperty(name) &&
          couldBeType(type.target, "Observable")
        ) {
          UsedWalker.add(this.usedPrototypeMethods, name, expression.name);
        }
      } else {
        if (
          knownObservables.hasOwnProperty(name) &&
          couldBeType(type, "Observable")
        ) {
          const actual = knownObservables[name];
          UsedWalker.add(this.usedObservables, actual, expression.name);
        } else if (
          knownStaticMethods.hasOwnProperty(name) &&
          couldBeType(type, "Observable")
        ) {
          UsedWalker.add(this.usedStaticMethods, name, expression.name);
        }
      }
    }
    super.visitCallExpression(node);
  }
}
