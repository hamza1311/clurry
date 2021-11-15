import React, { useState } from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Card, Tabs, Tab, AppBar, Box } from '@mui/material'
import SignInOrUp from './SignInOrUp'

const useStyles = makeStyles(() => createStyles({
    root: {
        height: '100vh',
        display: 'flex'
    },
    wrapper: {
        margin: 'auto',
        width: '35vw',
        transition: 'height ease 1s'
    },
}))

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
