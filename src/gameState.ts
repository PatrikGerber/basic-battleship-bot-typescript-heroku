import {Position} from "./position"
import {Probability} from "./probability"

export class GameState{
    public ShipPositions:Array<any>;
    public MyShots:Array<any>;
    public OpponentsShots:Array<any>;
    public remainingShips:number[] = [2,3,3,4,5];  
    // note that remainingShips always contains the shiplengths in ascending order
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

    // 0 means unchecked, 1 means hit,2 means sunk, -1 means missed
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

    public eliminateSunkenShips(init:boolean = false):void{
        // first scans rows for sunken ships
        for (let row:number =0; row<10; row++){
            for (let column:number = 0; column<10; column++){
                let startColumn:number = column;
                if (this.board[row][column]==1){
                    while ((column<10) && (this.board[row][column]==1)){
                        column++;
                    }
                    let sunken:boolean = this.isSunken(row,startColumn,row,column-1, init);
                    if (sunken){
                        let shipLength:number = column-startColumn;
                        this.remainingShips = this.remove(shipLength);
                        this.sink(row,startColumn,row,column-1);
                    }
                }
            }
        }
        // then checks columns for sunken ships
        for (let column:number =0; column<10; column++){
            for (let row:number = 0; row<10; row++){
                let startRow:number = row;
                if (this.board[row][column]==1){
                    while ((row<10) && (this.board[row][column]==1)){
                        row++;
                    }
                    let sunken:boolean = this.isSunken(startRow,column,row-1,column, init);
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
            if (done){
                ans.push(this.remainingShips[i]);
            }
            else {
                if (this.remainingShips[i]!=shipLength){
                    ans.push(this.remainingShips[i]);
                }
                else{
                    done = true;
                }
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

    public canEliminateGivenRemainingShips(startRow:number, startColumn:number, endRow:number, endColumn:number):boolean{
        let canFit:boolean = false;
        if (startRow != endRow){
            let currentLength:number = Math.abs(endRow - startRow)+1;
            let count:number = 0;
            let i:number = startRow;
            while (i<10){
                if ((this.board[i][startColumn] == 1) || (this.board[i][startColumn] == 0)){
                    count++;
                }
                else break;
                i++;
            }
            i = startRow-1;
            while (i>=0){
                if ((this.board[i][startColumn] == 1) || (this.board[i][startColumn] == 0)){
                    count++;
                }
                else break;
                i--;
            }
            for (let index:number = 0; index<this.remainingShips.length; index++){
                if (currentLength < this.remainingShips[index]){
                    if (count>=this.remainingShips[index]){
                        canFit = true;
                    }
                }
            }
        }
        else {
            let currentLength:number = Math.abs(endColumn - startColumn)+1;
            let canFit:boolean = false;
            let count:number = 0;
            let i:number = startColumn;
            while (i<10){
                if ((this.board[startRow][i] == 1) || (this.board[startRow][i] == 0)){
                    count++;
                }
                else break;
                i++;
            }
            i = startRow-1;
            while (i>=0){
                if ((this.board[startRow][i] == 1) || (this.board[startRow][i] == 0)){
                    count++;
                }
                else break;
                i--;
            }
            for (let index:number = 0; index<this.remainingShips.length; index++){
                if (currentLength < this.remainingShips[index]){
                    if (count>=this.remainingShips[index]){
                        canFit = true;
                    }
                }
            }
        }
        return (!canFit);
    }

    public isSunken(startRow:number, startColumn:number, endRow:number, endColumn:number, init:boolean=false):boolean{
        if ((startRow==endRow) && (startColumn == endColumn)){
            return false;
        }
        // if (!init){
        //     if (this.canEliminateGivenRemainingShips(startRow, startColumn, endRow, endColumn)) {
        //         return true;
        //     }
        // }
        if (startRow!=endRow){
            if (Math.abs(endRow - startRow)+1 == this.remainingShips[this.remainingShips.length-1]){
                return true;
            }
            if ((startRow == 0) || (this.board[startRow-1][startColumn]==-1)){
                if ((endRow == 9) || (this.board[endRow+1][startColumn]==-1)){
                    return true;
                }
            }
        }
        else {
            if (Math.abs(endColumn - startColumn)+1 == this.remainingShips[this.remainingShips.length-1]){
                return true;
            }
            if ((startColumn == 0) || (this.board[startRow][startColumn-1]==-1)){
                if ((endColumn == 9) || (this.board[startRow][endColumn+1]==-1)){
                    return true;
                }
            }
        }
        return false
    }

    // returns a position on the board that is a 1 i.e. a ship we hit but haven't sunk yet (if it exists)
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

    // given hitPosition, returns a position with a hit that is a neighbour of hitPosition (if such position exists)
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
        for (let i of Probability.shuffleArray([0,1,2,3])){
            let dr:number = hitPosition.row+x[i];
            let dc:number = hitPosition.column+y[i];
            let pos:Position = new Position({"Row": GameState.numberToLetter[dr], "Column":dc+1});
            if (this.isValidTarget(pos)){
                return pos.structure();
            }
        }
        return null
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
        let grid:number;
        if (this.remainingShips[this.remainingShips.length-1]>=4){
            grid = 4;
        }
        else {
            grid = 2;
        }
        let validTargets:Array<Position> = Probability.getTargetArray(this, grid, init);
        let rand:number = Math.random()*validTargets.length;
        return validTargets[Math.floor(rand)];
    }
}