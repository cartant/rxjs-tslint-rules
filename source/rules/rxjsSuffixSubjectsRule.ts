/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import { couldBeType } from "../support/util";

const defaultTypesRegExp = /^EventEmitter$/;

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      "Disalllows subjects that don't end with the specified `suffix` option.",
    options: {
      properties: {
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
      The properties are booleans and determine whether or not subjects used in those situations need a suffix.
      \`parameters\`, \`properties\` and \`variables\` default to \`true\`, and the default suffix is 'Subject'.
      The object also has optional \`types\` properties which are themselves
      objects containing keys that are regular expressions and values that are booleans -
      indicating whether suffixing is required for particular types.`,
    requiresTypeInfo: true,
    ruleName: "rxjs-suffix-subjects",
    type: "style",
    typescriptOnly: true
  };

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();

    let suffix = "Subject";
    const types: { regExp: RegExp; validate: boolean }[] = [];
    let validateOptions = {
      parameters: true,
      properties: true,
      variables: true
    };
    const message = (identifier: string) =>
      `Subject '${identifier}' must be suffixed with '${suffix}'.`;

    const { ruleArguments } = this.getOptions();
    const [options] = ruleArguments;
    if (options) {
      suffix = options.suffix;

      if (options.types) {
        Object.entries(options.types).forEach(
          ([key, validate]: [string, boolean]) => {
            types.push({ regExp: new RegExp(key), validate });
          }
        );
      } else {
        types.push({ regExp: defaultTypesRegExp, validate: false });
      }
      validateOptions = { ...validateOptions, ...options };
    } else {
      types.push({ regExp: defaultTypesRegExp, validate: false });
    }
    const suffixRegex = new RegExp(`${suffix}\\$?$`, "i");
    let identifiers: ts.Node[] = [];

    if (validateOptions.parameters) {
      identifiers = identifiers.concat(
        tsquery(sourceFile, `Parameter > Identifier`)
      );
    }

    if (validateOptions.properties) {
      identifiers = identifiers.concat(
        tsquery(
          sourceFile,
          `:matches(PropertyAssignment, PropertyDeclaration, PropertySignature, GetAccessor, SetAccessor) > Identifier`
        )
      );
    }

    if (validateOptions.variables) {
      identifiers = identifiers.concat(
        tsquery(sourceFile, `VariableDeclaration > Identifier`)
      );
    }

    identifiers.forEach(identifier => {
      const type = typeChecker.getTypeAtLocation(identifier);
      const text = identifier.getText();
      if (!suffixRegex.test(text) && couldBeType(type, "Subject")) {
        for (let i = 0; i < types.length; ++i) {
          const { regExp, validate } = types[i];
          if (couldBeType(type, regExp) && !validate) {
            return;
          }
        }

        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            identifier.getStart(),
            identifier.getStart() + identifier.getWidth(),
            message(text),
            this.ruleName
          )
        );
      }
    });
    return failures;
  }
}
