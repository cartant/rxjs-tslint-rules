/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";
import { couldBeType } from "../support/util";

const defaultNamesRegExp = /^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$/;
const defaultTypesRegExp = /^EventEmitter$/;

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: Lint.IRuleMetadata = {
        description:
            "Ensures that subjects have access level modifier 'private'.",
        options: {
            properties: {
                constructorParams: { type: "boolean" },
                methods: { type: "boolean" },
                names: { type: "object" },
                properties: { type: "boolean" },
                types: { type: "object" }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
      An optional object with optional \`methods\`, \`constructorParams\` and \`properties\` properties
      set default to true.
      The properies are booleans and determine whether or not Finnish notation is enforced.
      class properties could be declared in the class constructor.
      The object also has optional \`names\` and \`types\` properties which are themselves
      objects containing keys that are regular expressions and values that are booleans -
      indicating whether private access level modifier is required for particular names or types.`,
        requiresTypeInfo: true,
        ruleName: '"rxjs-no-exposed-subjects"',
        type: "style",
        typescriptOnly: true
    };

    public applyWithProgram(
        sourceFile: ts.SourceFile,
        program: ts.Program
    ): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new RxjsNoExposedSubjects(sourceFile, this.getOptions(), program)
        );
    }
}

class RxjsNoExposedSubjects extends Lint.ProgramAwareRuleWalker {
    private names: { regExp: RegExp; validate: boolean }[] = [];
    private types: { regExp: RegExp; validate: boolean }[] = [];
    private validate = {
        constructorParams: true,
        methods: false,
        properties: true
    };

    constructor(
        sourceFile: ts.SourceFile,
        rawOptions: Lint.IOptions,
        program: ts.Program
    ) {
        super(sourceFile, rawOptions, program);
        const [options] = this.getOptions();
        if (options) {
            if (options.names) {
                Object.entries(options.names).forEach(
                    ([key, validate]: [string, boolean]) => {
                        this.names.push({ regExp: new RegExp(key), validate });
                    }
                );
            } else {
                this.names.push({
                    regExp: defaultNamesRegExp,
                    validate: false
                });
            }
            if (options.types) {
                Object.entries(options.types).forEach(
                    ([key, validate]: [string, boolean]) => {
                        this.types.push({ regExp: new RegExp(key), validate });
                    }
                );
            } else {
                this.types.push({
                    regExp: defaultTypesRegExp,
                    validate: false
                });
            }
            this.validate = { ...this.validate, ...options };
        } else {
            this.names.push({ regExp: defaultNamesRegExp, validate: false });
            this.types.push({ regExp: defaultTypesRegExp, validate: false });
        }
    }

    // CASE: Properties of classes declared in constructor
    protected visitConstructorDeclaration(
        node: ts.ConstructorDeclaration
    ): void {
        if (this.validate.constructorParams) {
            node.parameters.forEach(param => this.validateNode(param));
        }
        super.visitConstructorDeclaration(node);
    }

    // CASE: Standard properties of Classes.
    protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        if (this.validate.properties) {
            this.validateNode(node);
        }
        super.visitPropertyDeclaration(node);
    }

    private validateNode(node: ts.Node, typeNode?: ts.Node): void {
        const { name } = node as any;
        if (name) {
            const text = name.getText();
            const privateModifier = node.modifiers
                ? node.modifiers.find(
                      modifier => modifier.kind === ts.SyntaxKind.PrivateKeyword
                  )
                : null;
            const type = this.getTypeChecker().getTypeAtLocation(
                typeNode || node
            );

            if (!privateModifier && couldBeType(type, "Subject")) {
                for (let i = 0; i < this.names.length; ++i) {
                    const { regExp, validate } = this.names[i];
                    if (regExp.test(text) && !validate) {
                        return;
                    }
                }
                for (let i = 0; i < this.types.length; ++i) {
                    const { regExp, validate } = this.types[i];
                    if (couldBeType(type, regExp) && !validate) {
                        return;
                    }
                }

                this.addFailureAtNode(
                    name,
                    `Subject '${text}' must be private.`
                );
            }
        }
    }
}
