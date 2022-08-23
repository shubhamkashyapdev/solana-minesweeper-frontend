import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { gameEnded } from '../../../redux/Game/GameAction'
interface Opponent {
    amount: number;
    level: number;
    socketId: string;
    userId: string;
    _id: string;
    _v?: number;
    roomId: string;
    transactionId: string;
}

let fn = null;

const GameWinner = () => {
    //@ts-ignore
    const { socket } = useSelector(state => state.game)
    const dispatch = useDispatch();
    useEffect(() => {
        if (socket) {
            socket.on('winner', (walletAddress: string) => {
                console.log({ winner: walletAddress })
            })
        }
    }, [socket])
    return null
}
export default GameWinner