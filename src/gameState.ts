export class GameState{
    public ShipPositions:Array<any>;
    public MyShots:Array<any>;
    public OpponentShots:Array<any>;
    public converter:any = {
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

    // 0 means unchecked, 1 means sunk, -1 means nothing there
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
    constructor(ShipPositions:Array<any>, MyShots:Array<any>, OpponentShots:Array<any>){
        this.ShipPositions = ShipPositions;
        this.MyShots = MyShots;
        this.OpponentShots = OpponentShots;
        if (this.MyShots){
            for (let i:number = 0; i<this.MyShots.length; i++){
                this.board[this.converter[this.MyShots[i].Position.row]][this.MyShots[i].Position.Column - 1] = (this.MyShots[i].WasHit)? 1 : -1;
            }
        }
    }
}