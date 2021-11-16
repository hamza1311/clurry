import Message from '../../models/Message'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import User from '../../models/User'
import getUser from '../../utils/getUser'
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Timestamp from '../utils/Timestamp'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import Markdown from 'markdown-it'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            alignSelf: 'flex-start',
            paddingTop: theme.spacing(1),
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
        },
        contentContainer: {
            margin: `${theme.spacing( -0.9, 0)} !important`
        },
    }),
)

export default function MessageListItem({ message }: { message: Message }) {
    const classes = useStyles()

    const [author, setAuthor] = useState<User | null>(null)

    useEffect(() => {
        getUser(message.author).then((it) => setAuthor(it ?? null))
    }, [message.author])

    const markdown = useMemo(() => {
        return new Markdown('commonmark', {
            html: false,
            linkify: true,
            xhtmlOut: true,
            breaks: true,
        }).disable(['image', 'heading'])
    }, [])
    const messageContent = markdown.render(message.content)
    const contentContainerRef = useRef<HTMLSpanElement | null>(null)
    useEffect(() => {
        if (contentContainerRef.current !== null) {
            contentContainerRef.current.innerHTML = messageContent
        }
    }, [messageContent])
    return (
        <ListItem key={message.id}>
            <ListItemAvatar className={classes.avatar}>
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
                    <Typography variant='body1' ref={contentContainerRef} className={classes.contentContainer}/>
                </section>
            </ListItemText>
        </ListItem>
    )
}
