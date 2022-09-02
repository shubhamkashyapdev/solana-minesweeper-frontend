import React, { Component } from "react";
import { connect, Subscription } from "react-redux";
import {
  gameEnded,
  setBetAmount,
  setDifficultyLevel,
  updateScore,
  updateWinner,
} from "../../../redux/Game/GameAction";
import { BetBalance, MainBalance } from "../balance";
import { Select } from "@mantine/core";
import { board } from "../board-generator";
import { session } from "../game";
import "./game-form.scss";
import { SearchOpponent } from "../../common";
import GameWinner from "../../common/GameWinner/GameWinner";
import { showNotification } from "@mantine/notifications";

export interface IState {
  amount: number;
  mode: number;
  score: number;
  time: number;
  show: boolean;
  winnerArr: string[];
}

export class game_form extends Component<{}, IState> {
  static interval: any;
  static self: typeof game_form = this;
  static gameProps: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      amount: BetBalance.Set(MainBalance.GetValue()),
      mode: 1,
      score: 0,
      time: 30, // 180 seconds - 3min
      show: false,
      winnerArr: [],
    };
    this.GetInputAmount = this.GetInputAmount.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.Submit = this.Submit.bind(this);
  }

  GetInputAmount(event: any) {
    this.setState((pState) => ({
      amount: BetBalance.Set(MainBalance.CheckIfBalance(event.target.value)),
      mode: pState.mode,
    }));
  }

  componentDidUpdate() {
    console.log(`game form re-render triggered`);
    //@ts-ignore
    game_form.gameProps = this.props;
  }

  Submit() {
    if (board.isActive) {
      return;
    }

    if (this.state.amount < 0) {
      alert("Please choose a bet amount");
      return;
    }

    if (this.state.amount > 100) {
      return;
    }

    //@ts-ignore
    this.props.setBetAmount(Number(this.state.amount));
    this.setState({ show: true });
    showNotification({
      title: "Searching for opponent",
      message: "Game will be starting..",
      loading: true,
      styles: (theme) => ({
        root: { backgroundColor: theme.colors.dark[9] },
        borderColor: theme.colors.gray[8],
        "&::before": { backgroundColor: theme.white },
        title: { color: theme.white },

        closeButton: {
          color: theme.black,
          "&:hover": {
            backgroundColor: "#F7C901",
          },
        },
      }),
    });
  }

  hidePopup() {
    this.setState({ show: false });
  }

  startGame(self: any) {
    if (board.isActive) {
      return;
    }
    if (this.state.amount < 0) {
      alert("Please choose a bet amount");
      return;
    }

    if (this.state.amount > 100) {
      return;
    }
    if (!board.isActive) {
      self.startGameSession();
      // @ts-ignore
      self.props.updateScore(0);
      session.StartSession(self);
      return;
    }
    //@ts-ignore
    this.props.gameEnded();
    session.EndSession();
  }

  leaveGameSession() {
    session.EndSession();
  }

  onChangeValue(event: any) {
    //@ts-ignore
    this.props.setDifficultyLevel(
      Number(event.target.value) < 5
        ? Number(event.target.value) * 5
        : Number(event.target.value)
    );
    this.setState(() => ({
      mode: event.target.value,
    }));
  }

  UpdateAmount() {
    this.setState((pState) => ({
      amount: BetBalance.GetValue(),
      mode: pState.mode,
    }));
  }

  ActivateForm(isActive: boolean): void {
    if (isActive) {
      document.getElementById("form_container")?.classList.remove("disabled");
      return;
    }
    document.getElementById("form_container")?.classList.add("disabled");
    return;
  }

  startGameSession() {
    //@todo - show popup to notify the user that game has ended
    //@todo - reset the state after the session ends
    game_form.interval = setInterval(() => {
      if (this.state.time <= 0) {
        session.KillSession();
        gameEnded();

        console.log({ gameEnded: true });
      }
      this.setState({ time: this.state.time - 1 });
    }, 1000);
    return () => clearInterval(game_form.interval);
  }

  static getInterval() {
    return this.interval;
  }

  getTime(num: number): string {
    let minutes = Math.floor(num / 60);
    let seconds = num - minutes * 60;
    return `0${minutes}:${`${seconds}`.length === 1 ? `0${seconds}` : seconds}`;
  }

  resetInerval(): void {
    console.log({ resetInerval: this });
  }

  render() {
    return (
      <>
        {this.state.show && (
          // @ts-ignore
          <SearchOpponent
            hidePopup={() => this.hidePopup()}
            startGame={() => this.startGame(this)}
          />
        )}
        <GameWinner handleResetInterval={this.resetInerval} />
        <div className="formBody bg-[#2b1d11] min-w-[300px] shadow-2xl ...">
          <div id="form_container" className="form_container">
            <div className="flex justify-between my-2">
              {/* @ts-ignore */}
              <span>Score: {Number(this.props.score)}</span>
              {/* @ts-ignore */}
              <span>Bet Amount: {Number(this.props.betAmount)}</span>
              {/* @ts-ignore */}
              <span>Level: {Number(this.props.level)}</span>
            </div>
            <div className="flex mb-2">
              <span>Remaining: {this.getTime(this.state.time)}</span>
            </div>
            {/* @ts-ignore */}

            <span className="label mt-4">Bet Amount</span>
            <div className="">
              <Select
                id={`betAmount`}
                styles={{ input: { backgroundColor: "black", color: "white" } }}
                placeholder="Pick one"
                value={`${this.state.amount}`}
                onChange={(val: string) => {
                  this.setState({ amount: Number(val) });
                }}
                data={[
                  { value: "0.001", label: "0.001" },
                  { value: "0.002", label: "0.002" },
                  { value: "0.003", label: "0.003" },
                  { value: "0.004", label: "0.004" },
                ]}
              />
            </div>

            <span className="label mt-4">Number Of Thieves</span>
            <div className="numberOfThieves rounded-2xl ">
              <div className="input_container  bg-black">
                <input
                  onChange={this.onChangeValue}
                  type="radio"
                  id="fiveThieves"
                  name="nThieves"
                  value="1"
                  defaultChecked
                ></input>
                <span className="checkmark">5</span>
              </div>
              <div className="input_container  bg-black">
                <input
                  onChange={this.onChangeValue}
                  type="radio"
                  id="tenThieves"
                  name="nThieves"
                  value="2"
                ></input>
                <span className="checkmark">10</span>
              </div>
              <div className="input_container  bg-black">
                <input
                  onChange={this.onChangeValue}
                  type="radio"
                  id="fifteenThieves"
                  name="nThieves"
                  value="3"
                ></input>
                <span className="checkmark">15</span>
              </div>
            </div>
            <div className="flex mt-4 ">
              <button
                disabled={board.isActive}
                onClick={this.Submit}
                id="start-cashout"
                className="bg-primary rounded-2xl shadow-lg text-primaryBlack py-2 flex-1 cursor-pointer disabled:cursor-not-allowed disabled:bg-primaryBlack/40 disabled:text-primary"
              >
                Bet
              </button>
            </div>
            <div className="flex mt-4">
              <button
                onClick={this.leaveGameSession}
                className={`py-2 flex-1 cursor-pointer ${
                  board.isActive
                    ? "bg-primary text-primaryBlack cursor-auto"
                    : "bg-black/40 text-primary cursor-not-allowed"
                }`}
              >
                Leave Game
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    score: state.game.score,
    betAmount: state.game.betAmount,
    walletAddress: state.game.walletAddress,
    level: state.game.level,
    socket: state.game.socket,
    opponent: state.game.opponent,
    winnerArr: state.game.winnerArr,
  };
}

const mapDispatchToProps = {
  updateScore: updateScore,
  setBetAmount: setBetAmount,
  setDifficultyLevel: setDifficultyLevel,
  updateWinner: updateWinner,
  gameEnded: gameEnded,
};

export default connect(mapStateToProps, mapDispatchToProps)(game_form);
