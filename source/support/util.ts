/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as ts from "typescript";
import * as tsutils from "tsutils";
import { InternalSymbolName } from "typescript";

export function couldBeFunction(type: ts.Type): boolean {
    return (type.getCallSignatures().length > 0) ||
        couldBeType(type, "Function") ||
        couldBeType(type, "ArrowFunction") ||
        couldBeType(type, InternalSymbolName.Function);
}

export function couldBeType(type: ts.Type, name: string | RegExp): boolean {

    if (isReferenceType(type)) {
        type = type.target;
    }

    if (isType(type, name)) {
        return true;
    }

    if (isUnionType(type)) {
        return type.types.some((t) => couldBeType(t, name));
    }

    const baseTypes = type.getBaseTypes();
    return Boolean(baseTypes) && baseTypes.some((t) => couldBeType(t, name));
}

export function isConstDeclaration(declaration: ts.Declaration): boolean {

    let variableDeclarationList: ts.VariableDeclarationList | null = null;

    if (tsutils.isVariableDeclaration(declaration)) {
        if (tsutils.isVariableDeclarationList(declaration.parent)) {
            variableDeclarationList = declaration.parent;
        }
    } else if (tsutils.isBindingElement(declaration)) {
        let parent: ts.Node = declaration.parent;
        while (tsutils.isBindingPattern(parent) || tsutils.isVariableDeclaration(parent)) {
            parent = parent.parent;
        }
        if (tsutils.isVariableDeclarationList(parent)) {
            variableDeclarationList = parent;
        }
    }

    if (variableDeclarationList) {
        return tsutils.getVariableDeclarationKind(variableDeclarationList) === tsutils.VariableDeclarationKind.Const;
    }
    return false;
}

export function isInstanceofCtor(node: ts.Node): boolean {

    const { parent } = node;
    return tsutils.isBinaryExpression(parent) &&
        (node === parent.right) &&
        (parent.operatorToken.kind === ts.SyntaxKind.InstanceOfKeyword);
}

export function isReferenceType(type: ts.Type): type is ts.TypeReference {

    return tsutils.isTypeFlagSet(type, ts.TypeFlags.Object) &&
        tsutils.isObjectFlagSet(type as ts.ObjectType, ts.ObjectFlags.Reference);
}

export function isThis(node: ts.Node): boolean {

    return node.kind === ts.SyntaxKind.ThisKeyword;
}

export function isType(type: ts.Type, name: string | RegExp): boolean {

    if (!type.symbol) {
        return false;
    }
    return (typeof name === "string") ?
        (type.symbol.name === name) :
        Boolean(type.symbol.name.match(name));
}

export function isUnionType(type: ts.Type): type is ts.UnionType {

    return tsutils.isTypeFlagSet(type, ts.TypeFlags.Union);
}

export function isWithinCallExpressionExpression(node: ts.Node): boolean {

    let { parent } = node;
    while (parent && tsutils.isPropertyAccessExpression(parent)) {
        node = parent;
        parent = node.parent;
    }
    return parent && tsutils.isCallExpression(parent) && (node === parent.expression);
}

export function isWithinParameterDeclaration(node: ts.Node): boolean {

    if (tsutils.isParameterDeclaration(node)) {
        return true;
    }
    return tsutils.isBindingElement(node) &&
        tsutils.isBindingPattern(node.parent) &&
        tsutils.isParameterDeclaration(node.parent.parent);
}
