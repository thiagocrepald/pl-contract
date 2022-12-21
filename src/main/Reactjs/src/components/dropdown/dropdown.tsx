import * as React from 'react';
import './dropdown.scss';

export interface IDropdownProps {
    title: string;
    data: SimpleItem[];
    onClickItem: (value: any) => void;
    style?: any;
    selectedRender?: () => JSX.Element;
    initialValue?: any;
    error?: boolean;
    errorText?: string;
}
export interface IDropdownState {
    isOpen: boolean;
    formattedData: SimpleItem[];
    selected?: boolean;
    selectedItem?: SimpleItem;
    maxHeight?: number;
}
interface SimpleItem {
    label: string;
    value: any;
}
export default class Dropdown extends React.Component<IDropdownProps, IDropdownState> {
    private currentLetter: string = '';
    private dropdownRef;
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            formattedData: props.data,
            selected: props.initialValue ? true : false,
            selectedItem: props.initialValue ? props.data.filter(it => it.value === props.initialValue)[0] : undefined
        };
    }

    componentDidMount(): void {
        this.setHeight(window);
        document.querySelector('div.register-subscription')!.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleWindowResize);
    }
    componentWillReceiveProps(newProps: IDropdownProps): void {
        if (newProps.data !== this.props.data) {
            this.setState({
                formattedData: newProps.data
            });
        }
    }
    componentWillUnmount() {
        document.querySelector('div.register-subscription')!.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleWindowResize);
    }
    private setHeight = (windowParam: any) => {
        const elem = this.dropdownRef;
        if (elem != null) {
            const windowHeight: number = windowParam.innerHeight;
            const distanceFromBottom = windowHeight - elem.getBoundingClientRect().bottom - 20;
            this.setState({
                maxHeight: distanceFromBottom < 600 ? distanceFromBottom : 600
            });
        }
    };
    private handleWindowResize = (e: any): void => {
        this.setHeight(e.target);
    };
    private handleScroll = (e: any): void => {
        console.log('handleScroll', e);
        this.setHeight(window);
    };
    private onClickSelect = (): void => {
        this.setState({
            isOpen: !this.state.isOpen,
            selected: false
        });
    };
    private onClickItem = (item: SimpleItem): void => {
        this.setState({
            isOpen: false,
            selected: true,
            selectedItem: item
        });
        this.props.onClickItem(item.value);
    };

    // Renders
    private renderSectionItem = (item: SimpleItem, hideBorder?: boolean): JSX.Element => {
        return (
            <div className="custom-dropdown__result__item" onClick={() => this.onClickItem(item)}>
                <div className="custom-dropdown__result__item__content" style={hideBorder ? { border: 'none' } : {}}>
                    <p className="custom-dropdown__result__item__title">{item.label}</p>
                </div>
            </div>
        );
    };
    private renderResult = (item: SimpleItem, index: number): JSX.Element => {
        return (
            <div className="custom-dropdown__result" key={index}>
                {this.renderSectionItem(item, index === 0)}
            </div>
        );
    };

    render() {
        const { title, style, selectedRender, error, errorText } = this.props;
        const { isOpen, formattedData, selected, selectedItem, maxHeight } = this.state;
        return (
            <div
                id="custom-dropdown"
                className={`custom-dropdown ${selected ? 'custom-dropdown--validated' : ''}`}
                style={{ ...style, backgroundColor: selected ? '#ffffff' : '' }}
                ref={ref => this.dropdownRef = ref}
            >
                <div className="custom-dropdown__content-container" style={{ backgroundColor: selected ? '#ffffff' : '' }}>
                    {selectedRender && selected ? (
                        selectedRender()
                    ) : selectedItem ? (
                        <div
                            className={`custom-dropdown__select ${isOpen ? 'custom-dropdown__select--open' : ''}`}
                            onClick={this.onClickSelect}
                        >
                            <span className="custom-dropdown__select__text">{selectedItem.label}</span>
                            <div className="custom-dropdown__select__icon" />
                        </div>
                    ) : (
                        <div
                            className={`custom-dropdown__select ${isOpen ? 'custom-dropdown__select--open' : ''}`}
                            onClick={this.onClickSelect}
                        >
                            <span className="custom-dropdown__select__text">{title}</span>
                            <div className="custom-dropdown__select__icon" />
                        </div>
                    )}
                    {isOpen && (
                        <div className="custom-dropdown__content" style={{ maxHeight }}>
                            <div className="custom-dropdown__content__results">
                                {formattedData.map((it, index) => this.renderResult(it, index))}
                            </div>
                        </div>
                    )}
                </div>
                {error && !selected && (
                    <div className="custom-dropdown__error">
                        <span className="custom-dropdown__error__text">{errorText}</span>
                    </div>
                )}
            </div>
        );
    }
}
