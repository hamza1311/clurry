import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import TextField from '@mui/material/TextField'
import PasswordField from '../utils/PasswordField'
import { Button, Collapse } from '@mui/material'
import LoadingIndicator from '../utils/LoadingIndicator'

type SigningInOrUp = 'in' | 'up'

const useStyles = makeStyles((theme: Theme) => createStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(4),
        padding: theme.spacing(3),
    },
    confirmPasswordField: {
        width: 'inherit'
    },
    signinOrUpButton: {
        width: 'max-content',
        alignSelf: 'center'
    }
}))

export default function SignInOrUp({ inOrUp }: { inOrUp: SigningInOrUp }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [signingUp, setSigningUp] = useState(false)

    const classes = useStyles()
    const router = useHistory()

    const auth = getAuth()

    const signIn = async () => {
        setSigningUp(true)
        await signInWithEmailAndPassword(auth, email, password)
        setSigningUp(false)
        router.push('/')
    }


    const signUp = async () => {
        setSigningUp(true)
        if (password === confirmPassword) {
            await createUserWithEmailAndPassword(auth, email, password)
            setSigningUp(false)
            router.push('/')
        } else {
            alert('password mismatch')
        }
    }

    const form = (
        <form className={classes.form} noValidate autoComplete='off'>
            <TextField
                label='Email'
                variant='standard'
                type='email'
                onChange={(e) => setEmail(e.target.value)}
                disabled={signingUp}
            />

            <PasswordField
                disabled={signingUp}
                value={password}
                label='Password'
                onChange={(e) => setPassword(e.target.value)}
            />

            <Collapse in={inOrUp === 'up'} timeout='auto' unmountOnExit>
                <PasswordField
                    disabled={signingUp}
                    value={confirmPassword}
                    label='Confirm Password'
                    className={classes.confirmPasswordField}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Collapse>

            <Button
                onClick={inOrUp === 'up' ? signUp : signIn}
                variant='contained'
                className={classes.signinOrUpButton}
                disabled={signingUp}>{inOrUp === 'up' ? 'Sign Up' : 'Sign In'}</Button>
        </form>
    )

    return (
        <>
            <LoadingIndicator isVisible={signingUp}/>
            {form}
        </>
    )
}
