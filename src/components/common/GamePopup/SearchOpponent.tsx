import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface SocketData {
    amount: number;
    level: number;
    socketId: string;
    userId: string;
    _id: string;
    _v?: number;
}
interface Opponent {
    amount: number;
    level: number;
    socketId: string;
    userId: string;
    _id: string;
    _v?: number;
    roomId: string;
}

interface ISearchOpponent {
    hidePopup: () => void;
    startGame: () => void;
}

const Card = () => {
    return (
        <div className="top-[50%] h-[300px] w-[500px] bg-primaryBlack shadow-lg rounded-2xl flex-col  items-center">
            <div className="flex flex-col w-full justify-center items-center h-full">
                <div className="flex items-center justify-between w-[80%] mx-auto">
                    <div className="w-28 h-28 rounded-full shadow-lg border-4 border-white">
                        <img className="w-full h-full object-cover overflow-hidden rounded-full" src="http://surl.li/csiqn" />
                    </div>
                    <div className="w-16 h-16">
                        <img className="w-full h-full object-cover overflow-hidden" src="http://surl.li/csirq" />
                    </div>

                    <div className="w-28 h-28 rounded-full shadow-lg border-4 border-white">
                        <img className="w-full h-full object-cover overflow-hidden rounded-full" src="http://surl.li/csiqn" />
                    </div>
                </div>
                <div className="my-6">
                    <button>Game starting in: 00:00</button>
                </div>
            </div>
        </div>
    )
}


const SearchOpponent: React.FC<ISearchOpponent> = ({ hidePopup, startGame }) => {
    const [opponent, setOpponent] = useState<Opponent | null>(null)
    //@ts-ignore
    const { walletAddress, socket, betAmount, level } = useSelector(state => state.game)
    console.log({ walletAddress, socket, betAmount, level })
    useEffect(() => {
        socket.emit("availableForMatch", walletAddress, betAmount, level)
    }, [])

    useEffect(() => {
        socket.on("gotOpponent", (data: SocketData, roomId: string) => {
            console.log({ data, roomId })
            setOpponent({ ...data, roomId })
        })
    }, [])

    useEffect(() => {
        if (opponent?.roomId) {
            socket.emit("msgToCustomRoom", `Room Created successfully :)`, opponent.roomId)
        }
    }, [opponent])

    useEffect(() => {
        socket.on("message", (message: string) => {
            //@todo - show in notification
            console.log({ message })
            //start the game
            //@ts-ignore
            // hidePopup();
            startGame();
        })
    }, [])




    return (
        <div className="bg-primaryBlack/50 z-10 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <Card />

        </div>
    )
}

export default SearchOpponent