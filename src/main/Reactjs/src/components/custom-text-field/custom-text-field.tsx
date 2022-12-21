import { Grid, InputAdornment, TextField } from '@material-ui/core';
import classNames from 'classnames';
import * as React from 'react';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import ReactInputMask from 'react-input-mask';
import StringUtils from '../../../src/util/string-utils';
import './custom-text-field.scss';

export interface TextFieldProps {
    id: string;
    style?: any;
    mask?: string;
    label?: string;
    value?: string;
    error?: boolean;
    isDate?: boolean;
    InputProps?: any;
    isEmail?: boolean;
    helpText?: string;
    dir?: string;
    className?: string;
    errorText?: string;
    onBlur?: () => void;
    isDisabled?: boolean;
    isPassword?: boolean;
    placeholder?: string;
    isOnlyNumbers?: boolean;
    isAlternative?: boolean;
    isDefaultSyntax?: boolean;
    onEnterPress?: () => void;
    inputPlaceholder?: string;
    onBackspacePress?: () => void;
    onFocus?: (event: string) => void;
    filledFocusedInputProps?: boolean;
    onChange: (value: string) => void;
    onError?: (value: boolean) => void;
    callbackRef?: (ref: object) => void;
    leftIcon?: JSX.Element | JSX.Element[] | any;
}

export interface TextFieldState {
    label: string;
    error: boolean;
    filled: boolean;
    focused: boolean;
    placeholder: string;
}

export default class CustomTextField extends React.Component<TextFieldProps, TextFieldState> {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            error: props.error != null ? props.error : false,
            filled: props.value != null && !props.isDefaultSyntax,
            placeholder: props.placeholder != null ? props.placeholder : '',
            label: props.placeholder != null ? props.placeholder : props.label != null ? props.label : ''
        };
    }

    componentDidMount() {
        this.props.callbackRef && this.props.callbackRef(this);
        document.addEventListener('click', this.handleClickOutside, true);
        if(this.props.value != null && this.props.value !== '') {
            this.setState({
                focused: true,
                label: this.props.placeholder ? this.props.placeholder : ''
            })
        }
    }

    componentWillReceiveProps(newProps: TextFieldProps) {
        if(newProps.value != null && newProps.value !== '') {
            this.setState({
                focused: true,
                label: this.props.placeholder ? this.props.placeholder : ''
            })
        }
        if (this.state.error !== newProps.error) {
            this.setState({
                error: newProps.error != null ? newProps.error : false
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    resetAll = () => {
        const { value, error, placeholder, label } = this.props;
        this.setState({
            focused: false,
            filled: value != null,
            error: error != null ? error : false,
            placeholder: placeholder != null ? placeholder : '',
            label: placeholder != null ? placeholder : label != null ? label : ''
        });
    };

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!this.props.isDisabled && !this.props.isDefaultSyntax) {
            if (
                (!domNode || !domNode.contains(event.target)) &&
                this.state.label !== this.props.label &&
                (this.props.value === null || this.props.value === '')
            ) {
                this.setState({
                    label: this.props.label ? this.props.label : ''
                });
            } else if (!domNode || !domNode.contains(event.target)) {
                this.setState({
                    error: this.props.error ? this.props.error : false,
                    filled: this.props.value != null && this.props.value.length > 0
                });
            }
        }
    };

    private onChangeValue = event => {
        this.setState({
            filled: event.target.value !== null && event.target.value.length > 0
        });
        if (this.props.onChange) {
            this.props.onChange(StringUtils.isStringEmpty(this.props.mask)
                ? this.props.isOnlyNumbers
                    ? this.removeNonNumbersFromMaskedValue(event.target.value)
                    : event.target.value
                : this.maskedValueFix(event.target.value));
        }
    };

    private clickField = () => {
        this.setState({
            label: this.props.placeholder ? this.props.placeholder : ''
        });
    };

    private onKeyPress = event => {
        if ((event.which === 13 || event.keyCode === 13) && this.props.onEnterPress) {
            this.props.onEnterPress();
            return false;
        }
        return true;
    };

    private onKeyDownCapture = event => {
        if (event.which === 9 || event.keyCode === 9) {
            if (this.state.label !== this.props.label && (this.props.value === null || this.props.value === '')) {
                this.setState({
                    label: this.props.label ? this.props.label : ''
                });
            }
            return false;
        }

        if (((event.which === 8 || event.which === 46) || (event.keyCode === 8 || event.keyCode === 46)) && this.props.onBackspacePress) {
            this.props.onBackspacePress();
            return false;
        }

        return true;
    };

    private onFocus = (): void => {
        const { onFocus, id } = this.props;
        this.setState({
            focused: true
        }, () => onFocus && onFocus(id));
        this.setState({
            label: this.props.placeholder ? this.props.placeholder : ''
        });
    }

    private onBlur = (): void => {
        this.setState({
            focused: false
        });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
        this.setState({
            label: this.props.placeholder ? this.props.placeholder : ''
        });
    }

    inputPropsDefault = () => {
        const { error } = this.props;
        const { filled, focused } = this.state;

        const isValid = error === false && filled && !focused;
        const isFilledValid = filled && isValid;

        const defaultAdornment = {
            endAdornment: (
                <InputAdornment position="end">
                    <div className="check-icn" />
                </InputAdornment>
            )
        };

        return isFilledValid ? defaultAdornment : {};
    };

    getFilledAndFocused = () => {
        return [this.state.filled, this.state.focused];
    };

    filledFocusedInputPropsInputProps = () => {
        return this.props.InputProps(this.getFilledAndFocused());
    }

    maskedValueFix = (value: string) => {
        const { mask } = this.props;
        const maskMaxSize = this.removeNonNumbersFromMaskedValue(mask!).length;
        value = this.removeNonNumbersFromMaskedValue(value);
        value = this.setMaskedValueMaxSize(value, maskMaxSize);
        return value;
    };

    setMaskedValueMaxSize = (value: string, maxSize: number) => {
        value = value.length > maxSize ? value.substring(0, maxSize) : value;
        return value;
    };

    removeNonNumbersFromMaskedValue = (value: string) => {
        return value.replace(/[^\d]/g, '');
    };

    renderCustomerMaskedField = () => {
        const { value, placeholder, mask } = this.props;
        return (
            <ReactInputMask
                mask={mask!}
                maskChar={null}
                value={value || ''}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                placeholder={placeholder}
                onChange={this.onChangeValue}
            >
                {(inputProps) => this.renderTextField(inputProps)}
            </ReactInputMask>
        );
    };

    renderTextField = (inputProps?: any) => {
        const { filled, focused, label, placeholder } = this.state;
        const { isPassword, error, errorText, id, value, InputProps,
            filledFocusedInputProps, isDisabled, isDate, dir } = this.props;

        const hasError = error === true && !focused;
        const isValid = error === false && filled && !focused;
        const didNotValidated = filled && (error == null || !focused);

        const labelSizeClassName = `MuiFormControl-root label-size-${label.length} floating-label`;

        const statusClassName = hasError
            ? 'error filled MuiFilledInput-underline'
            :  isValid
                ? 'filled validate'
                : didNotValidated
                    ? 'filled'
                    : 'action';

        return (
            <TextField
                {...inputProps}
                id={id}
                dir={dir}
                fullWidth
                label={label}
                error={hasError}
                variant={'filled'}
                value={value || ''}
                autoComplete={'off'}
                onBlur={this.onBlur}
                disabled={isDisabled}
                onFocus={this.onFocus}
                onClick={this.clickField}
                onKeyPress={this.onKeyPress}
                onChange={this.onChangeValue}
                placeholder={placeholder}
                onKeyDownCapture={this.onKeyDownCapture}
                helperText={errorText && hasError ? errorText : null}
                type={isPassword ? 'password' : isDate ? 'date' : 'text'}
                className={classNames([labelSizeClassName, statusClassName])}
                InputProps={filledFocusedInputProps ? this.filledFocusedInputPropsInputProps() : (InputProps || this.inputPropsDefault())}
            />
        )  ;
    };

    renderWithLeftIcon = () => {
        const { leftIcon } = this.props;
        return (
            <Grid container spacing={1} alignItems={'flex-start'}>
                <Grid item style={{ paddingRight: 'unset' }}>
                    <div className={'grid-left-icon-wrapper'}>
                        {leftIcon}
                    </div>
                </Grid>
                <Grid item lg className={'grid-left-icon-wrapper-complement'} style={{ paddingLeft: 'unset' }}>
                    {this.renderComponent()}
                </Grid>
            </Grid>
        );
    };

    renderComponent = () => {
        const { focused } = this.state;
        const { error, helpText, mask } = this.props;
        const hasError = error === true && !focused;
        return (
            <Fragment>
                {StringUtils.isStringEmpty(mask) ? this.renderTextField() : this.renderCustomerMaskedField()}
                {helpText && !hasError && focused ? (
                    <div className="helpText">{helpText}</div>
                ) : (
                    <div className="blankHelpText" />
                )}
            </Fragment>
        );
    };

    render() {
        const { style, className, leftIcon } = this.props;
        return (
            <div className={className} style={{ position: 'relative', width: '100%', ...style }}>
                {leftIcon ? this.renderWithLeftIcon() : this.renderComponent()}
            </div>
        );
    }
}