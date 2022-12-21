import { InputAdornment, TextField } from '@material-ui/core';
import * as React from 'react';
import './search-text-field.scss';

export interface SearchTextFieldProps {
    id: string;
    placeholder?: string;
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    onEnterPress?: () => void;
    style?: any;
    onBlur?: () => void;
}

export interface SearchTextFieldState {
    value: string;
    filled: boolean;
    focused: boolean;

    placeholder: string;
    label: string;
}

export default class SearchTextField extends React.Component<SearchTextFieldProps, SearchTextFieldState> {
    private typingWaiting;
    constructor(props) {
        super(props);

        this.state = {
            value: props.value != null ? props.value : '',
            filled: props.value != null ? true : false,
            focused: false,
            placeholder: props.placeholder != null ? props.placeholder : '',
            label: props.placeholder != null ? props.placeholder : props.label != null ? props.label : ''
        };
    }

    private onChangeValue = event => {
        this.setState({
            value: event.target.value,
            filled: event.target.value !== null && event.target.value.length > 0
        });
        if (this.typingWaiting) {
            clearTimeout(this.typingWaiting);
        }
        this.typingWaiting = setTimeout(() => {
            this.typingWaiting = null;
            this.props.onChange(this.state.value);
        }, 500);
    };

    private clickField = () => {
        this.setState({
            label: this.props.placeholder ? this.props.placeholder : ''
        });
    };

    private onFocus = (): void => {
        this.setState({
            focused: true
        });
    };

    private onBlur = (): void => {
        this.setState({
            focused: false
        });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    };

    render() {
        const { style, id } = this.props;
        const { value, label } = this.state;

        return (
            <div style={{ position: 'relative', width: '100%', ...style }}>
                <TextField
                    InputLabelProps={{ shrink:false}}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <div className="search-icon" style={{ color:'#a3a9ab', width: '24px'}}/>
                            </InputAdornment>
                        )
                    }}
                    className={'filled'}
                    id={id}
                    // size={'small'}
                    fullWidth
                    autoComplete="off"
                    value={value}
                    placeholder={label}
                    variant={'filled'}
                    onChange={this.onChangeValue}
                />
            </div>
        );
    }
}
