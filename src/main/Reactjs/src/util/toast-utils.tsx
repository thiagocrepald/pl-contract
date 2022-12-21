import React from 'react';
import { toast } from 'react-toastify';
import ToastBodyElement, { ToastType } from '../components/toast-body-element/toast-body-element';

class ToastUtils {
    static emitErrorToast = (message: string) => {
        toast.error(<ToastBodyElement toastType={ToastType.ERROR} message={message} />);
    }
    

    static emitSuccessToast = (message: string) => {
        toast.success(<ToastBodyElement toastType={ToastType.SUCCESS} message={message} />);
    }

}

export default ToastUtils;
