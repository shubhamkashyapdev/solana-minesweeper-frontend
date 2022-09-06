import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from 'react-tooltip';
import {
  gameEnded,
  resetTime,
  setBetAmount,
  setDifficultyLevel,
  setTime,
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
import { IconX } from "@tabler/icons";

export interface IState {
  amount: number;
  mode: number;
  score: number;
  show: boolean;
  winnerArr: string[];
}

export interface IProps {
  score: number;
  betAmount: number;
  walletAddress: string;
  level: number;
  socket: any;
  opponent: any;
  winnerArr: string[];
  time: number;
  updateScore: any;
  setBetAmount: any;
  setDifficultyLevel: any;
  updateWinner: any;
  gameEnded: any;
  resetTime: any;
  setTime: any;
}

export class game_form extends Component<IProps, IState> {
  static interval: any;
  static self: typeof game_form = this;
  static gameProps: any = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      amount: BetBalance.Set(MainBalance.GetValue()),
      mode: 1,
      score: 0,
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
    // console.log(board.isActive);
    // console.warn(this.props.walletAddress);

    if (!this.props.walletAddress) {
      showNotification({
        title: "Error",
        message: "Wallet not connected pls connect first",
        autoClose: 2000,
        color: "red",
        icon: <IconX />,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.dark[8],
            "&::before": { BackgroundColor: theme.white },
          },
          title: { color: theme.white },
          description: { color: theme.colors.gray[4] },
          closeButton: {
            color: theme.colors.dark,
            "&:hover": { backgroundColor: "#F7C901", color: "#000000" },
          },
        }),
      });
    }

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
    game_form.interval = setInterval(() => {
      if (this.props.time <= 0) {
        console.log("update the socre");
        this.props.resetTime();
        this.props.socket.emit(
          "updateScore",
          this.props.opponent.roomId,
          this.props.opponent.transactionId,
          this.props.score
        );
        clearInterval(game_form.interval);
        session.KillSession();
      }
      this.props.setTime();
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
    console.log({ resetInerval: game_form.gameProps });
  }

  render() {
    return (
      <>
        {this.state.show && (
          <SearchOpponent
            hidePopup={() => this.hidePopup()}
            startGame={() => this.startGame(this)}
          />
        )}
        <GameWinner handleResetInterval={this.resetInerval} />
        <div className="formBody bg-[#2b1d11] min-w-[300px] shadow-2xl ...">
          <div id="form_container" className="form_container">
            <div className="flex justify-between my-4 space-x-2">
              {/* <ReactTooltip /> */}

              <button data-tip="Score" data-place="top" type="button" className="relative bg-darkBG shadow-xl rounded-sm  font-bold w-full py-2">
                <div className="absolute text-sm -top-4 drop-shadow-sm ">Score</div>
                {Number(this.props.score)}
              </button>

              <button data-tip="Bet Amount" className="relative bg-darkBG shadow-xl rounded-sm  font-bold w-full py-2">
                <div className="absolute text-sm -top-4 drop-shadow-sm ">Bet Amount</div>
                {Number(this.props.betAmount)}
              </button>
            </div>
            <div className="flex justify-between my-2 space-x-2">
              <button data-tip="Diffuculty Level" className="relative bg-darkBG shadow-xl rounded-sm  font-bold w-full py-2">
                <div className="absolute text-sm -top-4 drop-shadow-sm ">Diffuculty</div>
                {Number(this.props.level)}
              </button>
              <button data-tip="Time Remaining" className="relative bg-darkBG shadow-xl rounded-sm  font-bold w-full py-2">
                <div className="absolute text-sm -top-4 drop-shadow-sm ">Time</div>
                {this.getTime(this.props.time)}
              </button>
            </div>
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
            {/* <div className="flex mt-4">
              <button
                onClick={this.leaveGameSession}
                className={`py-2 flex-1 cursor-pointer ${board.isActive
                  ? "bg-primary text-primaryBlack cursor-auto"
                  : "bg-black/40 text-primary cursor-not-allowed"
                  }`}
              >
                Leave Game
              </button>
            </div> */}
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
    time: state.game.time,
  };
}

const mapDispatchToProps = {
  updateScore: updateScore,
  setBetAmount: setBetAmount,
  setDifficultyLevel: setDifficultyLevel,
  updateWinner: updateWinner,
  gameEnded: gameEnded,
  resetTime: resetTime,
  setTime: setTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(game_form);
