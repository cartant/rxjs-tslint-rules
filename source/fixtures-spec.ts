/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { expect } from "chai";
import * as fs from "fs";
import { Configuration, Linter, LintResult } from "tslint";
import * as ts from "typescript";

describe("fixtures", function (): void {

    /*tslint:disable-next-line:no-invalid-this*/
    this.timeout(5000);

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

        describe("import-all", () => {

            it("should effect 'rxjs-prefer-add' errors", () => {

                const result = lint("import-all");

                expect(result).to.have.property("errorCount", 2);
                expect(result.failures[0]).to.have.property("ruleName", "rxjs-prefer-add");
                expect(result.failures[1]).to.have.property("ruleName", "rxjs-prefer-add");
            });
        });

        describe("no-add", () => {

            it("should effect 'rxjs-no-add' errors", () => {

                const result = lint("no-add", "tslint.json");

                expect(result).to.have.property("errorCount", 1);
                expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-add");
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

        describe("unused-operator", () => {

            it("should effect 'rxjs-no-unused-add' errors", () => {

                const result = lint("unused-operator");

                expect(result).to.have.property("errorCount", 1);
                expect(result.failures[0]).to.have.property("ruleName", "rxjs-no-unused-add");
            });
        });
    });

    describe("subject-related rules", () => {

        describe("async-subject-with-unsubscribe", () => {

            it("should effect an 'rxjs-no-subject-unsubscribe' error", () => {

                const result = lint("async-subject-with-unsubscribe", "tslint.json");

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

    function lint(dir: string, configFileName?: string): LintResult {

            const fileName = `./fixtures/${dir}/fixture.ts`;
            const content = fs.readFileSync(fileName, "utf8");
            const program = Linter.createProgram(`./fixtures/${dir}/tsconfig.json`);
            const linter = new Linter({ fix: false }, program);

            const configuration = Configuration.findConfiguration(
                configFileName ?
                    `./fixtures/${dir}/${configFileName}` :
                    `./fixtures/tslint.json`,
                fileName
            ).results;
            linter.lint(fileName, content, configuration);
            return linter.getResult();
    }
});
