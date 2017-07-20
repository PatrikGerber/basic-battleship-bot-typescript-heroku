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
        gamestate.display();
        // console.log();
        // console.log("gamestate.MyShots[0].Position: ....");
        // console.log(gamestate.MyShots[0] && gamestate.MyShots[0].Position);
        // console.log();


        // Original code, in case something breaks
        // var previousShot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
        // if(previousShot) {
        //     return this.getNextTarget(previousShot.Position);
        // }

        let previousShot = (gamestate.MyShots.length != 0)?gamestate.MyShots[gamestate.MyShots.length-1].Position:null;
        if(previousShot) {
            if (gamestate.inHuntMode()){
                
            }
            return this.getRandomNextTarget(gamestate);
        }
        return { Row: "E", Column: 5 };
    }

    // position = {Row: char, Column:number} is the position of our previous shot
    private getRandomNextTarget(gamestate:GameState):{Row:string, Column:number}{
        let found = false;
        let row:number;
        let column:number;
        while (!found){
            row = Math.floor(Math.random()*10);
            column = Math.floor(Math.random()*10);
            if (!gamestate.board[row][column]){
                found = true;
            }
        }
        return {"Row":GameState.backConverter[row], "Column":column+1};
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

