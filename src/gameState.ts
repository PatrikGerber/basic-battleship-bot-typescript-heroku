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

    // 0 means unchecked, 1 means hit, -1 means nothing there
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
        console.log("Constructor called with ");

        this.ShipPositions = (reqBody.ShipPositions)?reqBody.ShipPositions:[];
        this.MyShots = (reqBody.MyShots)?reqBody.MyShots:[];
        this.OpponentsShots = (reqBody.OpponentsShots)?reqBody.OpponentsShots:[];
        if (this.MyShots){
            console.log("length of MyShots: ", this.MyShots.length);
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
}