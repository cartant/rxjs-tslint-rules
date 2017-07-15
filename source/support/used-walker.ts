/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import { AddedWalker } from "./added-walker";
import { knownObservables, knownOperators } from "./knowns";
import { couldBeType, isReferenceType } from "./util";

export class UsedWalker extends AddedWalker {

    public usedObservables: { [key: string]: ts.Node[] } = {};
    public usedOperators: { [key: string]: ts.Node[] } = {};

    protected visitCallExpression(node: ts.CallExpression): void {

        node.forEachChild((child) => {

            if (child.kind === ts.SyntaxKind.PropertyAccessExpression) {

                const propertyAccessExpression = child as ts.PropertyAccessExpression;
                const name = propertyAccessExpression.name.getText();
                const typeChecker = this.getTypeChecker();
                const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);

                if (isReferenceType(type)) {
                    if (knownOperators[name] && couldBeType(type.target, "Observable")) {
                        this.add(this.usedOperators, name, propertyAccessExpression.name);
                    }
                } else {
                    if (knownObservables[name] && couldBeType(type, "Observable")) {
                        this.add(this.usedObservables, name, propertyAccessExpression.name);
                    }
                }
            }
        });

        super.visitCallExpression(node);
    }
}
