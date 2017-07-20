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
        // console.log();
        // console.log("gamestate.MyShots[0].Position: ....");
        // console.log(gamestate.MyShots[0] && gamestate.MyShots[0].Position);
        // console.log();
        
        var previousShot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
        if(previousShot) {
            return this.getNextTarget(previousShot.Position);
        }

        // let previousShot = gamestate.MyShots?gamestate.MyShots[gamestate.MyShots.length-1].Position:null;
        // if(previousShot) {
        //     console.log()
        //     console.log("Getnexttarget: ");
        //     console.log(this.getNextTarget(previousShot));
        //     console.log();
        //     return this.getNextTarget(previousShot);
        // }
        return { Row: "E", Column: 5 };
    }

    // position is the position of our previous shot
    private getNextTarget(position) {
        let column = this.getNextColumn(position.Column);
        let row = column === 1 ? this.getNextRow(position.Row) : position.Row;
        return { Row: row, Column: column }
    }

    private getNextRow(row) {
        let newRow = row.charCodeAt(0) + 1;
        if(newRow > 'J'.charCodeAt(0)) {
            return 'A';
        }
        return String.fromCharCode(newRow);
    }

    private getNextColumn(column) {
        return column % 10 + 1;
    }
}

