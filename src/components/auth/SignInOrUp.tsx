import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import TextField from '@mui/material/TextField'
import PasswordField from '../utils/PasswordField'
import { Button, Collapse } from '@mui/material'
import LoadingIndicator from '../utils/LoadingIndicator'
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore'

type SigningInOrUp = 'in' | 'up'

const useStyles = makeStyles((theme: Theme) => createStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(4),
        padding: theme.spacing(5),
    },
    fullWidthField: {
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
    const [displayName, setDisplayName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [signingUp, setSigningUp] = useState(false)

    const classes = useStyles()
    const router = useHistory()
    const firestore = getFirestore()

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
            const { user } = await createUserWithEmailAndPassword(auth, email, password)
            const docRef = doc(collection(firestore, 'users'), user.uid)
            const userDoc = {
                displayName,
                email: user.email,
                profilePicture: null
            }
            await updateProfile(user, { displayName })
            await setDoc(docRef, userDoc)
            setSigningUp(false)
            router.push('/')
        } else {
            alert('password mismatch')
        }
    }

    const form = (
        <form className={classes.form} noValidate autoComplete='off'>
            <Collapse in={inOrUp === 'up'} timeout='auto' unmountOnExit>
                <TextField
                    label='Display name'
                    variant='standard'
                    type='text'
                    className={classes.fullWidthField}
                    disabled={signingUp}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
            </Collapse>

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
                    className={classes.fullWidthField}
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
