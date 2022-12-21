import { FormControl, InputLabel, Select } from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import '../custom-text-field/custom-text-field.scss';
import './select-field.scss';

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectFieldProps {
    id?: string;
    style?: any;
    error?: boolean;
    selected: boolean;
    className?: string;
    errorText?: string;
    firstValue?: string;
    firstLabel?: string;
    placeholder?: string;
    isDisabled?: boolean;
    initialValue?: string;
    inputPlaceholder?: string;
    dataArray: SelectOption[];
    onBlur?: (value?: any) => void;
    onChange: (value: any) => void;
    onFocus?: (id?: string) => void;
}

export interface SelectFieldState {
    error: boolean;
    isOpen: boolean;
    filled: boolean;
    focused: boolean;
    selected: boolean;
    placeholder?: string;
}

export default class SelectField extends React.Component<SelectFieldProps, SelectFieldState> {
    constructor(props: SelectFieldProps) {
        super(props);
        this.state = {
            isOpen: false,
            focused: false,
            filled: props.selected,
            selected: this.props.selected,
            placeholder: this.props.placeholder ?? '',
            error: props.error != null ? props.error : false,
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    componentWillReceiveProps(nextProps: Readonly<SelectFieldProps>) {
        if (this.state.error !== nextProps.error) {
            this.setState({
                error: nextProps.error != null ? nextProps.error : false
            });
        }
    }

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!this.props.isDisabled && this.props.selected && (!domNode || !domNode.contains(event.target))) {
            this.setState({
                filled: this.props.selected != null,
                error: this.props.error ? this.props.error : false
            });
        }
    };

    private onFocus = (): void => {
        const { onFocus, id } = this.props;
        this.setState({
            focused: true
        }, () => onFocus && onFocus(id));
    };

    private onBlur = (): void => {
        this.setState({
            focused: false
        });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    callOnChange = (event: { target: { value: unknown } }) => {
        this.props.onChange(event.target.value);
    };

    isOpen = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    renderIcon = (props: any) => {
        return (
            <img
                {...props}
                alt={''}
                onClick={this.isOpen}
                className={`select-icn ${props.className}`}
                src={require('../../assets/img/svg/check.svg')}
            />
        );
    };

    render() {
        const { error, filled, focused, isOpen } = this.state;
        const { style, initialValue, className, errorText, id, inputPlaceholder, dataArray, placeholder, isDisabled, firstValue, firstLabel } = this.props;

        const hasError = error && !focused;
        const isValid = !error && filled && !focused;
        const didNotValidated = filled && (error == null || !focused);

        return (
            <FormControl
                variant="filled"
                fullWidth
                style={style}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                className={
                    classNames(
                        [className,
                            hasError
                                ? 'error filled MuiFilledInput-underline'
                                :  isValid
                                ? 'filled validate'
                                : didNotValidated
                                    ? 'filled'
                                    : 'action'])
                }>
                <InputLabel htmlFor={id}>{placeholder}</InputLabel>
                <Select
                    native
                    id={id}
                    fullWidth
                    open={isOpen}
                    error={error}
                    disabled={isDisabled}
                    onChange={this.callOnChange}
                    placeholder={inputPlaceholder}
                    IconComponent={this.renderIcon}
                    inputProps={{ name: placeholder, id: id }}
                    value={initialValue != null ? initialValue : undefined}
                >
                    <option value={firstValue} label={firstLabel} hidden />
                    {dataArray.map((data, index) => {
                        return <option key={index} value={data.value}>{data.label}</option>;
                    })}
                </Select>
                {error && errorText != null && !focused && (
                    <div className={'error-label'}>
                        <span>{errorText}</span>
                    </div>
                )}
            </FormControl>
        );
    }
}
