import { createStyles, makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import { TextField } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import Room from '../../models/Room'
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { Theme } from '@mui/material/styles'

export const useInputStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        alignSelf: 'flex-start',
        margin: theme.spacing(2, 0, 3, 0),
        width: '100%',
        display: 'flex',
        gap: theme.spacing(2),
        padding: theme.spacing(0, 2),
    },
    input: {
        width: '100%',
    }
}))

export default function CreateMessage({ room }: { room: Room }) {
    const classes = useInputStyles()

    const firestore = getFirestore()
    const auth = getAuth()

    const [content, setContent] = useState('')

    const sendMessage = async () => {
        const currentUser = auth.currentUser
        if (currentUser === null) {
            throw Error('unreachable')
        }

        const message = {
            createTime: Timestamp.now(),
            attachments: [],
            author: currentUser.uid,
            content: content
        }

        await addDoc(collection(firestore, `rooms/${room.id}/messages`), message)
        setContent('')
    }

    const onKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key.toLowerCase() === 'enter' && !e.shiftKey) {
            e.preventDefault()
            await sendMessage()
        }
    }

    return (
        <div className={classes.container}>
            <TextField
                multiline
                maxRows={5}
                className={classes.input}
                onChange={(e) => setContent(e.target.value)}
                label='Type a message...'
                value={content}
                onKeyDown={(e) => onKeyDown(e)}
            />
            <IconButton onClick={sendMessage}>
                <SendIcon/>
            </IconButton>
        </div>
    )
}

