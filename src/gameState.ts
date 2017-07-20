import {Position} from "./position"

export class GameState{
    public ShipPositions:Array<any>;
    public MyShots:Array<any>;
    public OpponentsShots:Array<any>;
    public static converter:any = {
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
    public static backConverter:any = {
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
                let row:number = GameState.converter[this.MyShots[i].Position.Row];
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

    public inHuntMode():number{
        let count:number = 0;
        for (let i:number = 1; i<=Math.min(this.MyShots.length,4); i++){
            let shot:{"Position":{"Row":string, "Column":number}, "WasHit":boolean} = this.MyShots[this.MyShots.length-i];
            if (shot.WasHit){
                count++;
            }
        }
        return count;
    }

    public randomDraw():Position{
        let validTargets:Array<Position> = [];
        for (let row:number = 0; row<10; row++){
            for (let column:number = 0; column<10; column++){
                let pos:Position = new Position({"Row": GameState.backConverter[row],"Column":column+1});
                if (this.isValidTarget(pos)) {
                    validTargets.push(pos) ;
                }
            }
        }
        let rand:number = Math.random()*validTargets.length;
        return validTargets[Math.floor(rand)];
    }
}