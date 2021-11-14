import React, {useState} from "react";
import {FormControl, IconButton, Input, InputAdornment, InputLabel} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";

function PasswordField(props: { disabled: boolean, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <FormControl disabled={props.disabled}>
            <InputLabel htmlFor="password">{props.label}</InputLabel>
            <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={props.value}
                onChange={props.onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
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
