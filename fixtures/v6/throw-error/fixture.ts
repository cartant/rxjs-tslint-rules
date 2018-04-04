import { throwError } from "rxjs";

const ob1 = throwError("Boom!");
const ob2 = throwError(new Error("Boom!"));
