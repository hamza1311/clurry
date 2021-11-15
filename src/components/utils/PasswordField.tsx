import React, { useState } from 'react'
import { FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

type Props = { disabled: boolean, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, className?: string }

function PasswordField(props: Props) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <FormControl disabled={props.disabled} variant='standard' className={props.className}>
            <InputLabel htmlFor='password'>{props.label}</InputLabel>
            <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={props.value}
                onChange={props.onChange}
                endAdornment={
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label='toggle password visibility'
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}

export default PasswordField
