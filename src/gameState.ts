export class GameState{
    public ShipPositions:Array<any>;
    public MyShots:Array<any>;
    public OpponentsShots:Array<any>;
    // public huntMode:boolean;
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
        // console.log("Constructor called with ");

        this.ShipPositions = (reqBody.ShipPositions)?reqBody.ShipPositions:[];
        this.MyShots = (reqBody.MyShots)?reqBody.MyShots:[];
        this.OpponentsShots = (reqBody.OpponentsShots)?reqBody.OpponentsShots:[];
        if (this.MyShots){
            // console.log("length of MyShots: ", this.MyShots.length);
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

    // This is only called with MyShots defined
    // returns true iff at least one of last 4 shots was a hit with the hit not being on a ship that already sunk
    public huntHitCount():number{
        let ans:number = 0;
        for (let i:number = 1; i<= Math.min(this.MyShots.length,4); i++){
            let shot_i:{Position:{"Row":string, "Column":number}, WasHit:boolean} = this.MyShots[this.MyShots.length-i]
            let row:number = GameState.converter[shot_i.Position.Row];
            let column:number = shot_i.Position.Column;
            if ((shot_i.WasHit == true) && (this.board[row][column] != 2)){
                ans++;
            }
        }
        return ans;
    }

    //  returns true iff this.board has 0 at position (also checks if position is on the board)
    public isValidTarget(position: {"Row":number, "Column":number}):boolean{
        let row:number = position.Row;
        let column:number = position.Column;
        if (row<0 || row>9 || column <0 || column>9) return false;
        return (this.board[row][column]==0);
    }
}