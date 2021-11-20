import { TextField } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import React from 'react'
import { useInputStyles } from '../../messages/CreateMessage'

export default function CreateMessageSkeleton() {
    const classes = useInputStyles()

    return (
        <div className={classes.container}>
            <TextField multiline maxRows={5} className={classes.input} disabled={true} />
            <IconButton disabled={true}>
                <SendIcon/>
            </IconButton>
        </div>
    )
}
