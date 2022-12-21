import classNames from 'classnames';
import React from 'react';
import './radio-selection.scss';
import ArrayUtils from '../../util/array-utils';

interface IRadioSelectionProps<T> {
    id?: string;
    isColumn?: boolean;
    isCircle?: boolean;
    selectedOptions?: T[];
    error?: any;
    useSelectedProps?: boolean;
    onClick?: (event: T) => void;
    options: any[];
    onFocus?: (id?: string) => void;
    onChange: (event: T[], eventChanged: T, isRemoved: boolean) => void;
}

interface IRadioSelectionState {
    selectedOptions: any[];
}

class RadioSelection<T> extends React.Component<IRadioSelectionProps<T>, IRadioSelectionState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: []
        };
    }

    componentWillReceiveProps(nextProps: Readonly<IRadioSelectionProps<T>>) {
        const selectedOptions = nextProps.selectedOptions ?? [];
        if (!ArrayUtils.isEqual(selectedOptions, this.state.selectedOptions)) {
            this.setState({
                selectedOptions
            });
        }
    }

    updateSelectedOption = (selectedOption: any) => {
        const selectedOptions = [...this.state.selectedOptions];
        const containsItemIndex = selectedOptions.findIndex(item => item === selectedOption);

        if (containsItemIndex !== -1) {
            selectedOptions.splice(containsItemIndex, 1);
        } else {
            selectedOptions.push(selectedOption);
        }

        this.setState({
            selectedOptions
        }, () => this.props.onChange(this.state.selectedOptions, selectedOption, containsItemIndex !== -1));
    };

    onFocus = () => {
        const { onFocus, id } = this.props;
        if (onFocus) onFocus(id);
    };

    renderItem = (item: any, index: number) => {
        const { selectedOptions } = this.state;
        const { isColumn, options, isCircle, id, onClick, useSelectedProps } = this.props;

        const useSelectedPropsOptions = useSelectedProps ? this.props.selectedOptions : selectedOptions;

        const containsItem = () => useSelectedPropsOptions?.findIndex(selectedOption => selectedOption === item.value) !== -1;

        const imageSelection = containsItem() ? 'ok' : 'pending';
        const circleImageSelection = containsItem() ? 'radio-on' : 'radio-off';
        const isLastChildColumn = isColumn && index === options.length - 1 ? 'is-last-item' : '';

        const onClickAction = onClick != null ? () => onClick(item.value) : () => void(0);

        return (
            <div id={id} key={index} className={classNames([isLastChildColumn, 'radio-selection-item'])}>
                <img
                    alt={''}
                    onClick={() => this.updateSelectedOption(item.value)}
                    src={require(`../../assets/img/radio-selection/${isCircle ? circleImageSelection : imageSelection}.svg`)}
                />
                <input onFocus={this.onFocus} />
                <span style={{ cursor: 'pointer' }} onClick={onClickAction}>
                    {item.label}
                </span>
            </div>
        );
    };

    renderError = () => {
        const { error } = this.props;
        return (
            <div className={'radio-selection-error'}>
                <span>{error?.message || ''}</span>
            </div>
        );
    };

    render() {
        const { options, error, isColumn } = this.props;
        const isColumnClassName = isColumn ? 'is-column' : '';
        return (
            <div className={classNames([isColumnClassName, 'radio-selection-wrapper'])}>
                {options.map((item, index) => this.renderItem(item, index))}
                {error?.value && this.renderError()}
            </div>
        );
    }
}

export default RadioSelection;
