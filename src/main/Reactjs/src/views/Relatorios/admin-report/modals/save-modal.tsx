import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import Modal from 'react-modal';
import CloseImg from '../../../../assets/img/svg/fechar-gray.svg';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import IconButton from '../../../../components/icon-button/icon-button';
import '../styles.scss';

interface IProps {
    report: any;
    showModal: boolean;
    setShowModal: React.Dispatch<any>;
};

const SaveModal = ({ report, showModal, setShowModal }: IProps) => {
    const { t } = useTranslation();
    const [fileName, setFileName] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [shouldOverwrite, setShouldOverwrite] = useState<boolean>(false);
    const previousFileName = useRef('');

    useEffect(() => {
        // when integrated to API, use fileName
        // if (!isEmpty(report)) {
        //     previousFileName.current = report?.fileName;
        //     return setFileName(report?.fileName);
        // };
        // previousFileName.current = '';
        // return setFileName('');

        // using mock data
        if (!isEmpty(report)) {
            previousFileName.current = report.fileName ?? `${Object.values(report)[0]} - ${Object.values(report)[1]}`;
            return setFileName(report.fileName ?? `${Object.values(report)[0]} - ${Object.values(report)[1]}`);
        };

        previousFileName.current = '';
        return setFileName('');
    }, [report]);

    const handleOnChange = (value: string) => {
        setShowMessage(false);
        setFileName(value);
    };

    const handleOnSave = () => {
        if (!isEmpty(fileName) && fileName === previousFileName.current && !shouldOverwrite) {
            setShouldOverwrite(true);
            return setShowMessage(true);
        };
        if (!isEmpty(fileName) && fileName === previousFileName.current && shouldOverwrite) {
            setShouldOverwrite(false);
            setShowMessage(false);
            setShowModal(false);
            return console.log("SAVED OVERWRITE");
        }
        if (isEmpty(fileName)) {
            setShowMessage(true);
            return console.log("CANNOT SAVE EMPTY");
        };
        console.log("SAVED");
        setShowModal(false);
        setShowMessage(false);
    };

    const handleOnClose = () => {
        setShowModal(false);
        setShouldOverwrite(false);
        setShowMessage(false);
        setFileName(previousFileName.current);
    };

    return (
        <Modal isOpen={showModal} className='report__modal' ariaHideApp={false}>
            <img className='close-img' src={CloseImg} onClick={handleOnClose}/>
            <div className='contract-request__modal--title'>{t('report.admin.modal.titleSecond')}</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ marginTop: '10px', width: '375px' }}>
                    <CustomTextField
                        id='save-report'
                        placeholder={t('report.admin.modal.insert')}
                        value={fileName}
                        onChange={(e) => handleOnChange(e)}
                    />
                </div>
            </div>
            <div className='report__modal--message' >{(showMessage && !isEmpty(fileName)) ? (
                <span>{t('report.admin.modal.message.confirm')}</span> 
                ) : ((showMessage && isEmpty(fileName)) && <span>{t('report.admin.modal.message.empty')}</span> )}
            </div>
            <hr />
            <div className='contract-request__modal--buttons'>
                <div style={{ marginRight: '12px' }}>
                    <IconButton color='white' isAlignCenter width={'150px'} height={'44px'} fontSize='15px' filled clickButton={handleOnClose}>
                        <div className='icon-arrow-filled' />
                        {t('global.button.return')}
                    </IconButton>
                </div>
                <div style={{ marginLeft: '12px' }}>
                    <IconButton color='green' isAlignCenter width={'150px'} height={'44px'} fontSize='15px' filled clickButton={handleOnSave}>
                        {t('global.button.save')}
                    </IconButton>
                </div>
            </div>
        </Modal>
    );
};

export default SaveModal;