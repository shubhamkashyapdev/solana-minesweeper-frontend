import React from "react";
import * as PIXI from "pixi.js";
import * as Cards from "./cards";
import { CardSlot } from "./card-slot";
import { board } from "./board-generator";
import { BetBalance, CurBetBalance, MainBalance } from "./balance";
import { game_form } from "./form/game-form";
import { Round } from "./utils";
import { gameEnded, updateScore } from "../../redux/Game/GameAction";
import { connect } from "react-redux";

export var app: PIXI.Application;

export class Game extends React.Component {
  gameCanvas: any;
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    app = new PIXI.Application({
      backgroundAlpha: 0,
      height: 2000,
      width: 2000,
    });
    this.gameCanvas.appendChild(app.view);
    app.start();
    this.LoadTextures(this.BoardSetup.bind(this));
  }

  componentWillUnmount() {
    app.stop();
  }

  LoadTextures(_callback: () => void): void {
    Cards.CardsList[0].texture = PIXI.Texture.from(Cards.CardsList[0].path, {
      resourceOptions: { scale: 3 },
    });
    Cards.CardsList[1].texture = PIXI.Texture.from(Cards.CardsList[1].path, {
      resourceOptions: { scale: 3 },
    });
    Cards.CardsList[2].texture = PIXI.Texture.from(Cards.CardsList[2].path, {
      resourceOptions: { scale: 3 },
    });
    Cards.CardsList[3].texture = PIXI.Texture.from(Cards.CardsList[3].path, {
      resourceOptions: { scale: 3 },
    });
    Cards.CardsList[4].texture = PIXI.Texture.from(Cards.CardsList[4].path, {
      resourceOptions: { scale: 3 },
    });
    _callback();
  }

  BoardSetup(): void {
    const container = new PIXI.Container();

    app.stage.addChild(container);

    for (let i = 0; i < 25; i++) {
      const state = this;
      const card = new PIXI.Sprite(Cards.CardsList[0].texture);
      card.interactive = true;
      card.buttonMode = true;

      board.PopulateBoard();

      let card_slot: CardSlot = board.slots[i];
      card_slot.sprite = card;

      card.on(
        "pointerdown",
        this.CardInteraction.bind({ card_slot, state, props: state.props })
      );
      card.anchor.set(0.5);
      card.x = (i % 5) * 270;
      card.y = Math.floor(i / 5) * 270;
      container.addChild(card);
    }

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
  }

  private CardInteraction(): void {
    if (!board.isActive) return;
    // @ts-ignore
    const slot = this.card_slot;
    // @ts-ignore
    const props = this.state.props;
    const sum = Number(props.score) + Number(slot.card.worth);

    if (slot.card.worth && slot.isHidden) {
      props.updateScore(sum.toFixed(1));
    }
    console.log({ slot });
    // props.updateScore(slot.card.worth)
    if (board.isActive && slot.isHidden) {
      // @ts-ignore
      this.card_slot.ShowHideCard(false);
    }
  }

  render() {
    let component = this;
    return (
      <div className="canvas_container rounded-lg bg-[#1a110bce] shadow-2xl ...">
        <div
          ref={(thisDiv) => {
            component.gameCanvas = thisDiv;
          }}
        />
      </div>
    );
  }
}

class Session {
  //@ts-ignore
  gForm = new game_form();
  cashoutBtn: any;

  constructor() { }

  StartSession(gForm: game_form): void {
    MainBalance.Charge(BetBalance.GetValue());
    CurBetBalance.Set(BetBalance.GetValue());
    BetBalance.Set(0);
    gForm.UpdateAmount();
    board.SetupBoard(0, gForm.state.mode, true);
    MainBalance.Element.innerHTML = MainBalance.GetValue() + "$";
    this.gForm = gForm;
    this.gForm.ActivateForm(false);
    this.cashoutBtn = document.getElementById("start-cashout") ?? 0;
    this.ChangeCashout(true);
  }

  KillSession() {
    //MainBalance.Deposit(CurBetBalance.GetValue());
    CurBetBalance.Set(0);
    this.gForm.ActivateForm(true);
    board.isActive = false;
    this.ChangeCashout(false);
    board.ShowBoard();
  }

  EndSession() {
    MainBalance.Deposit(CurBetBalance.GetValue() * board.multiplier);
    CurBetBalance.Set(0);
    this.gForm.ActivateForm(true);
    board.isActive = false;
    MainBalance.Element.innerHTML = MainBalance.GetValue() + "$";
    this.ChangeCashout(false);
    board.ShowBoard();
  }

  ChangeCashout(isActive: boolean) {
    if (isActive) {
      this.cashoutBtn.innerHTML =
        "Cashout " +
        "<span>" +
        Round(CurBetBalance.GetValue() * board.multiplier, 2) +
        "$</span>";
      return;
    }

    this.cashoutBtn.innerHTML = "Start Game";
    return;
  }
}

export const session: Session = new Session();

function mapStateToProps(state: any) {
  return {
    score: state.game.score,
  };
}
const mapDispatchToProps = {
  updateScore: updateScore,
  gameEnded: gameEnded,
};
export default connect(mapStateToProps, mapDispatchToProps)(Game);