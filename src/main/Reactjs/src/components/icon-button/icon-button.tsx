import classNames from 'classnames';
import * as React from 'react';
import { Fragment } from 'react';
import SmallLoading from '../../components/small-loading/small-loading';
import './icon-button.scss';

interface Props {
    text?: string;
    color?: 'green' | 'white' | 'gray' | 'greenSecond';
    textColor?: string;
    width?: string;
    height?: string;
    padding?: string;
    filled?: boolean;
    noIcon?: boolean;
    fontSize?: string;
    iconSize?: string;
    iconName?: string;
    isDisabled?: boolean;
    isAlignCenter?: boolean;
    clickButton: () => void;
    isInternalLoading?: boolean;
    flexDirection?: 'row-reverse';
    iconPath?: string | NodeRequire;
    variant?: 'outlined' | 'contained';
    lineHeight?: string;
}

export class IconButton extends React.Component<Props> {
    static defaultProps = {
        iconSize: '24px'
    }

    constructor(props) {
        super(props);
        this.state = {
            columnNameKeys: props.columnNameKeys
        };
    }

    private renderIcon = () => {
        const { iconSize } = this.props;
        if (this.props.iconPath) {
            return <img src={this.props.iconPath as string} className={'icon-button'} alt={''} />;
        } else if (this.props.iconName) {
            return <i style={{ fontSize: iconSize, float: 'left' }} className={this.props.iconName} />;
        }
        return null;
    };

    render() {
        const { isDisabled, color, noIcon, width, height, fontSize, filled, flexDirection, padding, isAlignCenter, isInternalLoading, textColor, lineHeight } = this.props;

        const isAlignCenterClassName = isAlignCenter ? 'is-center' : '';
        const isDisabledClassName = isDisabled || isInternalLoading ? 'is-disabled' : '';

        const buttonStyles = { height, width, fontSize, flexDirection, padding, textColor, lineHeight, transition: 'color 250ms ease, background 250ms ease' };
        
        let classNameForButton;
        if (filled) {
            classNameForButton = 'button__container-outlined--green';
            if (color === 'white') {
                classNameForButton = 'button__container-outlined--white';
            }
            if (color === 'gray') {
                classNameForButton = 'button__container-outlined--gray';
            }
            if (color === 'greenSecond') {
                classNameForButton = 'button__container-outlined--greenSecond';
            }
        }

        return (
            <button
                style={buttonStyles}
                onClick={() => this.props.clickButton()}
                className={classNames(['button__container-outlined', isDisabledClassName, isAlignCenterClassName, classNameForButton])}
            >
                {isInternalLoading
                    ? <SmallLoading />
                    : (
                        <Fragment>
                            {!noIcon && <div className="button__container-filled-icon">{this.renderIcon()}</div>}
                            <div className="button__container-outlined-text">{this.props.text || this.props.children}</div>
                        </Fragment>
                    )}
            </button>
        );
    }
}

export default IconButton;
