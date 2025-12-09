import {
  currentTurn_store,
  opponent_store,
  playerColor_store,
  username_store,
} from "$lib/store/ConncectionStore";

enum MessageAction {
  NOT_AUTHENTICATED,
  GAME_START,
  BOARD_RECEIVED,
  INVALID,
}

export class ClientConncection {
  private websocket: WebSocket;
  private _username: string | null = null;
  private _opponent: string | null = null;
  private _playerColor: "white" | "black" | null = null;
  private _currentTurn: "white" | "black" = "white";
  private _board: string | null = null;

  public constructor(protocol: "ws" | "wss", serverIP: string, serverPort: number) {
    this.websocket = new WebSocket(`${protocol}://${serverIP}:${serverPort}`);
    this.websocket.onopen = () => console.info(`Opened connection to ${protocol}://${serverIP}:${serverPort}`);
    this.websocket.onmessage = this.onMessage.bind(this);
  }

  public close() {
    this.websocket.close();
  }

  private onMessage(event: MessageEvent<string>) {
    const message = event.data;
    const action = this.parseMessage(message);
    switch (action) {
      case MessageAction.NOT_AUTHENTICATED:
        console.warn(`User (${this.username}) is not authenticated. Resend username`);
        break;
      case MessageAction.GAME_START:
        // sends opponent and the opponent's color
        const splitMessage = message.split(",");
        this.opponent = splitMessage[1];
        if (splitMessage[2] === "white") this.playerColor = "black";
        else this.playerColor = "white";
        break;
      case MessageAction.BOARD_RECEIVED:
        console.log(message);
        break;
      case MessageAction.INVALID:
        break;
    }
  }

  private parseMessage(message: string): MessageAction {
    if (message.includes("user_authenticated=false"))
      return MessageAction.NOT_AUTHENTICATED;

    if (message.includes("game_ready=true")) return MessageAction.GAME_START;

    if (message.includes("new_board=")) return MessageAction.BOARD_RECEIVED;

    return MessageAction.INVALID;
  }

  public set username(value: string) {
    if (this._username) return;

    this._username = value;
    username_store.set(value);
    this.websocket.send(`u:${value}`);
  }

  public get username(): string | null {
    return this._username;
  }

  private set opponent(value: string) {
    if (this._opponent) return;

    this._opponent = value;
    opponent_store.set(value);
  }

  public get opponent(): string | null {
    return this._opponent;
  }

  private set playerColor(value: "white" | "black") {
    this._playerColor = value;
    playerColor_store.set(value);
  }

  private get playerColor(): "white" | "black" | null {
    return this._playerColor;
  }

  private set currentTurn(value: "white" | "black") {
    this._currentTurn = value;
    currentTurn_store.set(value);
  }

  private get currentTurn(): "white" | "black" | null {
    return this._currentTurn;
  }

  public set board(value: string) {
    this._board = value;

    if (this.playerColor == "white") this.websocket.send(`tw:`);
    else this.websocket.send(`tb:`);
  }

  public get board(): string | null {
    return this._board;
  }  
}
