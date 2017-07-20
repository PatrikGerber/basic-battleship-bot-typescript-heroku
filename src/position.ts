import {GameState} from "./gameState"

export class Position{
    public row:number;
    public column:number;
    constructor(pos:{"Row":string, "Column":number}){
        this.row = GameState.backConverter[pos.Row];
        this.column = pos.Column - 1;
    }
    public structure():{"Row":string, "Column":number}{
        return {"Row":GameState.converter[this.row], "Column":this.column+1};
    }
}