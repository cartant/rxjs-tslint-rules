/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as Lint from "tslint";
import * as ts from "typescript";

export class AddedWalker extends Lint.ProgramAwareRuleWalker {

    protected addedObservables: { [key: string]: ts.Node[] } = {};
    protected addedOperators: { [key: string]: ts.Node[] } = {};

    protected add(
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

    protected onSourceFileEnd(): void {}

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
}
