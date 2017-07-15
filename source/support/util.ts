/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";

export function couldBeType(type: ts.Type, name: string): boolean {

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

export function isReferenceType(type: ts.Type): type is ts.TypeReference {

    return Lint.isTypeFlagSet(type, ts.TypeFlags.Object) &&
        Lint.isObjectFlagSet(type as ts.ObjectType, ts.ObjectFlags.Reference);
}

export function isType(type: ts.Type, name: string): boolean {

    return Boolean(type.symbol) && type.symbol.name === name;
}

export function isUnionType(type: ts.Type): type is ts.UnionType {

    return Lint.isTypeFlagSet(type, ts.TypeFlags.Union);
}
