import {GameState} from "./gameState"
import {Position} from "./position"

export class Probability{

    // Returns an array of valid positions, with the frequency of each position being proportional to it's "probability" calculuated by getDistribution()
    public static getTargetArray(gamestate:GameState, grid:number, init:boolean):Array<Position>{
        let shift:number = Probability.getOptimalShift(gamestate, grid);
        let distribution:number[][] = Probability.getDistribution(gamestate);
        let validTargets:Array<Position> = [];
        for (let row:number = 0; row<10; row++){
            for (let column:number = 0; column<10; column++){
                let pos:Position = new Position({"Row": GameState.numberToLetter[row],"Column":column+1});
                if (init){
                    if (((row>7)||(row<2) && ((column>7)||(column<2)))&&(gamestate.isValidTarget(pos))){
                        for (let frequency:number = 0; frequency < Math.floor(34/Math.sqrt(distribution[pos.row][pos.column])); frequency++){
                            validTargets.push(pos) ;
                        }
                    }
                }
                else {
                    if ((gamestate.isValidTarget(pos)) && (((pos.row-pos.column )%grid+grid)%grid == shift)) {
                        for (let frequency:number = 0; frequency < Math.floor(Math.pow(1.1,distribution[pos.row][pos.column])*distribution[pos.row][pos.column]); frequency++){
                            validTargets.push(pos) ;
                        }
                    }
                }
            }
        }
        return validTargets;
    }

    // given a gamestate and a grid size, it returns the shift s.t. the shifted grid has minimal unchecked cells
    // Note that we have limited grid to be either 2 or 4 and shift is either 0 or 2 so that we stay on the "black cells" 
    public static getOptimalShift(gamestate:GameState, grid:number):number{
        if (grid==2) {
            return 0;
        }
        let counts:number[] = [0,0];
        for (let shift of [0,2]){
            let counter:number = 0;
            for (let row:number = 0; row <10; row++){
                for (let column:number = 0; column < 10; column++){
                    if ((column-row)%grid == shift){
                        if (gamestate.isValidTarget(new Position({"Row":GameState.numberToLetter[row], "Column":column+1}))){
                            counter++;
                        }
                    }
                }
            }
            counts[Math.floor(shift/2)] = counter;
        }
        if (counts[0] > counts[1]){
            return 2
        }
        return 0;
    }

    // returns a (not normalised) distribution on the board where each cell!s "probability" is proportional to the number of 
    // ways a ship can be legally placed on the board s.t. it covers the given cell
    public static getDistribution(gamestate:GameState):number[][]{
        let ans:number[][] = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ]
        let board:number[][] = gamestate.getBoard();
        for (let row:number = 0; row<10; row++){
            for (let column:number = 0; column< 10; column++){
                if (board[row][column] == 0){
                    ans[row][column] = Probability.countWays(row, column, gamestate);
                }
            }   
        }
        return ans;
    }

    public static countWays(row:number, column:number, gamestate:GameState):number{
        let count:number = 0;     
        for (let shipLength of gamestate.remainingShips){
            let rowDirections:number[] = [1,0];
            let columnDirections:number[] = [0,1];
            for (let dir:number = 0; dir<2; dir++){
                let dr:number = rowDirections[dir];
                let dc:number = columnDirections[dir];
                for (let shift:number = 0; shift<shipLength; shift++){
                    let valid:boolean = true;
                    for (let j:number = -shift; j<shipLength-shift; j++){
                        if (!gamestate.isValidTarget(new Position({"Row":GameState.numberToLetter[row+dr*j], "Column":column+dc*j+1}))){
                            valid = false;
                        }
                    }   
                    if (valid){
                        count++;
                    }
                }
            } 
        }
        return count;
    }

    public static getRandomShipPositions():Array<{ StartingSquare: { Row:string, Column:number }, EndingSquare : { Row:string , Column:number } }>{
        let answer:Array<{ StartingSquare: { Row:string, Column:number }, EndingSquare : { Row:string , Column:number } }> = [];
        let ships:number[] = [2,3,3,4,5];
        let board:number[][] = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ]
        for (let len of ships){
            let gamestate:GameState = new GameState({});
            gamestate.board = board;
            gamestate.eliminateSunkenShips();
            gamestate.eliminateNeighboursOfSunken();
            gamestate.eliminateSunkenShips();
            gamestate.eliminateNeighboursOfSunken();
            // We have to do the above twice because we might be able to sink additional ships 
            // after eliminating neighbours of already sunken ships

            let found:boolean = false
            let count:number = 0;
            while (!found){
                if (count>1000) {
                    console.log("while loop exceeded 1000 iterations, so default shipplacement was returned");
                    return [
                        { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
                        { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
                        { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
                        { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
                        { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
                    ];
                }
                count++;
                let pos:Position = gamestate.randomDraw(true);
                let rowDirections:number[] = [0,0,1,-1];
                let columnDirections:number[] = [1,-1,0,0];
                let directions:number[] = Probability.shuffleArray([0,1,2,3]);
                for (let i:number = 0; i<4; i++){
                    let dr:number = rowDirections[directions[i]];
                    let dc:number = columnDirections[directions[i]];

                    let valid:boolean = true;
                    for (let i:number = 0; i<len; i++){
                        if (!gamestate.isValidTarget(new Position({"Row":GameState.numberToLetter[pos.row+i*dr], "Column":pos.column+1+i*dc}))){
                            valid = false;
                        }
                    }
                    if (valid) {
                        found = true;
                        answer.push({StartingSquare:{Row:GameState.numberToLetter[pos.row], Column:pos.column+1},
                                    EndingSquare:{Row:GameState.numberToLetter[pos.row+(len-1)*dr], Column:pos.column+1+(len-1)*dc}
                                });
                        for (let j:number = 0; j<len; j++){
                            board[pos.row+j*dr][pos.column+j*dc] = 2;
                        }
                    }
                }
            }
        }
        return answer;
    }

    public static shuffleArray(array:number[]):number[] {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}