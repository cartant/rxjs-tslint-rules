/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import { knownObservables, knownOperators } from "./knowns";

export class AddWalker extends Lint.ProgramAwareRuleWalker {

    protected addedObservables: { [key: string]: ts.Node[] } = {};
    protected addedOperators: { [key: string]: ts.Node[] } = {};
    protected usedObservables: { [key: string]: ts.Node[] } = {};
    protected usedOperators: { [key: string]: ts.Node[] } = {};

    protected onSourceFileEnd(): void {}

    protected visitCallExpression(node: ts.CallExpression): void {

        node.forEachChild((child) => {

            if (child.kind === ts.SyntaxKind.PropertyAccessExpression) {

                const propertyAccessExpression = child as ts.PropertyAccessExpression;
                const name = propertyAccessExpression.name.getText();
                const typeChecker = this.getTypeChecker();
                const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);

                if (isReferenceType(type)) {
                    if (knownOperators[name] && couldBeObservableType(type.target)) {
                        this.add(this.usedOperators, name, propertyAccessExpression.name);
                    }
                } else {
                    if (knownObservables[name] && couldBeObservableType(type)) {
                        this.add(this.usedObservables, name, propertyAccessExpression.name);
                    }
                }
            }
        });

        super.visitCallExpression(node);
    }

    protected visitImportDeclaration(node: ts.ImportDeclaration): void {

        const moduleSpecifier = node.moduleSpecifier.getText();

        let match = moduleSpecifier.match(/["']rxjs\/add\/observable\/(\w+)["']/);
        if (match) {
            this.add(this.addedObservables, match[1], node);
        } else {
            match = moduleSpecifier.match(/["']rxjs\/add\/operator\/(\w+)["']/);
            if (match) {
                this.add(this.addedOperators, match[1], node);
            }
        }

        super.visitImportDeclaration(node);
    }

    protected visitNode(node: ts.Node): void {

        super.visitNode(node);

        if (node.kind === ts.SyntaxKind.SourceFile) {
            this.onSourceFileEnd();
        }
    }

    private add(
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
}

function couldBeObservableType(type: ts.Type): boolean {

    if (isReferenceType(type)) {
        type = type.target;
    }

    if (isObservableType(type)) {
        return true;
    }

    if (isUnionType(type)) {
        return type.types.some(couldBeObservableType);
    }

    const baseTypes = type.getBaseTypes();
    return Boolean(baseTypes) && baseTypes.some(couldBeObservableType);
}

function isObservableType(type: ts.Type): boolean {

    return Boolean(type.symbol) && type.symbol.name === "Observable";
}

function isReferenceType(type: ts.Type): type is ts.TypeReference {

    return Lint.isTypeFlagSet(type, ts.TypeFlags.Object) &&
        Lint.isObjectFlagSet(type as ts.ObjectType, ts.ObjectFlags.Reference);
}

function isUnionType(type: ts.Type): type is ts.UnionType {

    return Lint.isTypeFlagSet(type, ts.TypeFlags.Union);
}
