import _ from 'lodash';
import * as React from 'react';
import './dropdown-search.scss';

export interface IDropdownSearchProps {
    title: string;
    data: any[];
    getData: (value: string) => void;
    onClickItem: (item: any) => void;
    style?: any;
    notAlphabeticalOrder?: boolean;
    selectedRender?: () => JSX.Element;
    close?: boolean;
    onOpen?: () => void;
}
export interface IDropdownSearchState {
    isOpen: boolean;
    formattedData: any[];
    selected?: boolean;
    canShowNoResults?: boolean;
    maxHeight?: number;
}

export default class DropdownSearch extends React.Component<IDropdownSearchProps, IDropdownSearchState> {
    private currentLetter: string = '';
    private dropdownSearchRef;
    constructor(props) {
        super(props);
      this.state = {
            isOpen: false,
            formattedData: props.notAlphabeticalOrder ? props.data : this.mapData(props.data),
            selected: props.selectedRender ? true : false
        };
    }
    private mapData = (data: any[]): any[] => _.orderBy(data, ['name'], ['asc']);

    componentDidMount(): void {
        this.setHeight(window);
        if (document.querySelector('div.register-subscription')) {
            document.querySelector('div.register-subscription')!.addEventListener('scroll', this.handleScroll);
        } else {
            document.querySelector('div.page-container')!.addEventListener('scroll', this.handleScroll);
        }
        window.addEventListener('resize', this.handleWindowResize);
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillReceiveProps(newProps: IDropdownSearchProps): void {
        if (newProps.data !== this.props.data) {
            this.setState({
                formattedData: newProps.notAlphabeticalOrder ? newProps.data : this.mapData(newProps.data),
                canShowNoResults: newProps.data.length === 0
            });
        }
        if (newProps.close !== this.props.close && newProps.close) {
            this.setState({
                isOpen: false
            });
        }
    }
    componentWillUnmount() {
        if (document.querySelector('div.register-subscription')) {
            document.querySelector('div.register-subscription')!.removeEventListener('scroll', this.handleScroll);
        } else {
            document.querySelector('div.page-container')!.removeEventListener('scroll', this.handleScroll);
        }        
        window.removeEventListener('resize', this.handleWindowResize);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    private handleClickOutside = event => {
        if (this.dropdownSearchRef && !this.dropdownSearchRef.contains(event.target)) {
            this.setState({
                isOpen: false
            });
        }
    };
    private setHeight = (windowParam: any) => {
        const elem = this.dropdownSearchRef;
        if (elem != null) {
            const windowHeight: number = windowParam.innerHeight;
            const distanceFromBottom = windowHeight - elem.getBoundingClientRect().bottom - 20;
            this.setState({
                maxHeight: distanceFromBottom < 600 ? distanceFromBottom : 600
            });
        }
    }
    private handleWindowResize = (e: any): void => {
        this.setHeight(e.target);
    }
    private handleScroll = (e: any): void => {
        this.setHeight(window);
    }
    private onClickSelect = (): void => {
        this.setState({
            isOpen: !this.state.isOpen,
            selected: false
        });
        if (!this.state.isOpen === true && this.props.onOpen) {
            this.props.onOpen();
        }
    };
    private onInputChange = (event): void => {
        const { value } = event.target;
        if (value && value.length >= 3) {
            this.props.getData(value);
        }
    };
    private onClickItem = (item: any): void => {
        this.setState({
            isOpen: false,
            selected: true
        });
        this.props.onClickItem(item);
    };

    // Renders
    private renderSectionTitle = (letter: string): JSX.Element => {
        return (
            <div className="dropdown-search__result__section">
                <span className="dropdown-search__result__section__title">{letter.toUpperCase()}</span>
            </div>
        );
    };
    private renderSectionItem = (item: any, hideBorder?: boolean): JSX.Element => {
        return (
            <div className="dropdown-search__result__item" onClick={() => this.onClickItem(item)}>
                <div className="dropdown-search__result__item__content" style={hideBorder ? { border: 'none' } : {}}>
                    <p className="dropdown-search__result__item__title">{item.name}</p>
                    {item.composition && <p className="dropdown-search__result__item__subtitle">{item.composition}</p>}
                </div>
            </div>
        );
    };
    private renderResult = (item: any, index: number): JSX.Element => {
        const letter: string = (item.name as string).substr(0, 1);
        if (letter !== this.currentLetter && !this.props.notAlphabeticalOrder) {
            this.currentLetter = letter;
            return (
                <div className="dropdown-search__result" key={index}>
                    {this.renderSectionTitle(letter)}
                    {this.renderSectionItem(item, true)}
                </div>
            );
        }
        return (
            <div className="dropdown-search__result" key={index}>
                {this.renderSectionItem(item)}
            </div>
        );
    };

    render() {
        const { title, style, selectedRender } = this.props;
        const { isOpen, formattedData, selected, canShowNoResults, maxHeight } = this.state;
        return (
            <div id="dropdown-search" className="dropdown-search" style={style} ref={ref => this.dropdownSearchRef = ref}>
                {selectedRender && selected ? (
                    selectedRender()
                ) : (
                    <div
                        className={`dropdown-search__select ${isOpen ? 'dropdown-search__select--open' : ''}`}
                        onClick={this.onClickSelect}
                    >
                        <span className="dropdown-search__select__text">{title}</span>
                        <div className="dropdown-search__select__icon" />
                    </div>
                )}
                {isOpen && (
                    <div className="dropdown-search__content" style={{ maxHeight }}>
                        <div className="dropdown-search__content__search">
                            <div className="dropdown-search__content__search__icon" />
                            <input
                                className="dropdown-search__content__search__input"
                                placeholder={'Digite o nome'}
                                onChange={this.onInputChange}
                                autoFocus
                            />
                        </div>
                        {canShowNoResults ? (
                            <div className="dropdown-search__content__no-results">
                                <span className="dropdown-search__content__no-results__text">{'Nenhum resultado encontrado'}</span>
                            </div>
                        ) : (
                            <div className="dropdown-search__content__results">
                                {formattedData.map((it, index) => this.renderResult(it, index))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
