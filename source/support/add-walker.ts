/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";

const knownObservables = [
    "bindCallback",
    "bindNodeCallback",
    "combineLatest",
    "concat",
    "defer",
    "empty",
    "forkJoin",
    "from",
    "fromEvent",
    "fromEventPattern",
    "fromPromise",
    "if",
    "interval",
    "merge",
    "never",
    "of",
    "pairs",
    "range",
    "throw",
    "timer",
    "using",
    "zip"
];

const knownOperators = [
    "audit",
    "auditTime",
    "buffer",
    "bufferCount",
    "bufferTime",
    "bufferToggle",
    "bufferWhen",
    "catch",
    "combineAll",
    "combineLatest",
    "concat",
    "concatAll",
    "concatMap",
    "concatMapTo",
    "count",
    "debounce",
    "debounceTime",
    "defaultIfEmpty",
    "delay",
    "delayWhen",
    "dematerialize",
    "distinct",
    "distinctUntilChanged",
    "distinctUntilKeyChanged",
    "do",
    "elementAt",
    "every",
    "exhaust",
    "exhaustMap",
    "expand",
    "filter",
    "finally",
    "find",
    "findIndex",
    "first",
    "groupBy",
    "ignoreElements",
    "isEmpty",
    "last",
    "let",
    "map",
    "mapTo",
    "materialize",
    "max",
    "merge",
    "mergeAll",
    "mergeMap",
    "mergeMapTo",
    "mergeScan",
    "min",
    "multicast",
    "observeOn",
    "onErrorResumeNext",
    "pairwise",
    "partition",
    "pluck",
    "publish",
    "publishBehavior",
    "publishLast",
    "publishReplay",
    "race",
    "reduce",
    "repeat",
    "repeatWhen",
    "retry",
    "retryWhen",
    "sample",
    "sampleTime",
    "scan",
    "sequenceEqual",
    "share",
    "single",
    "skip",
    "skipUntil",
    "skipWhile",
    "startWith",
    "subscribeOn",
    "switch",
    "switchMap",
    "switchMapTo",
    "take",
    "takeLast",
    "takeUntil",
    "takeWhile",
    "throttle",
    "throttleTime",
    "timeInterval",
    "timeout",
    "timeoutWith",
    "timestamp",
    "toArray",
    "toPromise",
    "window",
    "windowCount",
    "windowTime",
    "windowToggle",
    "windowWhen",
    "withLatestFrom",
    "zip",
    "zipAll"
];

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
                    if (couldBeObservableType(type.target) && (knownOperators.indexOf(name) !== -1)) {
                        this.add(this.usedOperators, name, propertyAccessExpression.name);
                    }
                } else {
                    if (couldBeObservableType(type) && (knownObservables.indexOf(name) !== -1)) {
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
