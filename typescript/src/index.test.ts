import { checkFourInARow, slidingWindow, slidingBox } from ".";

type Player = "r" | "y" 
type Place = Player | "." 

describe("slidingWindow", () => {
  it("returns the correct window arrays", () => {
    const inputArray = [1,2,3,4,5,6,7,8]
    const windowSize = 4
    const result = slidingWindow(inputArray, windowSize)
    const expectedResult = [[1,2,3,4], [2,3,4,5], [3,4,5,6], [4,5,6,7], [5,6,7,8]]

    expect(result).toEqual(expectedResult);
  });

  it("handles the input array length being smaller than the window size", () => {
    const inputArray = [1,2,3]
    const windowSize = 4
    expect(() => {
      slidingWindow(inputArray, windowSize);
    }).toThrow("Window size larger than inputted array")
    // cannot use the below - use the above version with the anonymous function -
    //   in order to catch the error, the invoked function needs to be wrapped in another function
    // expect(slidingWindow(inputArray, windowSize)).toThrow("Window size larger than inputted array");
    
  });
});

describe("checkFourInARow", () => {
  it("returns undefined if there are not 4 in a row", () => {
    const inputRange: Place[] = [".","r",".","y","y","r","."]
    const result = checkFourInARow(inputRange)

    expect(result).toBeUndefined();
  });

  it("returns the winning player if there are 4 in a row", () => {
    const inputRange: Place[] = [".","y","y","y","y","r","."]
    const result = checkFourInARow(inputRange)

    expect(result).toEqual("y");
  });
});

describe("slidingBox", () => {
  it("returns all boxes of the specified size", () => {
    let inputBoard = [ 
      [1,2,3,4],
      [5,6,7,8],
      [9,10,11,12],
      [13,14,15,16],
      ]
    
    const result = slidingBox(inputBoard, 3)
    const expectedResult = [
      [ 
        [1,2,3],
        [5,6,7],
        [9,10,11]
      ],
      [ 
        [2,3,4],
        [6,7,8],
        [10,11,12]
      ],
      [ 
        [5,6,7],
        [9,10,11],
        [13,14,15]
      ],
      [ 
        [6,7,8],
        [10,11,12],
        [14,15,16],
      ]
    ]
    expect(result).toEqual(expectedResult);

  });
});
