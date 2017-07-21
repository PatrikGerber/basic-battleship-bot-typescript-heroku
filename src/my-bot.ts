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
        // gamestate.display();

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
        // console.log();
        // console.log("Remaining ships are: ", gamestate.remainingShips);
        // console.log("The distribution: ");
        // console.log(Probability.getDistribution(gamestate));
        // console.log();          
        let hitPosition:Position = gamestate.getHitPosition();
        if (hitPosition){
            let neightbourHitPosition:Position = gamestate.getNeighbourHitPosition(hitPosition);
            if (neightbourHitPosition){
                let answer = gamestate.findTargetAlongLine(hitPosition, neightbourHitPosition)
                return answer;
            }
            else{
                let answer = gamestate.targetNeighbours(hitPosition);
                return answer;
            }
        }
        let answer = this.getRandomNextTarget(gamestate)
        return answer;
    }

    private getRandomNextTarget(gamestate:GameState):{Row:string, Column:number}{
        return gamestate.randomDraw().structure();
    }
}


