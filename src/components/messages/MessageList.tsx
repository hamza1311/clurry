import { List } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import Room from '../../models/Room'
import Message from '../../models/Message'
import { collection, getFirestore, onSnapshot, query, orderBy } from 'firebase/firestore'
import MessageListItemSkeleton from './MessageListItemSkeleton'
import MessageListItem from './MessageListItem'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
        },
    }),
)

function NoMessages() {
    return <div>There's nothing here</div>
}

export function MessageList({ room }: { room: Room }) {

    const lastRef = useRef<HTMLDivElement | null>(null)

    const classes = useStyles()

    const [messages, setMessages] = useState<Message[]>([])
    const room_id = room.id

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(false)
        const firestore = getFirestore()
        const q = query(collection(firestore, `rooms/${room_id}/messages`), orderBy('createTime', 'desc'))
        const unsub = onSnapshot(q, (snapshot) => {
            let messages = snapshot.docs.map((doc) => {
                const data = doc.data()
                return {
                    id: doc.id,
                    ...data
                } as Message
            })
            setMessages(messages)
            setLoaded(true)
            lastRef.current?.scrollIntoView()
        })

        return () => unsub()
    }, [room_id])

    const items = loaded
        ? messages.map((message) => <MessageListItem message={message}/>).reverse()
        : new Array(7).map((_, index) => <MessageListItemSkeleton key={index}/>)
    return (<>
        <List className={classes.root} aria-label='messages'>
            {items.length !== 0 ? items : <NoMessages />}
            <div id='last' key='last' ref={lastRef}/>
        </List>
    </>)
}

