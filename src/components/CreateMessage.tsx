import {createStyles, makeStyles} from "@material-ui/core/styles";
import firebase from "firebase";
import React, {useState} from "react";
import {TextField} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import Room from '../models/Room'

const useInputStyles = makeStyles(theme => createStyles({
    container: {
        alignSelf: 'flex-start',
        margin: theme.spacing("auto", 0, 3, 0),
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: theme.spacing(2),
        padding: theme.spacing(0, 2),
    },
    input: {
        width: '100%',
    }
}))

export default function CreateMessage({room}: { room: Room }) {
    const classes = useInputStyles()

    const firestore = firebase.firestore()
    const auth = firebase.auth()

    const [content, setContent] = useState("")

    const sendMessage = async () => {
        const currentUser = auth.currentUser
        if (currentUser === null) {
            throw Error("unreachable")
        }

        const message = {
            createTime: firebase.firestore.Timestamp.now(),
            attachments: [],
            author: currentUser.uid,
            content: content
        }

        await firestore.collection(`rooms/${room.id}/messages`).add(message)
        setContent("")
    }

    return (
        <div className={classes.container}>
            <TextField multiline rowsMax={5} className={classes.input} onChange={(e) => setContent(e.target.value)}
                       value={content}/>
            <IconButton onClick={sendMessage}>
                <SendIcon/>
            </IconButton>
        </div>
    )
}

export function CreateMessageSkeleton() {
    const classes = useInputStyles()

    return (
        <div className={classes.container}>
            <TextField multiline rowsMax={5} className={classes.input} disabled={true} />
            <IconButton disabled={true}>
                <SendIcon/>
            </IconButton>
        </div>
    )
}
