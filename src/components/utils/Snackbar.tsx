import { IconButton, SnackbarCloseReason } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

function SimpleSnackbar(props: {
    message: string,
    action: React.ReactNode
    open: boolean
    setOpen: (value: boolean) => void
    onSnackbarClose: (reason: SnackbarCloseReason) => void
}) {

    const closeSnackbar = () => {
        props.setOpen(false)
    }

    const onSnackbarClose = (e: React.SyntheticEvent<any>, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return
        }

        props.onSnackbarClose(reason)
        closeSnackbar()
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={props.open}
                autoHideDuration={4000}
                onClose={onSnackbarClose}
                message={props.message}
                action={<>
                    {props.action}

                    <IconButton size='small' aria-label='close' color='inherit' onClick={closeSnackbar}>
                        <CloseIcon fontSize='small'/>
                    </IconButton>
                </>}
            />
        </div>
    )
}

SimpleSnackbar.defaultProps = {
    action: <></>,
    onSnackbarClose: () => {}
}

export default SimpleSnackbar
