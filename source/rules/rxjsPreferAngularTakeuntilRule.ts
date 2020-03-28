/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */
/*tslint:disable:no-use-before-declare*/

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import * as peer from "../support/peer";
import { couldBeType, isThis } from "../support/util";

type Options = {
  alias: string[];
  checkDestroy: boolean;
};

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description: Lint.Utils
      .dedent`Enforces the application of the takeUntil operator
      when calling subscribe within an Angular component.`,
    options: {
      properties: {
        alias: { type: "array", items: { type: "string" } },
        checkDestroy: { type: "boolean" }
      },
      type: "object"
    },
    optionsDescription: Lint.Utils.dedent`
        An optional object with optional \`alias\` and \`checkDestroy\` properties.
        The \`alias\` property is an array containing the names of operators that aliases for \`takeUntil\`.
        The \`checkDestroy\` property is a boolean that determines whether or not a \`Subject\`-based \`ngOnDestroy\` must be implemented.`,
    requiresTypeInfo: true,
    ruleName: "rxjs-prefer-angular-takeuntil",
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING_NO_TAKEUNTIL =
    "Subscribing without takeUntil is forbidden";

  public static FAILURE_STRING_NO_DESTROY = "ngOnDestroy not implemented";

  /*tslint:disable:semicolon*/
  public static FAILURE_MESSAGE_NOT_CALLED = (name: string, method: string) =>
    `'${name}.${method}()' not called`;

  public static FAILURE_MESSAGE_NOT_DECLARED = (name: string) =>
    `Subject '${name}' not a class property`;
  /*tslint:enable:semicolon*/

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const {
      ruleArguments: [options]
    } = this.getOptions();
    const { alias = [], checkDestroy = true }: Options = options || {};

    // find all classes with a @Component() decorator
    const componentClassDeclarations = tsquery(
      sourceFile,
      `ClassDeclaration:has(Decorator[expression.expression.name='Component'])`
    ) as ts.ClassDeclaration[];
    componentClassDeclarations.forEach(componentClassDeclaration => {
      failures.push(
        ...this.checkComponentClassDeclaration(
          sourceFile,
          program,
          { alias, checkDestroy },
          componentClassDeclaration
        )
      );
    });

    return failures;
  }

  /**
   * Checks a component class for occurrences of .subscribe() and corresponding takeUntil() requirements
   */
  private checkComponentClassDeclaration(
    sourceFile: ts.SourceFile,
    program: ts.Program,
    options: Options,
    componentClassDeclaration: ts.ClassDeclaration
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const typeChecker = program.getTypeChecker();
    const destroySubjectNamesBySubscribes = new Map<
      ts.Identifier | ts.PrivateIdentifier,
      Set<string>
    >();

    // find observable.subscribe() call expressions
    const subscribePropertyAccessExpressions = tsquery(
      componentClassDeclaration,
      `CallExpression > PropertyAccessExpression[name.name="subscribe"]`
    ) as ts.PropertyAccessExpression[];

    // check whether it is an observable and check the takeUntil is applied
    subscribePropertyAccessExpressions.forEach(propertyAccessExpression => {
      const type = typeChecker.getTypeAtLocation(
        propertyAccessExpression.expression
      );
      if (couldBeType(type, "Observable")) {
        failures.push(
          ...this.checkSubscribe(
            sourceFile,
            options,
            propertyAccessExpression,
            name => {
              let names = destroySubjectNamesBySubscribes.get(
                propertyAccessExpression.name
              );
              if (!names) {
                names = new Set<string>();
                destroySubjectNamesBySubscribes.set(
                  propertyAccessExpression.name,
                  names
                );
              }
              names.add(name);
            }
          )
        );
      }
    });

    // check the ngOnDestroyMethod
    if (options.checkDestroy && destroySubjectNamesBySubscribes.size > 0) {
      failures.push(
        ...this.checkNgOnDestroy(
          sourceFile,
          componentClassDeclaration,
          destroySubjectNamesBySubscribes
        )
      );
    }

    return failures;
  }

  /**
   * Checks whether a .subscribe() is preceded by a .pipe(<...>, takeUntil(<...>))
   */
  private checkSubscribe(
    sourceFile: ts.SourceFile,
    options: Options,
    subscribe: ts.PropertyAccessExpression,
    addDestroySubjectName: (name: string) => void
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const subscribeContext = subscribe.expression;
    let takeUntilFound = false;

    // check whether subscribeContext.expression is <something>.pipe()
    if (
      tsutils.isCallExpression(subscribeContext) &&
      tsutils.isPropertyAccessExpression(subscribeContext.expression) &&
      subscribeContext.expression.name.text === "pipe"
    ) {
      const pipedOperators = subscribeContext.arguments;
      pipedOperators.forEach(pipedOperator => {
        if (tsutils.isCallExpression(pipedOperator)) {
          const destroySubjectName = this.checkOperator(options, pipedOperator);
          if (destroySubjectName) {
            takeUntilFound = true;
            addDestroySubjectName(destroySubjectName);
          }
        }
      });
    }

    // add failure if there is no takeUntil() in the .pipe()
    if (!takeUntilFound) {
      failures.push(
        new Lint.RuleFailure(
          sourceFile,
          subscribe.name.getStart(),
          subscribe.name.getStart() + subscribe.name.getWidth(),
          Rule.FAILURE_STRING_NO_TAKEUNTIL,
          this.ruleName
        )
      );
    }
    return failures;
  }

  /**
   * Checks whether the operator given is takeUntil and uses an expected destroy subject name
   */
  private checkOperator(
    options: Options,
    operator: ts.CallExpression
  ): string | undefined {
    if (
      tsutils.isIdentifier(operator.expression) &&
      (operator.expression.text === "takeUntil" ||
        options.alias.includes(operator.expression.text))
    ) {
      const [arg] = operator.arguments;
      if (ts.isPropertyAccessExpression(arg) && isThis(arg.expression)) {
        return arg.name.text;
      } else if (ts.isIdentifier(arg)) {
        return arg.text;
      }
    }
    return undefined;
  }

  /**
   * Checks whether the class implements an ngOnDestroy method and invokes .next() and .complete() on the destroy subjects
   */
  private checkNgOnDestroy(
    sourceFile: ts.SourceFile,
    classDeclaration: ts.ClassDeclaration,
    destroySubjectNamesBySubscribes: Map<
      ts.Identifier | ts.PrivateIdentifier,
      Set<string>
    >
  ): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];
    const ngOnDestroyMethod = classDeclaration.members.find(
      member => member.name && member.name.getText() === "ngOnDestroy"
    );

    // check whether the ngOnDestroy method is implemented
    // and contains invocations of .next() and .complete() on destroy subjects
    if (ngOnDestroyMethod) {
      // If a subscription to a .pipe() has at least one takeUntil that has no
      // failures, the subscribe call is fine. Callers should be able to use
      // secondary takUntil operators. However, there must be at least one
      // takeUntil operator that conforms to the pattern that this rule enforces.
      const destroySubjectNames = new Set<string>();
      destroySubjectNamesBySubscribes.forEach(names =>
        names.forEach(name => destroySubjectNames.add(name))
      );

      const destroySubjectResultsByName = new Map<
        string,
        { failures: Lint.RuleFailure[]; report: boolean }
      >();
      destroySubjectNames.forEach(name => {
        destroySubjectResultsByName.set(name, {
          failures: [
            ...this.checkDestroySubjectDeclaration(
              sourceFile,
              classDeclaration,
              name
            ),
            ...this.checkDestroySubjectMethodInvocation(
              sourceFile,
              ngOnDestroyMethod,
              name,
              "next"
            ),
            ...this.checkDestroySubjectMethodInvocation(
              sourceFile,
              ngOnDestroyMethod,
              name,
              "complete"
            )
          ],
          report: false
        });
      });

      destroySubjectNamesBySubscribes.forEach(names => {
        const report = [...names].every(
          name => destroySubjectResultsByName.get(name).failures.length > 0
        );
        if (report) {
          names.forEach(
            name => (destroySubjectResultsByName.get(name).report = true)
          );
        }
      });

      destroySubjectResultsByName.forEach(result => {
        if (result.report) {
          failures.push(...result.failures);
        }
      });
    } else {
      failures.push(
        new Lint.RuleFailure(
          sourceFile,
          classDeclaration.name.getStart(),
          classDeclaration.name.getStart() + classDeclaration.name.getWidth(),
          Rule.FAILURE_STRING_NO_DESTROY,
          this.ruleName
        )
      );
    }
    return failures;
  }

  private checkDestroySubjectDeclaration(
    sourceFile: ts.SourceFile,
    classDeclaration: ts.ClassDeclaration,
    destroySubjectName: string
  ) {
    const failures: Lint.RuleFailure[] = [];
    const propertyDeclarations = tsquery(
      classDeclaration,
      `PropertyDeclaration[name.text="${destroySubjectName}"]`
    ) as ts.PropertyDeclaration[];
    if (propertyDeclarations.length === 0) {
      const { name } = classDeclaration;
      failures.push(
        new Lint.RuleFailure(
          sourceFile,
          name.getStart(),
          name.getStart() + name.getWidth(),
          Rule.FAILURE_MESSAGE_NOT_DECLARED(destroySubjectName),
          this.ruleName
        )
      );
    }
    return failures;
  }

  /**
   * Checks whether all <destroySubjectNameUsed>.<methodName>() are invoked in the ngOnDestroyMethod
   */
  private checkDestroySubjectMethodInvocation(
    sourceFile: ts.SourceFile,
    ngOnDestroyMethod: ts.ClassElement,
    destroySubjectName: string,
    methodName: string
  ) {
    const failures: Lint.RuleFailure[] = [];
    const destroySubjectMethodInvocations = tsquery(
      ngOnDestroyMethod,
      `CallExpression > PropertyAccessExpression[name.name="${methodName}"]`
    ) as ts.PropertyAccessExpression[];
    // check whether there is one invocation of <destroySubjectName>.<methodName>()
    if (
      !destroySubjectMethodInvocations.some(
        methodInvocation =>
          (tsutils.isPropertyAccessExpression(methodInvocation.expression) &&
            isThis(methodInvocation.expression.expression) &&
            methodInvocation.expression.name.text === destroySubjectName) ||
          (tsutils.isIdentifier(methodInvocation.expression) &&
            methodInvocation.expression.text === destroySubjectName)
      )
    ) {
      failures.push(
        new Lint.RuleFailure(
          sourceFile,
          ngOnDestroyMethod.name.getStart(),
          ngOnDestroyMethod.name.getStart() + ngOnDestroyMethod.name.getWidth(),
          Rule.FAILURE_MESSAGE_NOT_CALLED(destroySubjectName, methodName),
          this.ruleName
        )
      );
    }
    return failures;
  }
}
