import { Avatar, Typography } from '@mui/material'
import React, { PropsWithChildren, useState } from 'react'
import CardWrapper from './CardWrapper'
import { makeStyles } from '@mui/styles'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { MoreHoriz } from '@mui/icons-material'

const useStyles = makeStyles({
    cardContentRight: {
        marginLeft: 'auto !important',
    },
})

type UpdatePhotoButtonProps = {
    removePhoto: () => void
    updatePhoto: () => void
}

function UpdatePhotoButton(props: UpdatePhotoButtonProps) {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)

    const handleClose = () => {
        setAnchorEl(null)
    }

    const removePhoto = () => {
        props.removePhoto()
        handleClose()
    }

    const updatePhoto = () => {
        props.updatePhoto()
        handleClose()
    }

    return (<>
        <IconButton className={classes.cardContentRight} onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreHoriz/>
        </IconButton>
        <Menu
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
        >
            <MenuItem onClick={removePhoto}>Remove Photo</MenuItem>
            <MenuItem onClick={updatePhoto}>Update Photo</MenuItem>
        </Menu>
    </>)
}


type UpdateImageCardProps = PropsWithChildren<{
    imgSrc?: string
    alt: string,
    title?: string
} & UpdatePhotoButtonProps>

const UpdateImageCard = ({ imgSrc, alt, title, children, updatePhoto, removePhoto }: UpdateImageCardProps) => {
    return (
        <CardWrapper>
            <Avatar src={imgSrc} alt={alt}>{children}</Avatar>
            {title && <Typography variant='h5' component='p'>{title}</Typography>}

            <UpdatePhotoButton updatePhoto={updatePhoto} removePhoto={removePhoto} />
        </CardWrapper>
    )
}

export default UpdateImageCard
