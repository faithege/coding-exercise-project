import { slidingWindow } from ".";

describe("slidingWindow", () => {
  it("returns the correct window arrays", () => {
    const inputArray = [1,2,3,4,5,6,7,8]
    const windowSize = 4
    const result = slidingWindow(inputArray, windowSize)
    const expectedResult = [[1,2,3,4], [2,3,4,5], [3,4,5,6], [4,5,6,7], [5,6,7,8]]

    expect(result).toEqual(expectedResult);
  });

  // it("handles the input array length being smaller than the window size", () => {
  //   const inputArray = [1,2,3]
  //   const windowSize = 4
  //   expect(() => {
  //     slidingWindow(inputArray, windowSize));
  //   }.toThrow("Window size larger than inputted array")
  //   // expect(slidingWindow(inputArray, windowSize)).toThrow("Window size larger than inputted array");
  // });
});
