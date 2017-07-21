import {GameState} from "./gameState"

export class BoardToJSON{
    public static convert(board:number[][]):{"ShipPositions":Array<any>,"MyShots": Array<any>,"OpponentsShots": Array<any>} {
        let ans:{"ShipPositions":Array<any>, "MyShots":Array<any>, "OpponentsShots":Array<any>} = {"ShipPositions":[],"MyShots":[], "OpponentsShots":[]  };
        for (let row:number = 0; row<10; row++){
            for (let column:number=0; column<10; column++){
                if (board[row][column]){
                    if (board[row][column] > 0) {
                        ans.MyShots.push({"Position":{"Row":GameState.numberToLetter[row], "Column":column+1}, "WasHit":true});
                    }
                    else{
                        ans.MyShots.push({"Position":{"Row":GameState.numberToLetter[row], "Column":column+1}, "WasHit":false});
                    }
                }
            }
        }
        return ans;
    }
}