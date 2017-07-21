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
        return null;
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
        for (let len of ships){
            let gamestate:GameState = new GameState(BoardToJSON.convert(board));
            gamestate.eliminateSunkenShips();
            gamestate.eliminateNeighboursOfSunken();
            gamestate.eliminateSunkenShips();
            gamestate.eliminateNeighboursOfSunken();
            let found:boolean = false
            while (!found) {
                let pos:Position = gamestate.randomDraw(true);
                let direction:number = Math.floor(Math.random()*4);

                // 0 right, 1 down, 2 left, 3 up
                if (direction == 0){
                    let valid:boolean = true;
                    for (let i:number = 0; i<len; i==0){
                        if (!gamestate.isValidTarget(new Position({"Row":GameState.numberToLetter[pos.row], "Column":pos.column+1+i}))){
                            valid = false;
                        }
                    }
                    if (valid) {
                        answer.push({StartingSquare:{Row:GameState.numberToLetter[pos.row], Column:pos.column+1},
                                    EndingSquare:{Row:GameState.numberToLetter[pos.row], Column:pos.column+len}
                                });
                        found = true;
                    }
                }
            }
        }
        return answer;
    }
}