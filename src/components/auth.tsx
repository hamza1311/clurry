import React, { useState } from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import { Button, Card, Tabs, Tab, AppBar, Box, Collapse } from '@mui/material'
import LoadingIndicator from './utils/LoadingIndicator'
import PasswordField from './utils/PasswordField'
import { useHistory } from 'react-router'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { Theme } from '@mui/material/styles'

type SigningInOrUp = 'in' | 'up'

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        height: '100vh',
        display: 'flex'
    },
    wrapper: {
        margin: 'auto',
        width: '35vw',
        transition: 'height ease 1s'
    },
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

function SignInOrUp({ inOrUp }: {inOrUp: SigningInOrUp}) {
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

export default function Auth() {
    const classes = useStyles()

    const [value, setValue] = useState(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }

    return <>
        <main className={classes.root}>
            <div className={classes.wrapper}>
                <Card>
                    <AppBar position='static'>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label='auth tabs'
                            variant='fullWidth'
                            textColor='inherit'
                            centered
                        >
                            <Tab label='Sign In'/>
                            <Tab label='Sign Up'/>
                        </Tabs>
                    </AppBar>
                    <Box p={3}>
                        <SignInOrUp inOrUp={value === 0 ? 'in' : 'up'}/>
                    </Box>
                </Card>
            </div>
        </main>
    </>
}
