/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows unsafe switchMap usage in effects and epics.",
        options: {
            properties: {
                allow: {
                    oneOf: [
                        { type: "string" },
                        { type: "array", items: { type: "string" } }
                    ]
                },
                disallow: {
                    oneOf: [
                        { type: "string" },
                        { type: "array", items: { type: "string" } }
                    ]
                }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
            An optional object with the optional properties \`allow\` or \`disallow\`.
            Either can be specified, but not both.
            The properties can be specifed as regular expression strings or as arrays containing
            the string fragments that are allowed or disallowed.`,
        requiresTypeInfo: true,
        ruleName: "rxjs-no-unsafe-switchmap",
        type: "functionality",
        typescriptOnly: true
    };

    public static FAILURE_STRING = "Unsafe switchMap usage in effects and epics is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    // Example options:
    // { "disallow": ["create", "delete", "post", "put", "remove", "set", "update"] }
    // { "disallow": "(create|delete|post|put|remove|set|update)" }
    // { "allow": ["get", "read"] }
    // { "allow": "(get|read)" }
}
