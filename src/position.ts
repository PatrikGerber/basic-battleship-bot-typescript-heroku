import {GameState} from "./gameState"

export class Position{
    public row:number;
    public column:number;
    constructor(pos:{"Row":string, "Column":number}){
        this.row = GameState.converter[pos.Row];
        this.column = pos.Column - 1;
    }
    public structure():{"Row":string, "Column":number}{
        return {"Row":GameState.backConverter[this.row], "Column":this.column+1};
    }
    public Display(){
        console.log("row: ", this.row, " column: ", this.column);
    }
}