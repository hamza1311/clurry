import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import React, { useEffect, useRef, useState } from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Room from '../models/Room'
import Message from '../models/Message'
import { Skeleton } from '@mui/lab'
import User from '../models/User'
import Timestamp from './utils/Timestamp'
import getUser from '../utils/getUser'
import { collection, getFirestore, onSnapshot, query, orderBy } from 'firebase/firestore'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
        },
        messageContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        messageHeader: {
            display: 'flex',
            gap: theme.spacing(2)
        },
        timeContainer: {
            alignSelf: 'flex-end'
        }
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
        : new Array(7).fill(<MessageListItemSkeleton/>)
    return (<>
        <List className={classes.root} aria-label='messages'>
            {items.length !== 0 ? items : <NoMessages />}
            <div id='last' ref={lastRef}/>
        </List>
    </>)
}

function MessageListItem({ message }: { message: Message }) {
    const classes = useStyles()

    const [author, setAuthor] = useState<User | null>(null)

    useEffect(() => {
        getUser(message.author).then((it) => setAuthor(it ?? null))
    }, [message.author])

    return (
        <ListItem key={message.id}>
            <ListItemAvatar>
                <Avatar
                    src={author?.profilePicture ?? ''}
                />
            </ListItemAvatar>
            <ListItemText disableTypography={true}>
                <section className={classes.messageContainer}>
                    <div className={classes.messageHeader}>
                        <Typography variant='subtitle1'>{author?.displayName}</Typography>
                        <span className={classes.timeContainer}>
                                <Typography variant='subtitle2'>
                                    <Timestamp timestamp={message.createTime.toDate()}/>
                                </Typography>
                            </span>
                    </div>
                    <Typography variant='body1'>
                        {message.content}
                    </Typography>
                </section>
            </ListItemText>
        </ListItem>
    )
}

const useSkeletonStyles = makeStyles((theme: Theme) =>
    createStyles({
        outerContainer: {
            display: 'flex',
            gap: theme.spacing(2),
            padding: theme.spacing(2),
        },
        contentContainer: {
            width: '100%'
        }
    })
)

export function MessageListItemSkeleton() {
    const classes = useSkeletonStyles()

    return <div className={classes.outerContainer}>
        <Skeleton variant='circular' width={45} height={40}/>
        <div className={classes.contentContainer}>
            <Skeleton variant='text' width='30%'/>
            <Skeleton variant='text'/>
        </div>
    </div>
}
