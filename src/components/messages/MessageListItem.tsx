import Message from '../../models/Message'
import React, { useEffect, useState } from 'react'
import User from '../../models/User'
import getUser from '../../utils/getUser'
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Timestamp from '../utils/Timestamp'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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

export default function MessageListItem({ message }: { message: Message }) {
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
