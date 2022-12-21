import React from 'react';
import './download-container.scss';

interface Props<T> {
    item?: T & BasicAttributes;
    children: JSX.Element | JSX.Element[];
}

export interface BasicAttributes {
    url?: string;
    fileName?: string;
    contentType?: string;
    file?: string;
}

export const ShowFileContainer = <T extends BasicAttributes>(props: Props<T>) => {

    const openInNewTab = () => {
        const { fileName, contentType: contentType, file } = props.item!;
        if (contentType?.includes('pdf')) {
            const byteCharacters = atob(file ?? '');
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const newFile = new Blob([byteArray], { type: 'application/pdf;base64' });
            const fileURL = URL.createObjectURL(newFile);
            window.open(fileURL);
        } else {
            const w: any = window.open("");
            const base64 = `data:${contentType ?? ''};base64,${file}`;
            const image = new Image();
            image.src = base64;
            w.document.write(image.outerHTML);
        }
    }


    const renderBase64 = (): JSX.Element => {
        return (
            <a onClick={openInNewTab} className="contract-detail__container--body-archive">
                {props.children}
            </a>
        );
    };

    const renderUrl = (): JSX.Element => {
        const { fileName, url } = props.item!;
        return (
            <a href={url} target={'_blank'} rel="noopener noreferrer" className="contract-detail__container--body-archive">
                {props.children}
            </a>
        );
    };

    const noFileToCreateDownload = props.item == null || (props.item.url == null && props.item.file == null);
    if (noFileToCreateDownload) {
        return <>{props.children}</>;
    } else if (props.item!.url != null) {
        return renderUrl();
    } else {
        return renderBase64();
    }
};

export default ShowFileContainer;
