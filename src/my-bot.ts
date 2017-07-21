import {GameState} from "./gameState"
import {Position} from "./position"
import {Probability} from "./probability"

export class MyBot {
    public getShipPositions() {
        try {
            return Probability.randomShipPositions();
        }
        catch(error){
            return [
                { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
                { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
                { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
                { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
                { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
            ]
        }
    }

    // gamestate is the body of the post request i.e. req.body
    public selectTarget(gamestate:GameState) {
        gamestate.display();

        let previousShot = (gamestate.MyShots.length != 0)?(gamestate.MyShots[gamestate.MyShots.length-1].Position):null;
        if(previousShot) {
            try{
                return this.getNextTarget(gamestate);
            }
            catch(error) {
                console.log("________________________________ERROR___________________________");
                return this.getRandomNextTarget(gamestate);
            }
            // let huntCount:number = gamestate.inHuntMode();
            // if (huntCount){
            //     return this.huntTarget(gamestate, huntCount).structure();
            // }
            // return this.getRandomNextTarget(gamestate);
        }
        return { Row: "E", Column: 5 };
    }

    public getNextTarget(gamestate:GameState):{"Row":string, "Column":number}{
        gamestate.eliminateSunkenShips();
        gamestate.eliminateNeighboursOfSunken();
        gamestate.eliminateSunkenShips();    
        gamestate.eliminateNeighboursOfSunken();            
        let hitPosition:Position = gamestate.getHitPosition();
        if (hitPosition){
            let neightbourHitPosition:Position = gamestate.getNeighbourHitPosition(hitPosition);
            if (neightbourHitPosition){
                let answer = gamestate.findTargetAlongLine(hitPosition, neightbourHitPosition)
                console.log("lineMake the move ", answer)
                return answer;
            }
            else{
                let answer = gamestate.targetNeighbours(hitPosition);
                console.log("neighbMake the move ", answer);
                return answer;
            }
        }
        let answer = this.getRandomNextTarget(gamestate)
        console.log("randMake the move ", answer)
        return answer;
    }

    // public huntTarget(gamestate:GameState, huntCount:number):Position{
    //     if (huntCount == 1){
    //         let hitPos:Position;
    //         for (let i:number = 1; i<=Math.min(gamestate.MyShots.length,4); i++){
    //             let position:Position = new Position(gamestate.MyShots[gamestate.MyShots.length-i].Position);
    //             let shot:{"Position":{"Row":string, "Column":number}, "WasHit":boolean} = gamestate.MyShots[gamestate.MyShots.length-i];
    //             if ((shot.WasHit) && (gamestate.board[position.row][position.column] != 2)){
    //                 hitPos = new Position(shot.Position);
    //                 break;
    //             }
    //         }
    //         console.log("We had a hit at , just checking git");
    //         hitPos.Display();
    //         console.log();
    //     }
    //     return gamestate.randomDraw();
    // }

    private getRandomNextTarget(gamestate:GameState):{Row:string, Column:number}{
        return gamestate.randomDraw().structure();
    }
}


