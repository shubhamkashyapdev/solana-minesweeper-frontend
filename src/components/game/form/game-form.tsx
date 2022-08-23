import React, { Component } from 'react';
import { connect, Subscription } from 'react-redux';
import { setBetAmount, setDifficultyLevel, updateScore } from '../../../redux/Game/GameAction';
import { BetBalance, MainBalance } from '../balance';
import { Select } from '@mantine/core';
import { board } from '../board-generator';
import { session } from '../game';
import './game-form.scss'
import { SearchOpponent } from '../../common';
import GameWinner from '../../common/GameWinner/GameWinner';

export interface IState {
    amount: number;
    mode: number;
    score: number;
    time: number;
    show: boolean;
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
            time: 180, // 180 seconds - 3min
            show: false,
        };
        game_form.gameProps = this.props;

        this.GetInputAmount = this.GetInputAmount.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.Submit = this.Submit.bind(this);
    }



    GetInputAmount(event: any) {
        this.setState((pState) => ({
            amount: BetBalance.Set(MainBalance.CheckIfBalance(event.target.value)),
            mode: pState.mode
        }))
    }

    Submit() {
        if (board.isActive) {
            return;
        }

        if (this.state.amount < 0) {
            alert("Please choose a bet amount")
            return;
        }

        if (this.state.amount > 100) {
            return;
        }

        //@ts-ignore
        this.props.setBetAmount(Number(this.state.amount))

        //@todo - search for opponent to play with - (Match)
        this.setState({ show: true })
        //@todo - initiate the solana transaction
        //@todo - start the game session
    }

    hidePopup() {
        console.log(`hide the popup true:`, this.state.show)
        this.setState({ show: false })
    }

    startGame(self: any) {
        if (board.isActive) {
            return;
        }
        if (this.state.amount < 0) {
            alert("Please choose a bet amount")
            return;
        }

        if (this.state.amount > 100) {
            return;
        }
        if (!board.isActive) {
            self.startGameSession();
            // @ts-ignore
            self.props.updateScore(0)
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

    leaveGame() {
        // @todo - destory the user session - socket room
        // @todo - end the game - player b will be the winner
    }

    onChangeValue(event: any) {
        //@ts-ignore
        this.props.setDifficultyLevel(Number(event.target.value) < 5 ? Number(event.target.value) * 5 : Number(event.target.value))
        this.setState(() => ({
            mode: event.target.value
        }))
    }

    UpdateAmount() {
        this.setState((pState) => ({
            amount: BetBalance.GetValue(),
            mode: pState.mode
        }))
    }

    ActivateForm(isActive: boolean): void {
        if (isActive) {
            document.getElementById('form_container')?.classList.remove('disabled');
            return;
        }
        document.getElementById('form_container')?.classList.add('disabled');
        return;
    }

    startGameSession() {
        //@todo - show popup to notify the user that game has ended
        //@todo - reset the state after the session ends
        game_form.interval = setInterval(() => {
            if (this.state.time <= 0) {
                session.KillSession();
            }
            this.setState({ time: this.state.time - 1 })
        }, 1000)
        return () => clearInterval(game_form.interval);
    }

    static getInterval() {
        return this.interval;
    }

    getTime(num: number): string {
        let minutes = Math.floor(num / 60);
        let seconds = num - (minutes * 60);
        return `0${minutes}:${`${seconds}`.length === 1 ? `0${seconds}` : seconds}`
    }

    render() {
        return (
            <>
                {
                    this.state.show && (
                        // @ts-ignore
                        <SearchOpponent hidePopup={() => this.hidePopup()} startGame={() => this.startGame(this)} />
                    )
                }
                <GameWinner />
                <div className="formBody min-w-[300px]">
                    <div id='form_container' className="form_container">
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

                        <span className='label mt-4' >Bet Amount</span>
                        <div>
                            <Select
                                id={`betAmount`}
                                placeholder="Pick one"
                                value={`${this.state.amount}`}
                                onChange={(val: string) => {
                                    this.setState({ amount: Number(val) })
                                }}
                                data={[
                                    { value: '0.001', label: '0.001' },
                                    { value: '0.002', label: '0.002' },
                                    { value: '0.003', label: '0.003' },
                                    { value: '0.004', label: '0.004' },
                                ]}
                            />
                        </div>

                        <span className='label mt-4'>Number Of Thieves</span>
                        <div className="numberOfThieves">
                            <div className="input_container">
                                <input onChange={this.onChangeValue} type="radio" id="fiveThieves" name="nThieves" value="1" defaultChecked></input>
                                <span className="checkmark">5</span>
                            </div>
                            <div className="input_container">
                                <input onChange={this.onChangeValue} type="radio" id="tenThieves" name="nThieves" value="2" ></input>
                                <span className="checkmark">10</span>
                            </div>
                            <div className="input_container">
                                <input onChange={this.onChangeValue} type="radio" id="fifteenThieves" name="nThieves" value="3" ></input>
                                <span className="checkmark">15</span>
                            </div>

                        </div>
                        <div className="flex mt-4">
                            <button disabled={board.isActive} onClick={this.Submit} id='start-cashout' className="bg-primary shadow-lg text-primaryBlack py-2 flex-1 cursor-pointer disabled:cursor-not-allowed disabled:bg-primaryBlack/40 disabled:text-primary">Start Game</button>
                        </div>
                        <div className="flex mt-4">
                            <button onClick={this.leaveGameSession} className={`py-2 flex-1 cursor-pointer ${board.isActive ? 'bg-primary text-primaryBlack cursor-auto' : 'bg-black/40 text-primary cursor-not-allowed'}`}>Leave Game</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        score: state.game.score,
        betAmount: state.game.betAmount,
        walletAddress: state.game.walletAddress,
        level: state.game.level,
        socket: state.game.socket,
    }
}

const mapDispatchToProps = {
    updateScore: updateScore,
    setBetAmount: setBetAmount,
    setDifficultyLevel: setDifficultyLevel,
}

export default connect(mapStateToProps, mapDispatchToProps)(game_form)
