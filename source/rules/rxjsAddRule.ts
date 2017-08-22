/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as path from "path";
import * as ts from "typescript";

import { AddedWalker } from "../support/added-walker";
import { UsedWalker } from "../support/used-walker";

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Enforces the importation of patched observables and operators used in the module.",
        options: {
            properties: {
                allowElsewhere: { type: "boolean" },
                allowUnused: { type: "boolean" },
                file: { type: "string" }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
            An optional object with the property \`file\`.
            This the path of the module - relative to the \`tsconfig.json\` - that imports the patched observables and operators.
            If \`file\` is specified, the \`allowElsewhere\` and \`allowUnused\` options can be used to configure whether or not
            patched imports are allowed in other files and whether or not unused patched imports are allowed.
            Both \`allowElsewhere\` and \`allowUnused\` default to \`false\`.
            If not specified, patched observables and operators must be imported in the modules in which they are used.`,
        requiresTypeInfo: true,
        ruleName: "rxjs-add",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "RxJS add import is missing";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {

        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends UsedWalker {

    private static fileWalkerCache = new Map<ts.Program, AddedWalker>();

    protected onSourceFileEnd(): void {

        let { addedObservables, addedOperators }  = this;
        let failure = Rule.FAILURE_STRING;

        const [options] = this.getOptions();
        if (options && options.file) {

            const walker = this.walkFile(options.file);
            addedObservables = walker.addedObservables;
            addedOperators = walker.addedOperators;
            failure = `${Rule.FAILURE_STRING} from ${options.file}`;

            if (this.normalizeFile(this.sourceFilePath) === this.normalizeFile(walker.sourceFilePath)) {

                if (!options.allowUnused) {

                    const program = this.getProgram();
                    const sourceFiles = program.getSourceFiles();

                    const usedObservables: { [key: string]: ts.Node[] } = {};
                    const usedOperators: { [key: string]: ts.Node[] } = {};

                    for (let i = 0, length = sourceFiles.length; i < length; ++i) {

                        const sourceFile = sourceFiles[i];
                        if (!sourceFile["isDeclarationFile"]) {

                            const sourceFileWalker = new UsedWalker(sourceFile, {
                                disabledIntervals: [],
                                ruleArguments: [],
                                ruleName: this.getRuleName(),
                                ruleSeverity: "error"
                            }, program);
                            sourceFileWalker.walk(sourceFile);

                            Object.keys(sourceFileWalker.usedObservables).forEach((key) => {
                                sourceFileWalker.usedObservables[key].forEach((node) => {
                                    UsedWalker.add(usedObservables, key, node);
                                });
                            });

                            Object.keys(sourceFileWalker.usedOperators).forEach((key) => {
                                sourceFileWalker.usedOperators[key].forEach((node) => {
                                    UsedWalker.add(usedOperators, key, node);
                                });
                            });
                        }
                    }

                    Object.keys(addedObservables).forEach((key) => {

                        if (!usedObservables[key]) {
                            addedObservables[key].forEach((node) => this.addFailureAtNode(
                                node,
                                `Unused patched observable in ${options.file}: ${key}`
                            ));
                        }
                    });

                    Object.keys(addedOperators).forEach((key) => {

                        if (!usedOperators[key]) {
                            addedOperators[key].forEach((node) => this.addFailureAtNode(
                                node,
                                `Unused patched operator in ${options.file}: ${key}`
                            ));
                        }
                    });
                }

            } else {

                if (!options.allowElsewhere) {

                    Object.keys(this.addedObservables).forEach((key) => {
                        this.addedObservables[key].forEach((node) => this.addFailureAtNode(
                            node,
                            `Patched observables are forbidden outside of ${options.file}: ${key}`
                        ));
                    });

                    Object.keys(this.addedOperators).forEach((key) => {
                        this.addedOperators[key].forEach((node) => this.addFailureAtNode(
                            node,
                            `Patched operators are forbidden outside of ${options.file}: ${key}`
                        ));
                    });
                }
            }
        }

        Object.keys(this.usedObservables).forEach((key) => {

            if (!addedObservables[key]) {
                this.usedObservables[key].forEach((node) => this.addFailureAtNode(
                    node,
                    `${failure}: ${key}`
                ));
            }
        });

        Object.keys(this.usedOperators).forEach((key) => {

            if (!addedOperators[key]) {
                this.usedOperators[key].forEach((node) => this.addFailureAtNode(
                    node,
                    `${failure}: ${key}`
                ));
            }
        });
    }

    private findSourceFile(file: string): ts.SourceFile {

        let message = "Cannot find 'tsconfig.json'";
        const program = this.getProgram();
        const rootFiles = program.getRootFileNames();

        for (let i = 0, length = rootFiles.length; i < length; ++i) {

            const configFile = ts.findConfigFile(
                this.normalizeFile(path.dirname(rootFiles[i])),
                ts.sys.fileExists
            );
            if (configFile) {
                const resolvedFile = this.normalizeFile(
                    path.resolve(path.dirname(configFile), file)
                );
                const sourceFile = program.getSourceFileByPath(resolvedFile as any);
                if (sourceFile) {
                    return sourceFile;
                } else {
                    message = `Cannot find '${resolvedFile}' in the compiled program. Has it been imported?`;
                    break;
                }
            }
        }

        throw new Error(message);
    }

    private normalizeFile(file: string): string {

        const normalized = ts["normalizeSlashes"](file);
        return ts.sys.useCaseSensitiveFileNames ? normalized : normalized.toLowerCase();
    }

    private walkFile(file: string): AddedWalker {

        const program = this.getProgram();
        let fileWalker = Walker.fileWalkerCache.get(program);
        if (!fileWalker) {

            const sourceFile = this.findSourceFile(file);
            fileWalker = new AddedWalker(sourceFile, {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: this.getRuleName(),
                ruleSeverity: "error"
            }, program);

            fileWalker.walk(sourceFile);
            Walker.fileWalkerCache.set(program, fileWalker);
        }
        return fileWalker;
    }
}
