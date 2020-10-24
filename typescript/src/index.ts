
import * as readline from 'readline'; 

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
})

type Player = "r" | "y" 
type Place = Player | "." //either a player or an empty space
type Row = Place[] //array of 7 places, no longer a tuple
type Column = Place[] //array of 6 places, no longer a tuple
type Board = Row[] //now an array rather than a tuple (mapping a tuple, turns into an array and returns an array of noon fixed length)


let gameBoard: Board = 
        [ //tuple of 6 rows which ae a tuple of 7 places
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."],
        [".",".",".",".",".",".","."]
        ]


let currentPlayer: Player = "r"

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

function findEmptyRow(column:Column): number | undefined{
    // may not return a number if column full
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
export function slidingWindow<T>(array: T[], windowSize: number): T[][]{
    //number of windows = inputarray.length - window + 1

    //edge cases - if array.length<window size
    if (array.length < windowSize){
        throw "Window size larger than inputted array";
    }

    // not the most efficient but simply written
    return array.map((_, index) => array.slice(index, index + windowSize))
            .filter( slice => slice.length === windowSize)
}

function checkFourInARow(range: Place[]): Player | undefined {

    const windows = slidingWindow(range, 4); //don't need to declare type, inferred

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

function checkForWinner(board:Board): Player | undefined {
    // We didn't need to define a type here but it makes it helpful in understanding the flow of the code
    // checkFourInARow retuns us either r/y/undefined for each row in a board so we'll get an array of Players
    const rowWinner: Player[] = board.map(row => checkFourInARow(row))

    //we have to create our columns as an array of arrays (essentially rotating the board around)
    const columns = getColumns(board)
    // and then do the same check for any winners across each column
    const columnWinner: Player[] = columns.map(column => checkFourInARow(column))

    //combine them together - if there are no winners, it will be an array of undefineds otherwise it will return either r or y
    const boardWinner = [...rowWinner, ...columnWinner].find(result => result !== undefined) 
    
    return boardWinner
}

function repl(){

    displayBoard(gameBoard);
    console.log(`Your turn ${currentPlayer}`)

    rl.question("Please select a column from 1-7", function(column) {
        console.log(`You have selected ${column}`);
        try {
            gameBoard = placeCounter(gameBoard, parseInt(column)-1, currentPlayer) //we need the column to be 0-based so minus 1
            displayBoard(gameBoard);

            // check if winner vertical or horizontal
            const winner = checkForWinner(gameBoard);

            if (winner){
                //return potential winner
                console.log(`Congratulations, you have won ${winner}`)
            }

            //check for diagonal
            //

            //if so celebratory message plus display winning board
            //if not switch current player - create basic function that inverts player!! then loop
        }
        catch(error) {
            console.log(error) // need to loop if row full, but don't change player
        }
        //return undefined
        rl.close();
        
    });

    //todo
    //test edge case of sliding window
    //test check winner
    // create switchPlayer function mt %2 idea probs not that fiendly to another developer
    // add loop - while loop
    //for winner display board and break
    //write function that gives possible diagonals of length 4
        //leave first row untouched then chop 1 off then 2 off etc then pass into my checkFor4

}

repl()

//want a number from the user (we determine row based on state of board)

//nice to have
// user input validation

