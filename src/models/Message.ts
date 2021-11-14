import { Timestamp } from 'firebase/firestore'

export default interface Message {
    content: string
    attachments: string[]
    author: string
    createTime: Timestamp,
    id: string,
}
