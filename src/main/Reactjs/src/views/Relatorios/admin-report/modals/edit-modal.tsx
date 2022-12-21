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

const EditModal = ({ report, showModal, setShowModal }: IProps) => {
    const { t } = useTranslation();
    const [fileName, setFileName] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const previousFileName = useRef('');

    useEffect(() => {
        // console.log("REPORT", report);
        previousFileName.current = report?.fileName;
        setFileName(report?.fileName);
    }, [report]);

    const handleOnChange = (value: string) => {
        setShowMessage(false);
        setFileName(value);
    };

    const handleOnSave = () => {
        if (!isEmpty(fileName) && fileName === report?.fileName) {
            return;
        };
        if (isEmpty(fileName)) {
            setShowMessage(true);
            return console.log("CANNOT SAVE EMPTY");
        };
        console.log("SAVED");
        setShowModal(false);
        setShowMessage(false);
        // fazer o get dos Reports
    };

    const handleOnClose = () => {
        setShowModal(false);
        setShowMessage(false);
        setFileName(previousFileName.current);
    };

    // console.log("PREVIOUS FILENAME", previousFileName);    
    // console.log("FILENAME", fileName);

    return (
        <Modal isOpen={showModal} className='report__modal' ariaHideApp={false}>
            <img className='close-img' src={CloseImg} onClick={handleOnClose}/>
            <div className='contract-request__modal--title'>{t('report.admin.modal.titleThird')}</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ marginTop: '10px', width: '375px' }}>
                    <CustomTextField
                        id='edit-report'
                        placeholder={t('report.admin.modal.insert')}
                        value={fileName}
                        onChange={(e) => handleOnChange(e)}
                        // error={companyNameError?.value}
                        // errorText={companyNameError?.message}
                        // onBlur={() => validateField(FieldType.COMPANY_NAME)}
                    />
                </div>
            </div>
            <div className='report__modal--message' >
                {showMessage && <span>{t('report.admin.modal.message.empty')}</span> }
            </div>
            <hr />
            <div className='contract-request__modal--buttons'>
                <div style={{ marginRight: '12px' }}>
                    <IconButton color='white' isAlignCenter width={'150px'} height={'44px'} fontSize='15px' filled clickButton={handleOnClose}>
                        <div className='icon-arrow-filled' />
                        Voltar
                    </IconButton>
                </div>
                <div style={{ marginLeft: '12px' }}>
                    <IconButton color='green' isAlignCenter width={'150px'} height={'44px'} fontSize='15px' filled clickButton={handleOnSave}>
                        Salvar
                    </IconButton>
                    {}
                </div>
            </div>
        </Modal>
    );
};

export default EditModal;