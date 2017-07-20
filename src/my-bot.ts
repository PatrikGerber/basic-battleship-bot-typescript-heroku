import {GameState} from "./gameState"

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
        // gamestate.display();

        // Original code, in case something breaks
        // var previousShot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
        // if(previousShot) {
        //     return this.getNextTarget(previousShot.Position);
        // }

        let previousShot = (gamestate.MyShots.length != 0)?gamestate.MyShots[gamestate.MyShots.length-1].Position:null;
        if(previousShot) {
            if (gamestate.huntHitCount()){
                let answer = this.huntNextTarget(gamestate, gamestate.huntHitCount());

                // console.log("We're shooting at: ")
                // console.log(answer);
                // console.log();

                if (answer == gamestate.MyShots[gamestate.MyShots.length-1].Position)  console.log("Watch out, shootin same place again!");

                return answer;
            }
            let answer = this.getRandomNextTarget(gamestate);
            // console.log("We're shooting at: ")
            // console.log(answer);
            // console.log();
            return answer;
        }
        return { Row: "E", Column: 5 };
    }

    // position = {Row: char, Column:number} is the position of our previous shot
    private getRandomNextTarget(gamestate:GameState):{Row:string, Column:number}{
        return gamestate.randomDraw();
    }

    public huntNextTarget(gamestate:GameState, huntHitCount:number):{"Row":string, "Column":number}{
        if (huntHitCount == 1){
            let hitPosition:{"Row":string, "Column":number};
            for (let i:number = 1; i<= Math.min(gamestate.MyShots.length,4); i++){
                if (gamestate.MyShots[gamestate.MyShots.length-i].WasHit){
                    hitPosition = gamestate.MyShots[gamestate.MyShots.length-i].Position;
                    break;
                }
            }
            let row = GameState.converter[hitPosition.Row]; // 0 indexed
            let column = hitPosition.Column-1; // 0 indexed
            if (gamestate.isValidTarget({"Row":row, "Column":column+1})) {
                return {"Row":GameState.backConverter[row], "Column":column+1};
            }
            if (gamestate.isValidTarget({"Row":row, "Column":column-1})) {
                return {"Row":GameState.backConverter[row], "Column":column-1};
            }
            if (gamestate.isValidTarget({"Row":row+1, "Column":column})) {
                return {"Row":GameState.backConverter[row+1], "Column":column};
            }
            if (gamestate.isValidTarget({"Row":row-1, "Column":column+1})) {
                return {"Row":GameState.backConverter[row-1], "Column":column+1};
            }
        }
        return this.getRandomNextTarget(gamestate);
    }

    // Original code in case something breaks
    // private getNextTarget(position) {
    //     let column = this.getNextColumn(position.Column);
    //     let row = column === 1 ? this.getNextRow(position.Row) : position.Row;
    //     return { Row: row, Column: column }
    // }

    // Original code, in case something breaks
    // private getNextRow(row) {
    //     let newRow = row.charCodeAt(0) + 1;
    //     if(newRow > 'J'.charCodeAt(0)) {
    //         return 'A';
    //     }
    //     return String.fromCharCode(newRow);
    // }

    // Original code, in case something breaks    
    // private getNextColumn(column) {
    //     return column % 10 + 1;
    // }
}

