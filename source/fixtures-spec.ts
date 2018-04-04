/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { expect } from "chai";
import * as fs from "fs";
import { Configuration, Linter, LintResult } from "tslint";
import * as ts from "typescript";

if (process.env["FIXTURES_DIR"]) {

    describe("fixtures", function (): void {

        /*tslint:disable-next-line:no-invalid-this*/
        this.timeout(5000);

        function effectTests(): void {

            describe("effect/epic-related rules", () => {

                describe("no-unsafe-switchmap", () => {

                    it("should effect 'no-unsafe-switchmap' errors", () => {
                        const result = lint("no-unsafe-switchmap", "tslint.json");
                        expect(result).to.have.property("errorCount", 12);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-unsafe-switchmap"));
                    });
                });

                describe("no-unsafe-switchmap-foo", () => {

                    it("should effect 'no-unsafe-switchmap' errors for non-allowed actions", () => {
                        const result = lint("no-unsafe-switchmap-foo", "tslint-allow-foo.json");
                        expect(result).to.have.property("errorCount", 2);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-unsafe-switchmap"));
                    });

                    it("should effect 'no-unsafe-switchmap' errors for disallowed actions", () => {
                        const result = lint("no-unsafe-switchmap-foo", "tslint-disallow-foo.json");
                        expect(result).to.have.property("errorCount", 1);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-unsafe-switchmap"));
                    });
                });
            });
        }

        function finnishTests(): void {

            describe("finnish-related rules", () => {

                describe("finnish-with-$", () => {

                    it("should effect no errors", () => {

                        const result = lint("finnish-with-$", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("finnish-without-$", () => {

                    it("should effect 'rxjs-finnish' errors", () => {

                        const result = lint("finnish-without-$", "tslint.json");

                        expect(result).to.have.property("errorCount", 19);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-finnish"));
                    });

                    it("should support supressing errors with rule flags", () => {

                        const result = lint("finnish-without-$", "tslint.json", "fixture-with-flags.ts");

                        expect(result).to.have.property("errorCount", 1);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-finnish"));
                    });

                    it("should support not enforcing functions", () => {

                        const result = lint("finnish-without-$", "tslint-no-functions.json");

                        expect(result).to.have.property("errorCount", 18);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-finnish"));
                    });

                    it("should support not enforcing methods", () => {

                        const result = lint("finnish-without-$", "tslint-no-methods.json");

                        expect(result).to.have.property("errorCount", 17);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-finnish"));
                    });

                    it("should support not enforcing parameters", () => {

                        const result = lint("finnish-without-$", "tslint-no-parameters.json");

                        expect(result).to.have.property("errorCount", 12);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-finnish"));
                    });

                    it("should support not enforcing properties", () => {

                        const result = lint("finnish-without-$", "tslint-no-properties.json");

                        expect(result).to.have.property("errorCount", 12);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-finnish"));
                    });

                    it("should support not enforcing variables", () => {

                        const result = lint("finnish-without-$", "tslint-no-variables.json");

                        expect(result).to.have.property("errorCount", 15);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-finnish"));
                    });
                });

                describe("no-finnish-with-$", () => {

                    it("should effect 'rxjs-no-finnish' errors", () => {

                        const result = lint("no-finnish-with-$", "tslint.json");

                        expect(result).to.have.property("errorCount", 19);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-finnish"));
                    });
                });

                describe("no-finnish-without-$", () => {

                    it("should effect no errors", () => {

                        const result = lint("no-finnish-without-$", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });
            });
        }

        function generalTests(): void {

            describe("general rules", () => {

                describe("no-create", () => {

                    it("should effect 'rxjs-no-create' errors", () => {

                        const result = lint("no-create", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-create");
                    });
                });

                describe("no-do", () => {

                    it("should effect 'rxjs-no-do' errors", () => {

                        const result = lint("no-do", "tslint.json");

                        expect(result).to.have.property("errorCount", 4);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-do"));
                    });
                });

                describe("no-tap", () => {

                    it("should effect 'rxjs-no-tap' errors", () => {

                        const result = lint("no-tap", "tslint.json");

                        expect(result).to.have.property("errorCount", 2);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-tap"));
                    });
                });

                describe("no-unsafe-scope", () => {

                    it("should effect 'rxjs-no-unsafe-scope' errors", () => {

                        const result = lint("no-unsafe-scope", "tslint.json");

                        expect(result).to.have.property("errorCount", 2);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-unsafe-scope"));
                    });

                    it("should effect 'rxjs-no-unsafe-scope' errors for non-arrow functions", () => {

                        const result = lint("no-unsafe-scope", "tslint.json", "fixture-functions.ts");

                        expect(result).to.have.property("errorCount", 2);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-unsafe-scope"));
                    });

                    it("should not effect 'rxjs-no-unsafe-scope' errors for safe usage", () => {

                        const result = lint("no-unsafe-scope", "tslint.json", "fixture-safe.ts");

                        expect(result).to.have.property("errorCount", 0);
                    });

                    it("should not effect 'rxjs-no-unsafe-scope' errors for do/tap", () => {

                        const result = lint("no-unsafe-scope", "tslint.json", "fixture-do.ts");

                        expect(result).to.have.property("errorCount", 0);
                    });

                    it("should not effect 'rxjs-no-unsafe-scope' errors for globals", () => {

                        const result = lint("no-unsafe-scope", "tslint.json", "fixture-globals.ts");

                        expect(result).to.have.property("errorCount", 0);
                    });

                    it("should not effect 'rxjs-no-unsafe-scope' errors for Math", () => {

                        const result = lint("no-unsafe-scope", "tslint.json", "fixture-math.ts");

                        expect(result).to.have.property("errorCount", 0);
                    });

                    it("should not effect 'rxjs-no-unsafe-scope' errors for constants", () => {

                        const result = lint("no-unsafe-scope", "tslint.json", "fixture-constants.ts");

                        expect(result).to.have.property("errorCount", 0);
                    });

                    it("should not effect 'rxjs-no-unsafe-scope' errors for enums", () => {

                        const result = lint("no-unsafe-scope", "tslint.json", "fixture-enums.ts");

                        expect(result).to.have.property("errorCount", 0);
                    });

                    it("should effect 'rxjs-no-unsafe-scope' errors for this", () => {

                        const result = lint("no-unsafe-scope", "tslint.json", "fixture-this.ts");

                        expect(result).to.have.property("errorCount", 2);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-unsafe-scope"));
                    });
                });

                describe("throw-error", () => {

                    it("should effect 'rxjs-throw-error' errors", () => {

                        const result = lint("throw-error", "tslint.json");

                        expect(result).to.have.property("errorCount", 2);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-throw-error"));
                    });
                });
            });
        }

        function importTests(): void {

            describe("import-related rules", () => {

                describe("custom-observable", () => {

                    it("should effect no errors", () => {

                        const result = lint("custom-observable");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("custom-operator", () => {

                    it("should effect no errors", () => {

                        const result = lint("custom-operator");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("custom-source", () => {

                    it("should effect no errors", () => {

                        const result = lint("custom-source");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("deep-operators", () => {

                    it("should effect 'rxjs-deep-operators' errors", () => {

                        const result = lint("deep-operators", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-deep-operators"));
                    });
                });

                describe("elsewhere-with-file", () => {

                    it("should effect an 'rxjs-add' error", () => {

                        const result = lint("elsewhere-with-file", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-add");
                    });
                });

                describe("elsewhere-with-file-allowed", () => {

                    it("should not effect an 'rxjs-add' error", () => {

                        const result = lint("elsewhere-with-file-allowed", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("flat-map", () => {

                    it("should effect no errors", () => {

                        const result = lint("flat-map");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("import-wholesale", () => {

                    it("should effect 'rxjs-no-wholesale' errors", () => {

                        const result = lint("import-wholesale");

                        expect(result).to.have.property("errorCount", 2);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-wholesale");
                        expect(result.failures[1]).to.have.property("ruleName", "rxjs-no-wholesale");
                    });
                });

                describe("no-add", () => {

                    it("should effect 'rxjs-no-add' errors", () => {

                        const result = lint("no-add", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-add");
                    });
                });

                describe("no-add-allow-all-observables", () => {

                    it("should not effect an 'rxjs-no-add' error", () => {

                        const result = lint("no-add-allow-all-observables", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("no-add-allow-all-operators", () => {

                    it("should not effect an 'rxjs-no-add' error", () => {

                        const result = lint("no-add-allow-all-observables", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("no-add-allow-some-observables", () => {

                    it("should not effect an 'rxjs-no-add' error for allowed observable", () => {

                        const result = lint("no-add-allow-some-observables", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-add");
                    });
                });

                describe("no-add-allow-some-operators", () => {

                    it("should not effect an 'rxjs-no-add' error for allowed operator", () => {

                        const result = lint("no-add-allow-some-operators", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-add");
                    });
                });

                describe("no-deep-operators", () => {

                    it("should effect 'rxjs-no-deep-operators' errors", () => {

                        const result = lint("no-deep-operators", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-deep-operators"));
                    });
                });

                describe("no-errors", () => {

                    it("should effect no errors", () => {

                        const result = lint("no-errors");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("no-errors-with-file", () => {

                    it("should effect no errors", () => {

                        const result = lint("no-errors-with-file", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("no-observable", () => {

                    it("should effect 'rxjs-add' errors", () => {

                        const result = lint("no-observable");

                        expect(result).to.have.property("errorCount", 9);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[1]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[2]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[3]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[4]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[5]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[6]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[7]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[8]).to.have.property("ruleName", "rxjs-add");
                    });
                });

                describe("no-observable-with-file", () => {

                    it("should effect 'rxjs-add' errors", () => {

                        const result = lint("no-observable-with-file", "tslint.json");

                        expect(result).to.have.property("errorCount", 9);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[1]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[2]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[3]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[4]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[5]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[6]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[7]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[8]).to.have.property("ruleName", "rxjs-add");
                    });
                });

                describe("no-operator", () => {

                    it("should effect 'rxjs-add' errors", () => {

                        const result = lint("no-operator");

                        expect(result).to.have.property("errorCount", 6);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[1]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[2]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[3]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[4]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[5]).to.have.property("ruleName", "rxjs-add");
                    });
                });

                describe("no-operator-import", () => {

                    it("should effect 'rxjs-no-operator' errors", () => {

                        const result = lint("no-operator-import", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-operator");
                    });
                });

                describe("no-operator-with-file", () => {

                    it("should effect 'rxjs-add' errors", () => {

                        const result = lint("no-operator-with-file", "tslint.json");

                        expect(result).to.have.property("errorCount", 6);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[1]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[2]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[3]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[4]).to.have.property("ruleName", "rxjs-add");
                        expect(result.failures[5]).to.have.property("ruleName", "rxjs-add");
                    });
                });

                describe("no-patched", () => {

                    it("should effect an 'rxjs-no-patched' error", () => {

                        const result = lint("no-patched", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-patched");
                    });
                });

                describe("no-patched-allow-all-observables", () => {

                    it("should not effect an 'rxjs-no-patched' error", () => {

                        const result = lint("no-patched-allow-all-observables", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("no-patched-allow-all-operators", () => {

                    it("should not effect an 'rxjs-no-patched' error", () => {

                        const result = lint("no-patched-allow-all-operators", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("no-patched-allow-some-observables", () => {

                    it("should not effect an 'rxjs-no-patched' error for allowed observable", () => {

                        const result = lint("no-patched-allow-some-observables", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-patched");
                    });
                });

                describe("no-patched-allow-some-operators", () => {

                    it("should not effect an 'rxjs-no-patched' error for allowed operator", () => {

                        const result = lint("no-patched-allow-some-operators", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-patched");
                    });
                });

                describe("observable-create", () => {

                    it("should effect an error unless explicit typing is used", () => {

                        const result = lint("observable-create");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-unused-add");
                    });
                });

                describe("unused-observable", () => {

                    it("should effect 'rxjs-no-unused-add' errors", () => {

                        const result = lint("unused-observable");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-unused-add");
                    });
                });

                describe("unused-observable-with-file", () => {

                    it("should effect an 'rxjs-add' error", () => {

                        const result = lint("unused-observable-with-file", "tslint.json", "adds.ts");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-add");
                    });
                });

                describe("unused-observable-with-file-allowed", () => {

                    it("should not effect an 'rxjs-add' error", () => {

                        const result = lint("unused-observable-with-file-allowed", "tslint.json", "adds.ts");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("unused-operator", () => {

                    it("should effect 'rxjs-no-unused-add' errors", () => {

                        const result = lint("unused-operator");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-unused-add");
                    });
                });

                describe("unused-operator-with-file", () => {

                    it("should effect an 'rxjs-add' error", () => {

                        const result = lint("unused-operator-with-file", "tslint.json", "adds.ts");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-add");
                    });
                });

                describe("unused-operator-with-file-allowed", () => {

                    it("should not effect an 'rxjs-add' error", () => {

                        const result = lint("unused-operator-with-file-allowed", "tslint.json", "adds.ts");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });
            });
        }

        function issueTests(): void {

            describe("issue-related rules", () => {

                describe("issue-33", () => {

                    it("should not effect errors", () => {
                        const result = lint("issue-33", "tslint.json", "adds.ts");
                        expect(result).to.have.property("errorCount", 0);
                    });
                });
            });
        }

        function subjectTests(): void {

            describe("subject-related rules", () => {

                describe("async-subject-add-subscription", () => {

                    it("should effect an 'rxjs-no-subject-unsubscribe' error", () => {

                        const result = lint("async-subject-add-subscription", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-subject-unsubscribe");
                    });
                });

                describe("async-subject-with-unsubscribe", () => {

                    it("should effect an 'rxjs-no-subject-unsubscribe' error", () => {

                        const result = lint("async-subject-with-unsubscribe", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-subject-unsubscribe");
                    });
                });

                describe("behavior-subject-value", () => {

                    it("should effect an 'rxjs-no-subject-value' error", () => {

                        const result = lint("behavior-subject-value", "tslint.json");

                        expect(result).to.have.property("errorCount", 2);
                        result.failures.forEach(failure => expect(failure).to.have.property("ruleName", "rxjs-no-subject-value"));
                    });
                });

                describe("subject-add-subscription", () => {

                    it("should effect an 'rxjs-no-subject-unsubscribe' error", () => {

                        const result = lint("subject-add-subscription", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-subject-unsubscribe");
                    });
                });

                describe("subject-with-unsubscribe", () => {

                    it("should effect an 'rxjs-no-subject-unsubscribe' error", () => {

                        const result = lint("subject-with-unsubscribe", "tslint.json");

                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-subject-unsubscribe");
                    });
                });

                describe("subject-without-unsubscribe", () => {

                    it("should not effect an 'rxjs-no-subject-unsubscribe' error", () => {

                        const result = lint("subject-without-unsubscribe", "tslint.json");

                        expect(result).to.have.property("errorCount", 0);
                    });
                });
            });
        }

        function subscriptionTests(): void {

            describe("subscription-related rules", () => {

                describe("subscription-without-error-handler", () => {

                    it("should effect an 'rxjs-no-ignored-error' error on Observable", () => {
                        const result = lint("subscription-without-error-handler", "tslint.json", "fixture-observable.ts");
                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-ignored-error");
                    });
                });

                describe("subscription-without-error-handler", () => {

                    it("should effect an 'rxjs-no-ignored-error' error on Observable's ancestors", () => {
                        const result = lint("subscription-without-error-handler", "tslint.json", "fixture-subject.ts");
                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-ignored-error");
                    });
                });

                describe("subscription-without-error-handler", () => {

                    it("should effect an 'rxjs-no-ignored-error' error even if first parameter is a funciton variable", () => {
                        const result = lint("subscription-without-error-handler", "tslint.json", "fixture-with-parameter.ts");
                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-ignored-error");
                    });
                });

                describe("subscription-with-error-handler", () => {

                    it("should not produce errors", () => {
                        const result = lint("subscription-with-error-handler", "tslint.json");
                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("subscription-with-arguments", () => {

                    it("should not effect an error", () => {
                        const result = lint("subscription-with-arguments", "tslint.json");
                        expect(result).to.have.property("errorCount", 0);
                    });
                });

                describe("subscription-without-arguments", () => {

                    it("should effect an 'rxjs-no-ignored-subscribe' error", () => {
                        const result = lint("subscription-without-arguments", "tslint.json");
                        expect(result).to.have.property("errorCount", 1);
                        expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-ignored-subscribe");
                    });
                });
            });
        }

        if (/v5$/.test(process.env["FIXTURES_DIR"])) {

            effectTests();
            finnishTests();
            generalTests();
            importTests();
            issueTests();
            subjectTests();
            subscriptionTests();
        }

        if (/v6$/.test(process.env["FIXTURES_DIR"])) {

            finnishTests();
        }

        function lint(dir: string, configFileName?: string, fixtureFileName?: string): LintResult {

            const rootDir = process.env["FIXTURES_DIR"];
            const fixtureDir = `${rootDir}/${dir}`;
            const fileName = `${fixtureDir}/${fixtureFileName || "fixture.ts"}`;
            const content = fs.readFileSync(fileName, "utf8");
            const program = Linter.createProgram(`${fixtureDir}/tsconfig.json`);
            const linter = new Linter({ fix: false }, program);

            const configuration = Configuration.findConfiguration(
                configFileName ?
                    `${fixtureDir}/${configFileName}` :
                    `${rootDir}/tslint.json`,
                fileName
            ).results;
            linter.lint(fileName, content, configuration);
            return linter.getResult();
        }
    });
}
