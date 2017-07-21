import {GameState} from "./gameState"
import {Position} from "./position"
import {BoardToJSON} from "./boardToJSON"

export class Probability{
    public static grid(gamestate:GameState, init:boolean):Array<Position>{
        let validTargets:Array<Position> = [];
        for (let row:number = 0; row<10; row++){
            for (let column:number = 0; column<10; column++){
                let pos:Position = new Position({"Row": GameState.numberToLetter[row],"Column":column+1});
                if (init){
                    if (gamestate.isValidTarget(pos)){
                        validTargets.push(pos);
                    }
                }
                else if ((gamestate.isValidTarget(pos)) && ((pos.row+pos.column )%2 == 0)) {
                    validTargets.push(pos) ;
                }
            }
        }
        return validTargets;
    }
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
        return null;
    }
    public static countWays(row:number, column:number, gamestate:GameState):number{
        
        return 0;
    }
    public static randomShipPositions():Array<{ StartingSquare: { Row:string, Column:number }, EndingSquare : { Row:string , Column:number } }>{
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
        // console.log("Im here 1");
        for (let len of ships){
            let gamestate:GameState = new GameState({});
            gamestate.board = board;
            gamestate.eliminateSunkenShips();
            gamestate.eliminateNeighboursOfSunken();
            gamestate.eliminateSunkenShips();
            gamestate.eliminateNeighboursOfSunken();
            let found:boolean = false
            while (!found) {
                let pos:Position = gamestate.randomDraw(true);
                let direction:number = Math.floor(Math.random()*4);
                let rowDirections:number[] = [0,0,1,-1];
                let columnDirections:number[] = [1,-1,0,0];

                let dr:number = rowDirections[direction];
                let dc:number = columnDirections[direction];

                let valid:boolean = true;
                // console.log("Im here 2");
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
        return answer;
    }
}