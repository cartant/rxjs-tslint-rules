/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/* tslint:disable:no-use-before-declare */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import { couldBeType } from "../support/util";

const defaultTypesRegExp = /^EventEmitter$/;

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      "Ensures subjects are suffixed with suffix specified by `suffix` option.",
    options: {
      properties: {
        functions: { type: "boolean" },
        methods: { type: "boolean" },
        parameters: { type: "boolean" },
        properties: { type: "boolean" },
        suffix: { type: "string" },
        types: { type: "object" },
        variables: { type: "boolean" }
      },
      type: "object"
    },
    optionsDescription: Lint.Utils.dedent`
      An optional object with optional \`parameters\`, \`properties\` and \`variables\` properties.
      The properies are booleans and determine whether or not subjects of that particular expression need a suffix.
      \`parameters\`, \`properties\` and \`variables\` default to \`true\`.
      The object also has optional \`types\` properties which are themselves
      objects containing keys that are regular expressions and values that are booleans -
      indicating whether suffixing is required for particular types.`,
    requiresTypeInfo: true,
    ruleName: '"rxjs-suffix-subjects"',
    type: "style",
    typescriptOnly: true
  };

  private SUFFIX = "Subject";
  private types: { regExp: RegExp; validate: boolean }[] = [];
  private validate = {
    parameters: true,
    properties: true,
    variables: true
  };
  public readonly FAILURE_MESSAGE = (identifier: string) =>
    `Subject '${identifier}' must be suffixed with '${this.SUFFIX}'.`

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    // get configurations
    const { ruleArguments } = this.getOptions();
    const [options] = ruleArguments;
    if (options) {
      this.SUFFIX = options.suffix;
      if (options.types) {
        Object.entries(options.types).forEach(
          ([key, validate]: [string, boolean]) => {
            this.types.push({ regExp: new RegExp(key), validate });
          }
        );
      } else {
        this.types.push({ regExp: defaultTypesRegExp, validate: false });
      }
      this.validate = { ...this.validate, ...options };
    } else {
       this.types.push({ regExp: defaultTypesRegExp, validate: false });
    }

    let identifiers: ts.Node[] = [];

    if (this.validate.parameters) {
      identifiers = identifiers.concat(
        tsquery(sourceFile, `Parameter > Identifier`)
      );
    }

    if (this.validate.properties) {
      identifiers = identifiers.concat(
        tsquery(
          sourceFile,
          `:matches(PropertyAssignment, PropertyDeclaration, PropertySignature, GetAccessor, SetAccessor) > Identifier`
        )
      );
    }

    if (this.validate.variables) {
      identifiers = identifiers.concat(
        tsquery(sourceFile, `VariableDeclaration > Identifier`)
      );
    }

    identifiers.forEach(identifier => {
      const currentIdentifier = identifier.parent as ts.Identifier;
      const type = typeChecker.getTypeAtLocation(currentIdentifier);
      const text = identifier.getText();
      if (!/[Ss]ubject\$?$/.test(text) && couldBeType(type, "Subject")) {
        for (let i = 0; i < this.types.length; ++i) {
          const { regExp, validate } = this.types[i];
          if (couldBeType(type, regExp) && !validate) {
            return;
          }
        }

        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            identifier.getStart(),
            identifier.getStart() + identifier.getWidth(),
            this.FAILURE_MESSAGE(text),
            this.ruleName
          )
        );
      }
    });
    return failures;
  }
}
