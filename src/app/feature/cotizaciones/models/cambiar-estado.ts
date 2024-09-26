export interface StatesChange {
    id: number;
    quotationId: number;
    lastStatusId: number
    newStatusId: number
    observations: string;
}

export interface NewStates{
    key: number;
    value: string;
}