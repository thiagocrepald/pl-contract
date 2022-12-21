import classNames from 'classnames';
import * as React from 'react';
import './clickable-icon.scss';

interface Props {
    className?: string;
    isDisabled?: boolean;
    iconPath: string | NodeRequire;
    onClick: (...args: any) => void;
}

export class ClickableIcon extends React.Component<Props> {

    render() {
        const isDisabledClassName = this.props.isDisabled ? 'is-disabled' : '';
        return (
            <img src={this.props.iconPath as string} className={classNames(['clickable-icon', this.props.className, isDisabledClassName])} onClick={this.props.onClick} alt='' />
        );
    }
}

export default ClickableIcon;
