/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";

const knownObservables = {
    "bindCallback": true,
    "bindNodeCallback": true,
    "combineLatest": true,
    "concat": true,
    "defer": true,
    "empty": true,
    "forkJoin": true,
    "from": true,
    "fromEvent": true,
    "fromEventPattern": true,
    "fromPromise": true,
    "if": true,
    "interval": true,
    "merge": true,
    "never": true,
    "of": true,
    "pairs": true,
    "range": true,
    "throw": true,
    "timer": true,
    "using": true,
    "zip": true
};

const knownOperators = {
    "audit": true,
    "auditTime": true,
    "buffer": true,
    "bufferCount": true,
    "bufferTime": true,
    "bufferToggle": true,
    "bufferWhen": true,
    "catch": true,
    "combineAll": true,
    "combineLatest": true,
    "concat": true,
    "concatAll": true,
    "concatMap": true,
    "concatMapTo": true,
    "count": true,
    "debounce": true,
    "debounceTime": true,
    "defaultIfEmpty": true,
    "delay": true,
    "delayWhen": true,
    "dematerialize": true,
    "distinct": true,
    "distinctUntilChanged": true,
    "distinctUntilKeyChanged": true,
    "do": true,
    "elementAt": true,
    "every": true,
    "exhaust": true,
    "exhaustMap": true,
    "expand": true,
    "filter": true,
    "finally": true,
    "find": true,
    "findIndex": true,
    "first": true,
    "groupBy": true,
    "ignoreElements": true,
    "isEmpty": true,
    "last": true,
    "let": true,
    "map": true,
    "mapTo": true,
    "materialize": true,
    "max": true,
    "merge": true,
    "mergeAll": true,
    "mergeMap": true,
    "mergeMapTo": true,
    "mergeScan": true,
    "min": true,
    "multicast": true,
    "observeOn": true,
    "onErrorResumeNext": true,
    "pairwise": true,
    "partition": true,
    "pluck": true,
    "publish": true,
    "publishBehavior": true,
    "publishLast": true,
    "publishReplay": true,
    "race": true,
    "reduce": true,
    "repeat": true,
    "repeatWhen": true,
    "retry": true,
    "retryWhen": true,
    "sample": true,
    "sampleTime": true,
    "scan": true,
    "sequenceEqual": true,
    "share": true,
    "single": true,
    "skip": true,
    "skipUntil": true,
    "skipWhile": true,
    "startWith": true,
    "subscribeOn": true,
    "switch": true,
    "switchMap": true,
    "switchMapTo": true,
    "take": true,
    "takeLast": true,
    "takeUntil": true,
    "takeWhile": true,
    "throttle": true,
    "throttleTime": true,
    "timeInterval": true,
    "timeout": true,
    "timeoutWith": true,
    "timestamp": true,
    "toArray": true,
    "toPromise": true,
    "window": true,
    "windowCount": true,
    "windowTime": true,
    "windowToggle": true,
    "windowWhen": true,
    "withLatestFrom": true,
    "zip": true,
    "zipAll": true
};

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
