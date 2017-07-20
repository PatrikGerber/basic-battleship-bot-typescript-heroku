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

        let previousShot = (gamestate.MyShots.length != 0)?(gamestate.MyShots[gamestate.MyShots.length-1].Position):null;
        if(previousShot) {
            return this.getRandomNextTarget(gamestate);
        }
        return { Row: "E", Column: 5 };
    }

    private getRandomNextTarget(gamestate:GameState):{Row:string, Column:number}{
        return gamestate.randomDraw().json();
    }
}

