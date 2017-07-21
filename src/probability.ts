import {GameState} from "./gameState"
import {Position} from "./position"

export class Probability{
    public static grid(gamestate:GameState):Array<Position>{
        let validTargets:Array<Position> = [];
        for (let row:number = 0; row<10; row++){
            for (let column:number = 0; column<10; column++){
                let pos:Position = new Position({"Row": GameState.numberToLetter[row],"Column":column+1});
                if ((gamestate.isValidTarget(pos)) && ((pos.row+pos.column )%2 == 0)) {
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
            let row:number = Math.floor(Math.random()*10);
            let column:number = Math.floor(Math.random()*10);
        }
        return answer;
    }
}