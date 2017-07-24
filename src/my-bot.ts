import {GameState} from "./gameState"
import {Position} from "./position"
import {Probability} from "./probability"

export class MyBot {
    public getShipPositions() {
        try {
            return Probability.getRandomShipPositions();
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

<<<<<<< HEAD
    // gamestate is the body of the post request i.e. req.body
    public selectTarget(gamestate:GameState) {

        let previousShot = (gamestate.MyShots.length != 0)?(gamestate.MyShots[gamestate.MyShots.length-1].Position):null;
=======
    public selectTarget(gamestate) {
        var previousShot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
>>>>>>> parent of e475961... First commit, just a test
        if(previousShot) {
            try{
                return this.getNextTarget(gamestate);
            }
            catch(error) {
                console.log("________________________________ERROR___________________________");
                return this.getRandomNextTarget(gamestate);
            }
        }
        let firstShots:{Row:string, Column:number}[] = [{ Row: "E", Column: 5 },{ Row: "F", Column: 6 }]
        return firstShots[Math.floor(2*Math.random())];
    }

    public getNextTarget(gamestate:GameState):{"Row":string, "Column":number}{
        gamestate.eliminateSunkenShips();
        gamestate.eliminateNeighboursOfSunken();
        gamestate.eliminateSunkenShips();    
        gamestate.eliminateNeighboursOfSunken();  
        // We have to do the above twice because we might be able to sink additional ships 
        // after eliminating neighbours of already sunken ships

        let hitPosition:Position = gamestate.getHitPosition();
        if (hitPosition){
            let neighbourHitPosition:Position = gamestate.getNeighbourHitPosition(hitPosition);
            if (neighbourHitPosition){
                let answer = gamestate.findTargetAlongLine(hitPosition, neighbourHitPosition)
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


