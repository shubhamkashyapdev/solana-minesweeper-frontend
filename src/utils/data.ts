
export type priceItem = {
    value: string;
    label: string;
}

export type Opponent = {
    amount: number;
    level: number;
    socketId: string;
    userId: string;
    _id: string;
    _v?: number;
    roomId: string;
    transactionId: string;
}

export const priceData: priceItem[] = [
    { value: "0.01", label: "0.01" },
    { value: "0.02", label: "0.02" },
    { value: "0.03", label: "0.03" },
    { value: "0.04", label: "0.04" },
]