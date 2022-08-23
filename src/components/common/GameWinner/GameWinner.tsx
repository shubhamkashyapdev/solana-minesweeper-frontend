import { useEffect } from 'react'
import { useSelector } from 'react-redux'
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
export const endTheFcukingGame = () => (props: any) => {
    console.log(props);
    // const { socket, opponent, score } = props;
    // socket.emit('updateScore', opponent.roomId, opponent.transactionId, score)
}
const GameWinner = () => {
    //@ts-ignore
    const { socket } = useSelector(state => state.game)

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