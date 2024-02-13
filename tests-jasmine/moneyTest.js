import { formatCurrency } from "../scripts/utils/money.js";

describe("test suite: formatCurrency", () => {
  // to create a test
  it("converts cents into dollars", () => {
    expect(formatCurrency(2049)).toEqual("20.49"); // compare a value to another value
  });
  it("works with 0", () => {
    expect(formatCurrency(0)).toEqual("0.00");
  });
  it("rounds up to the nearest cents", () => {
    expect(formatCurrency(2000.5)).toEqual("20.01");
  });
}); // it creates a test suite
