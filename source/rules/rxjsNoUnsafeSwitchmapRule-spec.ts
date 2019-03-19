/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { expect } from "chai";
import decamelize from "decamelize";
import { Walker } from "./rxjsNoUnsafeSwitchmapRule";

describe("rxjs-no-unsafe-switchmap", () => {

    describe("createRegExp", () => {

        const regExp = Walker.createRegExp(["add"]);

        it("should match action literals", () => {

            expect(`"ADD"`).to.match(regExp);
            expect(`"ADD_SOMETHING"`).to.match(regExp);
            expect(`"SOMETHING_ADD"`).to.match(regExp);

            expect(`'ADD'`).to.match(regExp);
            expect(`'ADD_SOMETHING'`).to.match(regExp);
            expect(`'SOMETHING_ADD'`).to.match(regExp);

            expect("`ADD`").to.match(regExp);
            expect("`ADD_SOMETHING`").to.match(regExp);
            expect("`SOMETHING_ADD`").to.match(regExp);
        });

        it("should match action symbols", () => {

            expect("ADD").to.match(regExp);
            expect("ADD_SOMETHING").to.match(regExp);
            expect("SOMETHING_ADD").to.match(regExp);

            expect(decamelize("Add")).to.match(regExp);
            expect(decamelize("AddSomething")).to.match(regExp);
            expect(decamelize("SomethingAdd")).to.match(regExp);
        });

        it("should not match words within larger words", () => {

            expect("READD").to.not.match(regExp);
            expect("Readd").to.not.match(regExp);

            expect("ADDER").to.not.match(regExp);
            expect("Adder").to.not.match(regExp);

            expect("LADDER").to.not.match(regExp);
            expect("Ladder").to.not.match(regExp);
        });

        it("should create a RegExp from a string", () => {

            expect(Walker.createRegExp(".").toString()).to.equal("/./i");
        });
    });
});
