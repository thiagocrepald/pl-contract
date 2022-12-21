/*eslint-disable*/
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import './toast-body-element.scss';

export enum ToastType {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}

interface IToastBodyElementProps extends WithTranslation {
    message: string;
    toastType: ToastType;
}

class ToastBodyElement extends React.Component<IToastBodyElementProps> {

    complementPath = () => {
        const { toastType } = this.props;
        switch (toastType) {
            case ToastType.ERROR:
                return 'error';

            case ToastType.SUCCESS:
                return 'success';

            default:
                return '';
        }
    };

    render() {
        const { t, message, toastType } = this.props;
        return (
            <div className={toastType === ToastType.ERROR ? 'toast__container' : ''}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span> {t(`global.toast.${this.complementPath()}.${message}`)}</span>
                </div>
                <div className="icon-close" />
            </div>
        );
    }
}

export default withTranslation()(ToastBodyElement);
