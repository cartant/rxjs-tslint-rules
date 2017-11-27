/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as path from "path";
import * as ts from "typescript";

import { UsedWalker } from "../support/used-walker";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows the calling of patched methods.",
        options: {
            properties: {
                allowObservables: {
                    oneOf: [
                        { type: "boolean" },
                        { type: "array", items: { type: "string" } }
                    ]
                },
                allowOperators: {
                    oneOf: [
                        { type: "boolean" },
                        { type: "array", items: { type: "string" } }
                    ]
                }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
            An optional object with the optional properties \`allowObservables\` and \`allowOperators\`.
            The properties can be specifed as booleans (they default to \`false\`) or as arrays containing
            the names of the observables or opertators that are allowed.`,
        requiresTypeInfo: true,
        ruleName: "rxjs-no-patched",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "RxJS patched methods are forbidden";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends UsedWalker {

    protected onSourceFileEnd(): void {

        let allowAllObservables = false;
        let allowAllOperators = false;
        let allowedObservables: string[] = [];
        let allowedOperators: string[] = [];

        const [options] = this.getOptions();
        if (options) {
            if (options.hasOwnProperty("allowObservables")) {
                if (options.allowObservables.length) {
                    allowedObservables = options.allowObservables;
                } else {
                    allowAllObservables = Boolean(options.allowObservables);
                }
            }
            if (options.hasOwnProperty("allowOperators")) {
                if (options.allowOperators.length) {
                    allowedOperators = options.allowOperators;
                } else {
                    allowAllOperators = Boolean(options.allowOperators);
                }
            }
        }

        if (!allowAllObservables) {
            Object.keys(this.usedObservables).forEach((key) => {

                if (allowedObservables.indexOf(key) === -1) {
                    this.usedObservables[key].forEach((node) => this.addFailureAtNode(
                        node,
                        `${Rule.FAILURE_STRING}: ${key}`
                    ));
                }
            });
        }

        if (!allowAllOperators) {
            Object.keys(this.usedOperators).forEach((key) => {

                if (allowedOperators.indexOf(key) === -1) {
                    this.usedOperators[key].forEach((node) => this.addFailureAtNode(
                        node,
                        `${Rule.FAILURE_STRING}: ${key}`
                    ));
                }
            });
        }
    }
}
