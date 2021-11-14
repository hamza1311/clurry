import firebase from "firebase/app";

export default interface Message {
    content: string
    attachments: string[]
    author: string
    createTime: firebase.firestore.Timestamp,
    id: string,
}
