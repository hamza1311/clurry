import { Box, CircularProgress, IconButton, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material'
import CardWrapper from './CardWrapper'

const useStyles = makeStyles(() => createStyles({
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    separator: {
        flex: '1'
    }
}))

type EditOrSaveButtonProps = {
    isEditing: boolean
    onSaveClick: () => Promise<void>
    setIsEditing: (value: boolean) => void
}

const EditOrSaveButton = (props: EditOrSaveButtonProps) => {
    const [isSaving, setIsSaving] = useState(false)

    const onSaveClick = async () => {
        setIsSaving(true)
        await props.onSaveClick()
        setIsSaving(false)
    }

    if (isSaving) {
        return <CircularProgress color='secondary'/>
    } else {
        if (props.isEditing) {
            return <IconButton onClick={onSaveClick}><SaveIcon/></IconButton>
        } else {
            return <IconButton onClick={() => props.setIsEditing(true)}><EditIcon/></IconButton>
        }
    }
}

type EditableInfoCardProps = {
    label: string
    currentValue: string
    onSave: (newValue: string) => Promise<void>
}

export const EditableInfoCard = (props: EditableInfoCardProps) => {
    const classes = useStyles()
    const [isEditing, setIsEditing] = useState(false)

    const newValueRef = useRef<{ value: string }>()

    const onSaveClick = async () => {
        await props.onSave(newValueRef.current!!.value)
        setIsEditing(false)
    }

    const content = (
        <Box className={classes.contentContainer}>
            <Typography variant='h6' component='h4'>{props.label}</Typography>
            <Typography variant='body1' component='p'>{props.currentValue}</Typography>
        </Box>
    )

    const contentWhileEditing = (
        <TextField
            label={props.label}
            inputRef={newValueRef}
        />
    )

    return (
        <CardWrapper>
            {isEditing ? contentWhileEditing : content}
            <Box className={classes.separator} />
            <EditOrSaveButton isEditing={isEditing} onSaveClick={onSaveClick} setIsEditing={setIsEditing} />
        </CardWrapper>
    )
}
