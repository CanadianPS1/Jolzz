export class Piece{
    //all the diffrent things a piece can do, mainly as booleans
    id : number | undefined;
    side : string | undefined;
    pieceName : string | undefined;
    canMoveUp : boolean | undefined;
    canMoveDown : boolean | undefined;
    canMoveLeft : boolean | undefined;
    canMoveRight : boolean | undefined;
    canMoveDinagnle : boolean | undefined;
    canMoveInL : boolean | undefined;
    amountOfSpacesCanMove : number | undefined;
    public constructor(tId : number, tSide : string, tPieceName : string, tCanMoveUp : boolean, tCanMoveDown : boolean, tCanMoveRight : boolean,
                                tCanMoveLeft : boolean, tCanMoveDinagnle : boolean, tCanMoveInL : boolean,tAmountOfSpacesCanMove : number){
        this.id = tId;
        this.side = tSide;
        this.pieceName = tPieceName;
        this.canMoveUp = tCanMoveUp;
        this.canMoveDown = tCanMoveDown;
        this.canMoveLeft = tCanMoveLeft;
        this.canMoveRight = tCanMoveRight;
        this.canMoveDinagnle = tCanMoveDinagnle;
        this.canMoveInL = tCanMoveInL;
        this.amountOfSpacesCanMove = tAmountOfSpacesCanMove;
    }
    public getId(){
        return this.id;
    }public getSide(){
        return this.side;
    }public getPieceName(){
        return this.pieceName;
    }public getCanMoveUp(){
        return this.canMoveUp;
    }public getCanMoveDown(){
        return this.canMoveDown;
    }public getCanMoveLeft(){
        return this.canMoveLeft;
    }public getCanMoveRight(){
        return this.canMoveRight;
    }public getCanMoveDinagnle(){
        return this.canMoveDinagnle;
    }public getCanMoveInL(){
        return this.canMoveInL;
    }public getAmountOfSpacesCanMove(){
        return this.amountOfSpacesCanMove;
    }public setAmountOfSpacesCanMove(amount : number){
        this.amountOfSpacesCanMove = amount;
    }


}
