import { Timestamp } from 'firebase/firestore'

export default interface Room {
    name: string
    createTime: Timestamp
    members: string[]
    id: string
}
