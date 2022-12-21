import MomentUtils from '@date-io/moment';
import { DatePickerView, KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import classNames from 'classnames';
import { Moment } from 'moment';
import { ptBr } from 'moment/locale/pt-br';
import React from 'react';
import { APP_LOCAL_DATE_FORMAT } from '../../util/constants';
import '../custom-text-field/custom-text-field.scss';
import './custom-date-field.scss';

interface ICustomDateFieldProps {
    id?: string;
    error?: boolean;
    helpText?: string;
    isDialog?: boolean;
    errorText?: string;
    className?: string;
    isStatic?: boolean;
    value: ParsableDate;
    onBlur?: () => void;
    isDisabled?: boolean;
    placeholder?: string;
    disablePast?: boolean;
    disableFuture?: boolean;
    disableToolbar?: boolean;
    onFocus?: (id?: string) => void;
    minDate?: string | Date | Moment;
    maxDate?: string | Date | Moment;
    callbackRef?: (ref: object) => void;
    disableErrorAndValidStyle?: boolean;
    onChange: (date: MaterialUiPickersDate | null, value?: string | null) => void;
    label?: string;
    shouldDisableDate?: () => boolean;
    clearable?: boolean;
    format?: string;
    views?: DatePickerView[];
}

interface ICustomDateFieldState {
    isFocused: boolean;
    temporaryHide: boolean;
}

class CustomDateField extends React.Component<ICustomDateFieldProps, ICustomDateFieldState> {
    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            temporaryHide: false
        };
    }

    componentDidMount() {
        this.props.callbackRef && this.props.callbackRef(this);
    }

    temporaryHide = () => {
        this.setState({
            temporaryHide: true
        }, () => {
            this.setState({
                temporaryHide: false
            });
        });
    };

    onFocus = () => {
        const { onFocus, id } = this.props;
        this.setState({
            isFocused: true
        }, () => onFocus && onFocus(id));
    };

    onBlur = () => {
        this.temporaryHide();
        this.setState({
            isFocused: false
        }, () => {
            this.props.onBlur && this.props.onBlur();
        });
    };

    renderCalendarIcon = () => {
        return (
            <i className={'icon-calendario'} />
        );
    };

    render() {
        const { isFocused, temporaryHide } = this.state;
        const { value, className, disableFuture, isDisabled, error, isStatic, maxDate, minDate, onChange,
            errorText, helpText, placeholder, id, disableErrorAndValidStyle, disablePast, isDialog, disableToolbar, label, shouldDisableDate, clearable, format, views } = this.props;

        const hasError = error && !isFocused;
        const errorClassName = error && !isFocused && !disableErrorAndValidStyle ? 'on-error' : '';
        const validClassName = value && !isFocused && !disableErrorAndValidStyle ? 'on-valid' : '';

        return (
            <MuiPickersUtilsProvider utils={MomentUtils} locale={ptBr}>
                <div className={classNames([className, 'custom-date-field-wrapper'])}>
                    <div className={classNames([errorClassName, validClassName, 'custom-date-field-wrap'])}>
                        {!temporaryHide && (
                            <KeyboardDatePicker
                                autoOk
                                id={id}
                                open={isFocused}
                                error={hasError}
                                margin={'normal'}
                                minDate={minDate}
                                maxDate={maxDate}
                                onChange={onChange}
                                disabled={isDisabled}
                                value={value || null}
                                onClose={this.onBlur}
                                onOpen={this.onFocus}
                                onFocus={this.onFocus}
                                onClick={this.onFocus}
                                placeholder={placeholder}
                                disablePast={disablePast}
                                disableFuture={disableFuture}
                                format={format ?? APP_LOCAL_DATE_FORMAT}
                                disableToolbar={disableToolbar}
                                onKeyDown={e => e.preventDefault()}
                                InputProps={{ disableUnderline: true }}
                                KeyboardButtonProps={{ 'aria-label': 'change date' }}
                                variant={isStatic ? 'static' : isDialog ? 'dialog' : 'inline'}
                                label={label}
                                shouldDisableDate={shouldDisableDate}
                                clearable={clearable}
                                views={views}
                            />
                        )}
                    </div>
                    {error && errorText != null && !isFocused && (
                        <div className={'error-label'}>
                            <span>{errorText}</span>
                        </div>
                    )}
                    {helpText && !hasError && isFocused && (
                        <div className={'helpText'}>{helpText}</div>
                    )}
                </div>
            </MuiPickersUtilsProvider>
        );
    }
}

export default CustomDateField;
