
import readline from 'readline-promise'; 

type Player = "r" | "y" 
type Place = Player | "." //either a player or an empty space
type Row = Place[] //array of 7 places, no longer a tuple
type Column = Place[] //array of 6 places, no longer a tuple
type Board = Row[] //now an array rather than a tuple (mapping a tuple, turns into an array and returns an array of noon fixed length)

const winningLength = 4
let gameBoard: Board = 
        [ //tuple of 6 rows which ae a tuple of 7 places
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."]
        ]


function displayBoard(board: Board){
    const rowStrings = board.map(row => row.join(' ')) //specify separator
    console.log(rowStrings.join('\n'));
}

function selectColumn(board:Board, columnIndex: number): Column{
    return board.map(row => row[columnIndex]).reverse() //returns an array - of type Column
}

function getColumns(board:Board): Column[]{ //returns an array of columns as opposed to an array of rows(which is what the board is)
    //board.map(row => selectColumn(board, row))
			// what I started doing, I guess ultimately I would then fill an array with the xth value for each row

		//here we start by defining an empty array of 7 places - then convert each place into an array of the xth elements
    const numberOfColumns = board[0].length
		// alone Array(x) is an abstract construct, we need to fill it for the array to be properly defined and iterable. we can fill with any dummy value (as it's being replaced), we chose undefined.
		// For each index we make use of the selectColumn function and return all the 0s, all the 1s etc
    return Array(numberOfColumns).fill(undefined).map((_, index) => selectColumn(board, index))
}

//Did this all by myself!
export function getBoxDiagonals<T>(box:T[][], boxSize: number): T[][] {
    if (box.length < boxSize || box[0].length < boxSize){
        return []
    }

    const forwardDiagonal = box.map((row, rowIndex) => { return row[rowIndex] })
    const backwardDiagonal = box.map((row, rowIndex) => { return row[boxSize - rowIndex - 1] })

    return [forwardDiagonal,backwardDiagonal]
}

function getDiagonalWindows(board:Board, windowSize: number): Place[][]{
    const boxWindows = slidingBox(board, windowSize)

    // by using flatmap we will return an array of all the possible diagonals of the correct size
    return boxWindows.flatMap(box => getBoxDiagonals(box, windowSize))
}

function getRowWindows(board:Board, windowSize: number): Place[][]{
    return board.flatMap(row => slidingWindow(row, windowSize))
}

function getColumnWindows(board:Board, windowSize: number): Place[][]{
    //we have to create our columns as an array of arrays (essentially rotating the board around)
    const columns = getColumns(board)
    // and then do the same check for any winners across each column
    return columns.flatMap(column => slidingWindow(column, windowSize))
}

function findEmptyRow(column:Column): number | undefined{
    // will not return a number if column full or column does not exist
    const row = column.findIndex(row => row === '.')
    return row === -1 ? undefined : 5 - row // need to re-reverse the order
}

function placeCounter(board:Board, columnIndex: number, player: Player): Board{
    const column = selectColumn(board, columnIndex)
    const rowIndex = findEmptyRow(column)

    if (rowIndex === undefined) {  //can't check for falsie as 0 is valid answer
        throw "This column is full, please choose another";
    }
    else {
        board[rowIndex][columnIndex] = player
    }
    return board

}

// make type agnostic (can test with numbers as generic)
export function slidingWindow<T>(array: T[], arrayWindowSize: number): T[][]{
    //number of windows = inputarray.length - window + 1

    //edge cases - if array.length<window size
    if (array.length < arrayWindowSize){
        throw "Window size larger than inputted array";
    }

    // not the most efficient but simply written - create slices then throw some away
    return array.map((_, index) => array.slice(index, index + arrayWindowSize))
            .filter( slice => slice.length === arrayWindowSize)
}

export function slidingWindowMutation<T>(array: T[], arrayWindowSize: number): T[][]{

    if (array.length < arrayWindowSize){
        return []
    }

    let accumulator: T[][] = []

    for(let i=0; i < array.length - arrayWindowSize; i++){
        accumulator.push(array.slice(i,i+arrayWindowSize))
    }

    return accumulator
}

export function slidingWindowRec<T>(array: T[], arrayWindowSize: number): T[][]{

    //base case
    if (array.length < arrayWindowSize){
        return [];
    }

    const initialWindow = array.slice(0,arrayWindowSize)
    const otherWindows = slidingWindowRec(array.slice(1),arrayWindowSize)
    return [initialWindow, ...otherWindows] //does final return once base case reached and stack unwinds
}

export function slidingWindowTailRec<T>(array: T[], arrayWindowSize: number, accumulator: T[][] = []): T[][]{

    //base case
    if (array.length < arrayWindowSize){
        return accumulator; //base case does final return
    }

    const window = array.slice(0,arrayWindowSize)
    //const newAccumulator = [...accumulator, window]
    accumulator.push(window)
    return slidingWindowTailRec(array.slice(1),arrayWindowSize, accumulator) //squashed as go along
}

//2D version of .slice
export function slice2D<T>(inputBox: T[][], xIndex: number, yIndex: number, boxSize: number): (T[][] | undefined) {
    
    // chop off top and bottom rows
    const xSlicedResult = inputBox.slice(xIndex, xIndex + boxSize)

    // handle cases where we can't fit in the size of a box eg if slice from xIndex 5 for a box size 4 on an input box of 6 - not enough space
    if (xSlicedResult.length !== boxSize){
        return undefined
    }

    // chop off left and right cols
    const ySlicedResult = xSlicedResult.map(row => row.slice(yIndex, yIndex + boxSize))

    if (ySlicedResult[0].length !== boxSize){
        return undefined
    }
    else {
        return ySlicedResult
    }
}

export function slidingBox<T>(inputBox: T[][], boxWindowSize: number): T[][][]{
    // create all boxes then filter for correct sizes

    //edge case handling
    if (inputBox.length < boxWindowSize){
        // or could throw an error
        return []
    }
    

    // using flatmap flattens the first array so we get an array of Boxes by mapping across each place in the box to take it from 4D to 3D
    const boxes: (T[][] | undefined)[] = inputBox.flatMap((row,xIndex) => { return row.map((_, yIndex) => slice2D(inputBox, xIndex, yIndex, boxWindowSize)) })
    
    // Filter for the ones of the correct size
    // WHY DOES BOXES DROP UNDEFINED UNION TYPE
    return boxes.filter(box => box !== undefined)

   
}

export function checkWindowsForWinner(windows: Place[][]): Player | undefined {

    const results = windows.map(window => {
        // look at each window in turn and assess whether either all rs or all ys
        if(window.every(place => (place === 'r'))){
            return "r"
        }
        else if (window.every(place => (place === 'y'))){
            return "y"
        } else {
            return undefined
        }
    } )
    // end up with an array of elements r/y/undefined (mostly undefined) [undefined, undefined, "r", undefined] for an r winner

    //if there is a winner(either r or y, not undefined, return the winner -> otherwise undefined witll be returned)
    return results.find(result => result !== undefined) 
}


function checkBoardForWinner(board:Board): Player | undefined {
    // We didn't need to define a type here but it makes it helpful in understanding the flow of the code
    const winningLength = 4
    
     //don't need to declare type, inferred
    const rowWindows = getRowWindows(board, winningLength)
    const rowWinner: Player | undefined = checkWindowsForWinner(rowWindows)

    const columnWindows = getColumnWindows(board, winningLength)
    const columnWinner: Player | undefined = checkWindowsForWinner(columnWindows)

    const diagonalWindows = getDiagonalWindows(board, winningLength)
    const diagonalWinner: Player | undefined = checkWindowsForWinner(diagonalWindows)

    //combine them together - if there are no winners, it will be an array of undefineds otherwise it will return either r or y
    const boardWinner = [rowWinner, columnWinner, diagonalWinner].find(result => result !== undefined) 
    
    return boardWinner
}

// take in a currentPlayer argument to avoid modifying the original?
function switchCurrentPlayer(currentPlayer: Player): Player {
    if(currentPlayer === "r") {
        return "y"
    }
    else if (currentPlayer === "y") {
        return "r"
    }

}

async function processPlayerMove(readline:any, currentPlayer: Player): Promise<Player | undefined>{
    const column = await readline.questionAsync("Please select a column from 1-7: ")

    // Added so that terminal looks nice, less bunched up
    console.log(` `);

    gameBoard = placeCounter(gameBoard, parseInt(column)-1, currentPlayer) //we need the column to be 0-based so minus 1
    displayBoard(gameBoard);

    // check if winner vertical or horizontal
    const winner = checkBoardForWinner(gameBoard);
    

    if (winner){
        //return potential winner
        console.log(`Congratulations, you have won ${winner}`)
    }

    return winner
}

async function repl(readline:any, currentPlayer:Player){

    console.log(`Your turn ${currentPlayer}`)
    let winner = await processPlayerMove(readline, currentPlayer)

    if (winner) {
        return 
    }

    currentPlayer = switchCurrentPlayer(currentPlayer);
    await repl(readline, currentPlayer) //THIS NEEDS AN AWAIT OTHERWISE THE PROGRAMME EXITS
    
}

// Start Game - top level async function then immediately called using ()
// (async () => {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//         terminal: true
//         })

//     try {
//         displayBoard(gameBoard);
//         const currentPlayer: Player = "r"
//         await repl(rl, currentPlayer)
//     } catch (error) {
//         console.log(error)
//     }
//     finally {
//         rl.close()
//     }
// })(); // IIFE - calls the function immediately

function test(numberOfIterations: number, functionUnderTest: ()=>void){
    const time_start = new Date()

    for (let i=0; i<numberOfIterations; i++){
    functionUnderTest();
    }

    const time_end = new Date()
    console.log(time_end.getTime() - time_start.getTime())
}


const hugeArray = Array(1000).fill(undefined).map((_, index) => index)

test(10000, () => slidingWindow(hugeArray, 4)) // 852
test(10000, () => slidingWindowMutation(hugeArray, 4)) //544
test(10000, () => slidingWindowRec(hugeArray, 4)) //54281
test(10000, () => slidingWindowTailRec(hugeArray, 4)) //11063
