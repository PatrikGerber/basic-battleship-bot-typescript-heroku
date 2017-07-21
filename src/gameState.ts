import {Position} from "./position"
import {Probability} from "./probability"

export class GameState{
    public ShipPositions:Array<any>;
    public MyShots:Array<any>;
    public OpponentsShots:Array<any>;
    public remainingShips:number[] = [2,3,3,4,5];
    public getBoard():number[][]{
        return this.board;
    }
    public static letterToNumber:any = {
        "A":0, 
        "B":1, 
        "C":2, 
        "D":3,
        "E":4,
        "F":5,
        "G":6,
        "H":7,
        "I":8,
        "J":9
    };
    public static numberToLetter:any = {
        0:"A",
        1:"B",
        2:"C",
        3:"D",
        4:"E",
        5:"F",
        6:"G",
        7:"H",
        8:"I",
        9:"J"
    };

    // 0 means unchecked, 1 means hit,2 means sunk, -1 means nothing there
    public board:number[][] = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];

    // reqBody is the request body, a json object
    constructor(reqBody:any){
        // A-J and 1-10
        this.ShipPositions = (reqBody.ShipPositions)?(reqBody.ShipPositions):[];
        this.MyShots = (reqBody.MyShots)?(reqBody.MyShots):[];
        this.OpponentsShots = (reqBody.OpponentsShots)?(reqBody.OpponentsShots):[];
        if (this.MyShots){
            for (let i:number = 0; i<this.MyShots.length; i++){
                let row:number = GameState.letterToNumber[this.MyShots[i].Position.Row];
                let column:number = this.MyShots[i].Position.Column - 1
                this.board[row][column] = (this.MyShots[i].WasHit)? 1 : -1;
            }
        }
    }

    public display():void{
        console.log();
        console.log(this.board);
        console.log();
    }

    //  returns true iff this.board has 0 at position (also checks if position is on the board)
    // takes zero indexed position
    public isValidTarget(position:Position):boolean{
        if (position.row >= 0){
            if (position.row < 10){
                if (position.column >= 0){
                    if (position.column < 10){
                        return (this.board[position.row][position.column]==0);
                    }
                }
            }
        }
        return false;
    }

    // public inHuntMode():number{
    //     let count:number = 0;
    //     for (let i:number = 1; i<=Math.min(this.MyShots.length,4); i++){
    //         let shot:{"Position":{"Row":string, "Column":number}, "WasHit":boolean} = this.MyShots[this.MyShots.length-i];
    //         if (shot.WasHit){
    //             count++;
    //         }
    //     }
    //     return count;
    // }

    public eliminateSunkenShips():void{
        for (let row:number =0; row<10; row++){
            for (let column:number = 0; column<10; column++){
                let startColumn:number = column;
                if (this.board[row][column]==1){
                    while ((column<10) && (this.board[row][column]==1)){
                        column++;
                    }
                    let sunken:boolean = this.isSunken(row,startColumn,row,column-1);
                    if (sunken){
                        let shipLength:number = column-startColumn;
                        this.remainingShips = this.remove(shipLength);
                        this.sink(row,startColumn,row,column-1);
                    }
                }
            }
        }
        for (let column:number =0; column<10; column++){
            for (let row:number = 0; row<10; row++){
                let startRow:number = row;
                if (this.board[row][column]==1){
                    while ((row<10) && (this.board[row][column]==1)){
                        row++;
                    }
                    let sunken:boolean = this.isSunken(startRow,column,row-1,column);
                    if (sunken){
                        let shipLength:number = row-startRow;
                        this.remainingShips = this.remove(shipLength);
                        this.sink(startRow,column,row-1,column);
                    }
                }
            }
        }
    }

    public remove(shipLength:number):number[]{
        let ans:number[] = [];
        let done:boolean = false;
        for (let i:number = 0; i<this.remainingShips.length; i++){
            if ((done) || (this.remainingShips[i]!=shipLength)){
                ans.push(this.remainingShips[i]);
                done = true;
            }
        }
        return ans;
    }

    public eliminateNeighboursOfSunken():void{
        let x:number[] = [1,1,1,0,-1,-1,-1,0];
        let y:number[] = [-1,0,1,1,1,0,-1,-1];
        for (let row:number = 0; row < 10; row++){
            for (let column:number = 0; column < 10; column ++){
                if (this.board[row][column] == 2){
                    for (let i:number = 0; i<8; i++){
                        let dr:number = row + x[i];
                        let dc:number = column + y[i];
                        if (this.isValidTarget(new Position({"Row":GameState.numberToLetter[dr], "Column":dc+1}))){
                            this.board[dr][dc] = -1;
                        }
                    }
                }
            }
        }
    }

    public sink(startRow:number, startColumn:number, endRow:number, endColumn:number):void{
        for (let row:number=startRow; row<=endRow; row++){
            for (let column:number = startColumn; column <= endColumn; column++){
                this.board[row][column] = 2;
            }
        }
    }

    public isSunken(startRow:number, startColumn:number, endRow:number, endColumn:number):boolean{
        if ((startRow==endRow) && (startColumn == endColumn)){
            return false;
        }
        if (startRow!=endRow){
            if ((startRow == 0) || (this.board[startRow-1][startColumn]==-1)){
                if ((endRow == 9) || (this.board[endRow+1][startColumn]==-1)){
                    return true;
                }
            }
        }
        else {
            if ((startColumn == 0) || (this.board[startRow][startColumn-1]==-1)){
                if ((endColumn == 9) || (this.board[startRow][endColumn+1]==-1)){
                    return true;
                }
            }
        }
        return false
    }

    public getHitPosition():Position{
        for (let row:number = 0; row<10; row++){
            for (let column:number = 0; column<10; column ++){
                if (this.board[row][column] == 1){
                    return new Position({"Row":GameState.numberToLetter[row], "Column":column+1});
                }
            }
        }
        return null
    }

    public getNeighbourHitPosition(hitPosition:Position):Position{
        let row:number = hitPosition.row;
        let column:number = hitPosition.column;
        if (column<9){
            if (this.board[row][column+1]==1){
                return new Position({"Row":GameState.numberToLetter[row], "Column":column+2});
            }
        }
        if (row<9){
            if (this.board[row+1][column]==1){
                return new Position({"Row":GameState.numberToLetter[row+1], "Column":column+1});
            }
        }
        return null;
    }

    public targetNeighbours(hitPosition:Position):{"Row":string, "Column":number}{
        let x:number[] = [1,-1,0,0];
        let y:number[] = [0,0,1,-1];
        for (let i:number=0; i<4; i++){
            let dr:number = hitPosition.row+x[i];
            let dc:number = hitPosition.column+y[i];
            let pos:Position = new Position({"Row": GameState.numberToLetter[dr], "Column":dc+1});
            if (this.isValidTarget(pos)){
                return pos.structure();
            }
        }
        return null;
    }

    public findTargetAlongLine(hitPosition:Position, neighbourHitPosition:Position):{"Row":string, "Column":number}{
        if (hitPosition.row == neighbourHitPosition.row){
            let endColumn:number = neighbourHitPosition.column;
            while ((endColumn<10) && (this.board[hitPosition.row][endColumn] == 1)){
                endColumn++;
            }
            if (endColumn<10){
                if (this.board[hitPosition.row][endColumn]==0){
                    return {"Row":GameState.numberToLetter[hitPosition.row], "Column":endColumn+1};
                }
            }

            endColumn = hitPosition.column;
            while ((endColumn>=0) && (this.board[hitPosition.row][endColumn] == 1)){
                endColumn--;
            }
            if (endColumn>=0){
                if (this.board[hitPosition.row][endColumn]==0){
                    return {"Row":GameState.numberToLetter[hitPosition.row], "Column":endColumn+1};
                }
            }
        }
        else {
            let endRow:number = neighbourHitPosition.row;
            while ((endRow<10) && (this.board[endRow][hitPosition.column] == 1)){
                endRow++;
            }
            if (endRow<10){
                if (this.board[endRow][hitPosition.column] == 0){
                    return {"Row":GameState.numberToLetter[endRow], "Column":hitPosition.column+1};
                }
            }
            
            endRow = hitPosition.row;
            while ((endRow>=0) && (this.board[endRow][hitPosition.column] == 1)){
                endRow--;
            }
            if (endRow>=0){
                if (this.board[endRow][hitPosition.column] == 0){
                    return {"Row":GameState.numberToLetter[endRow], "Column":hitPosition.column+1};
                }
            }
        }
    }

    public getRemainingShips():number[]{
        return this.remainingShips;
    }

    public randomDraw(init:boolean = false):Position{
        let grid:number = this.remainingShips[this.remainingShips.length-1];
        let validTargets:Array<Position> = Probability.getTargetArray(this, grid, init);
        // let validTargets:Array<Position> = [];
        // for (let row:number = 0; row<10; row++){
        //     for (let column:number = 0; column<10; column++){
        //         let pos:Position = new Position({"Row": GameState.numberToLetter[row],"Column":column+1});
        //         if (this.isValidTarget(pos)) {
        //             validTargets.push(pos) ;
        //         }
        //     }
        // }
        console.log("validTargets.length at randomdraw: ");
        console.log(validTargets.length);
        console.log();
        let rand:number = Math.random()*validTargets.length;
        return validTargets[Math.floor(rand)];
    }
}