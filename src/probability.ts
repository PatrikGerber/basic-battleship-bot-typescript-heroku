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
}