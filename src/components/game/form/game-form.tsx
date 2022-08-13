import React, { Component } from 'react';
import { connect, Subscription } from 'react-redux';
import { updateScore } from '../../../redux/Game/GameAction';
import { BetBalance, MainBalance } from '../balance';
import { Select } from '@mantine/core';
import { board } from '../board-generator';
import { session } from '../game';
import './game-form.scss'

export interface IState {
    amount: number;
    mode: number;
    score: number;
    time: number;
}

export class game_form extends Component<{}, IState> {
    static interval: any;

    constructor(props: any) {
        super(props);
        this.state = {
            amount: BetBalance.Set(MainBalance.GetValue()),
            mode: 1,
            score: 0,
            time: 180, // 180 seconds - 3min
        };
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
        console.log(this.state.amount)
        if (this.state.amount > 0) {
            alert("Please choose a bet amount")
            return;
        }
        this.startGameSession();
        if (!board.isActive) {
            // @ts-ignore
            this.props.updateScore(0)
            session.StartSession(this);
            return;
        }
        session.EndSession();

    }



    onChangeValue(event: any) {
        this.setState((pState) => ({
            amount: BetBalance.Set(pState.amount),
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
        game_form.interval = setInterval(() => {
            if (this.state.time >= 3 * 60 * 1000) {
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
            <div className="formBody min-w-[300px]">
                <div id='form_container' className="form_container">
                    <div className="flex justify-between my-2">
                        {/* @ts-ignore */}
                        <span>Score: {Number(this.props.score)}</span>
                        <span>Remaining: {this.getTime(this.state.time)}</span></div>
                    {/* @ts-ignore */}

                    <span className='label' >Bet Amount</span>
                    <div>
                        {/* <input className="w-full py-2 bg-dark2" id='betAmount' type="number" min='0' max='99999' value={this.state.amount} onChange={this.GetInputAmount} /> */}
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

                    <span className='label'>Number Of Thieves</span>
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
                    <div className="flex">
                        <a onClick={this.Submit} id='start-cashout' className="bg-primary text-primaryBlack py-2 flex-1 cursor-pointer">Start Game</a>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        score: state.game.score,
    }
}

const mapDispatchToProps = {
    updateScore: updateScore,
}

export default connect(mapStateToProps, mapDispatchToProps)(game_form)
