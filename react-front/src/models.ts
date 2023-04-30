export interface IUser{
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    phone: string
    role: string
}

export interface IEvent{
    id: number
    title: string
    content: string
    date: string
    startTime: string
    endTime: string
    user_id: number
    username: string
}
