import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnexoImg from '../../../assets/img/svg/anexo.svg';
import '../../../components/main.scss';
import { IRequest } from '../../../model/request';
import '../../../views/Contrato/contract-register/contract-register.scss';
import './styles.scss';
import ShowFileContainer from '../../../components/download-container/download-container';
import { Document } from '../../../model/document';
import CloseImg from '../../../assets/img/svg/fechar-gray.svg';
import UploadImg from '../../../assets/img/svg/upload-file.svg';

interface Props {
    request: IRequest;
    setRequest: (request: IRequest) => void;
    type?: string;
    label?: string;
};

export const FilesForm = (props: Props) => {
    const { request, setRequest, type, label } = props;
    const { t } = useTranslation();
    const i18nDefaultPath = 'contractRegister.body.files';

    const dropRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;
    const [dragging, setDragging] = useState<boolean>(false);
    const [dragCounter, setDragCounter] = useState<number>(0);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter + 1);
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter + 1);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        };
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter - 1);
        if (dragCounter === 0) {
            setDragging(false);
        };
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUploadFile(e, true);
            setDragCounter(0);
            // firefox does not support modifications after dragin
            // e.dataTransfer.clearData();
        };
    };

    useEffect(() => {
        dropRef.current.addEventListener('dragenter', handleDragIn);
        dropRef.current.addEventListener('dragleave', handleDragOut);
        dropRef.current.addEventListener('dragover', handleDrag);
        dropRef.current.addEventListener('drop', handleDrop);

        return () => {
            dropRef.current.removeEventListener('dragenter', handleDragIn);
            dropRef.current.removeEventListener('dragleave', handleDragOut);
            dropRef.current.removeEventListener('dragover', handleDrag);
            dropRef.current.removeEventListener('drop', handleDrop);
        };
    }, []);


    const onUploadFile = (event: any, isDragged?: boolean) => {
        let uploadedFile: any = {};

        if (isDragged) {
            uploadedFile = event.dataTransfer.files[0];
        } else {
            uploadedFile = event.target.files[0];
        };

        if (uploadedFile == null) return;

        const reader = new FileReader();

        reader.onload = (ev: any) => {
            const attachment = {};
            // tslint:disable-next-line: no-string-literal
            attachment['managerFile'] = {
                id: undefined,
                fileName: uploadedFile.name,
                contentType: uploadedFile.type,
                file: ev.target.result.split(',')[1]
            };
            setRequest({ ...request, ...attachment });
        };
        reader.readAsDataURL(uploadedFile);
    };

    const showUploadedName = () => {
        const attachment = request?.managerFile;
        if (attachment == null) {
            return <div style={{marginTop: '9px', pointerEvents: 'none'}}>{label}</div>;
        }
        return attachment?.fileName;
    };

    return (
        <span className="files-form__container" ref={dropRef} >
            {dragging && (
                <div className="files-form__drag-box--wrapper" >
                    <div className="files-form__drag-box--content" >
                        <div className="files-form__drag-box--icon" ><img alt="upload" style={{width: "24px"}} src={UploadImg} /></div>
                    </div>
                </div>
            )}
            {(type === 'TAG' && request?.managerFile) ? (
                <div className={dragging ? "disabled files-form__body--wrapper" : "files-form__body--wrapper"}>
                    <p className={dragging ? "disabled files-form__body--label-upper" : "files-form__body--label-upper"}>{label ?? ''}</p>
                    <span className={dragging ? "disabled files-form__body--tag" : "files-form__body--tag"}>
                        <ShowFileContainer<Document> item={request?.managerFile ?? ''}>
                            <span style={{paddingRight: "32px", marginLeft: "0px"}}>{`${request?.managerFile?.fileName ?? ''}`}</span>
                        </ShowFileContainer>
                        <span className="files-form__body--tag-delete" onClick={() => setRequest({...request, managerFile: undefined})}>
                            <img alt="close" style={{width: "16px"}} src={CloseImg} />
                        </span>
                    </span>
                </div>
                ) : (showUploadedName())
            }
            
            <label htmlFor='upload1' style={{width: '85px'}}>
                <div className={dragging ? "disabled files-form__body--upload-button" : "files-form__body--upload-button"}>
                    <input id='upload1' onChange={(e) => onUploadFile(e)} type={'file'} multiple={false} />
                    <img className='anexo-img' alt={'close'} src={AnexoImg} />
                    {t(`${i18nDefaultPath}.textField.button`)}
                </div>
            </label>
        </span>
    );
};