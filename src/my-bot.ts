import {GameState} from "./gameState"
import {Position} from "./position"

export class MyBot {
    public getShipPositions() {
        return [
            { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
            { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
            { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
            { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
            { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
        ]
    }

    // gamestate is the body of the post request i.e. req.body
    public selectTarget(gamestate:GameState) {
        gamestate.display();

        let previousShot = (gamestate.MyShots.length != 0)?gamestate.MyShots[gamestate.MyShots.length-1].Position:null;
        if(previousShot) {
            // if (gamestate.huntHitCount()){
            //     let answer = this.huntNextTarget(gamestate, gamestate.huntHitCount());
            //     return answer;
            // }
            return this.getRandomNextTarget(gamestate);
        }
        return { Row: "E", Column: 5 };
    }

    private getRandomNextTarget(gamestate:GameState):{Row:string, Column:number}{
        return gamestate.randomDraw().json();
    }

    // public huntNextTarget(gamestate:GameState, huntHitCount:number):{"Row":string, "Column":number}{
    //     if (huntHitCount == 1){
    //         let hitPosition:{"Row":string, "Column":number};
    //         let pos:number;
    //         for (let i:number = 1; i <= Math.min(gamestate.MyShots.length,4); i++){
    //             if (gamestate.MyShots[gamestate.MyShots.length-i].WasHit){
    //                 pos = i;
    //                 break;
    //             }
    //         }

    //         hitPosition = gamestate.MyShots[gamestate.MyShots.length-pos];
    //         let row:number = GameState.converter[hitPosition.Row]; // 0 indexed
    //         let column:number = hitPosition.Column-1; // 0 indexed

    //         if (gamestate.isValidTarget(row, column+1)) {
    //             console.log("Actually returning something")
    //             return {"Row":GameState.backConverter[row], "Column":column+2};
    //         }
    //         if (gamestate.isValidTarget(row, column-1)) {
    //             console.log("Actually returning something")
    //             return {"Row":GameState.backConverter[row], "Column":column};
    //         }
    //         if (gamestate.isValidTarget(row+1, column)) {
    //             console.log("Actually returning something")
    //             return {"Row":GameState.backConverter[row+1], "Column":column+1};
    //         }
    //         if (gamestate.isValidTarget(row-1, column)) {
    //             console.log("Actually returning something")
    //             return {"Row":GameState.backConverter[row-1], "Column":column+1};
    //         }
    //     }
    //     return this.getRandomNextTarget(gamestate);
    // }
}

