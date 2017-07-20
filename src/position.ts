import {GameState} from "./gamestate"

export class Position{
    public row;
    public column;
    constructor(pos:{"Row":string, "Column":number}){
        this.row = GameState.backConverter[pos.Row];
        this.column = pos.Column - 1;
    }
    public json():{"Row":string, "Column":number}{
        return {"Row":GameState.converter[this.row], "Column":this.column+1};
    }
}