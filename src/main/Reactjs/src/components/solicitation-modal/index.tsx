import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import CustomTextField from '../../components/custom-text-field/custom-text-field';
import SimpleOrderTable from '../../components/simple-ordered-table/simple-ordered-table';
import ShowFileContainer from '../../components/download-container/download-container';
import { FilesForm } from './files-form';
import IconButton from '../icon-button/icon-button';
import Modal from 'react-modal';
import { TextareaAutosize } from '@material-ui/core';
import { Col, Row } from 'react-bootstrap';
import CloseImg from '../../assets/img/svg/fechar-gray.svg';
import TimeImg from '../../assets/img/svg/relogio.svg';
import { AccessControl } from '../../model/access-control';
import { ModalType, Tag } from '../../model/enums/contract-request';
import { Document } from '../../model/document';
import { APP_TIME_FORMAT } from '../../config/constants';
import RequestService from '../../services/request.service';
import DateUtils from '../../util/date-utils';
import './styles.scss';
import '../main.scss';
export interface IProps {
    show: boolean;
    type?: number;
    status?: string;
    accessControl?: AccessControl;
    getAccessControls?: (shouldResetPageAction?: boolean) => void;
    request?: any;
}

const SolicitationModal = (props: IProps) => {
    const { t } = useTranslation();
    const [showSolicitationModal, setShowSolicitationModal] = useState<boolean>(false);
    const [showResolveSolicitationModal, setShowResolveSolicitationModal] = useState<boolean>(false);
    const [showResolveCorrectionModal, setShowResolveCorrectionModal] = useState<boolean>(false);
    const [showResolveContestedModal, setShowResolveContestedModal] = useState<boolean>(false);
    const [showResolveNotRegisteredModal, setShowResolveNotRegisteredModal] = useState<boolean>(false);
    const [showSelectNotification, setShowSelectNotification] = useState<boolean>(false);
    const [showJustificationNotification, setShowJustificationNotification] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [newRequest, setNewRequest] = useState<any>();

    useEffect(() => {
        if (!isEmpty(props.request)){
            setNewRequest({
                ...props.request, 
                adjustedStartTime: DateUtils.getHourAndMinuteOfDate(props.request?.adjustedStartTime),
                adjustedFinalTime: DateUtils.getHourAndMinuteOfDate(props.request?.adjustedFinalTime),
            });
        } else {
            setNewRequest(null);
        };

        if(props.show){
            handleShowModal(props.type);
        }
    }, [props.show]);

    const handleShowModal = (type) => {
        setShowSolicitationModal(false);
        setShowResolveSolicitationModal(false);
        setShowResolveCorrectionModal(false);
        setShowResolveContestedModal(false);
        setShowSelectNotification(false);
        setShowJustificationNotification(false);

        switch(type){
            case ModalType.SOLICITATION:
                if (props.status === Tag.REJECTED) {
                    setNewRequest({
                        ...newRequest, 
                        adjustedFinalTime: null, 
                        adjustedStartTime: null, 
                        managerJustification: null, 
                        managerFile: null
                    });
                };
                setShowSolicitationModal(true);
                break;
            case ModalType.RESOLVE_SOLICITATION:
                setNewRequest({...newRequest, accessControl: undefined});
                setShowResolveSolicitationModal(true);
                break;
            case ModalType.RESOLVE_CORRECTION:
                setNewRequest({});
                setShowResolveCorrectionModal(true);
                break;
            case ModalType.RESOLVE_CONTESTED:
                setNewRequest({});
                setShowResolveContestedModal(true);
                break;
            case ModalType.RESOLVE_NOT_REGISTERED:
                setShowResolveNotRegisteredModal(true);
                break;
        };
    };

    const formatUpdatedDatetime = (time: string, date: string | Date | Moment | undefined) => {
        if (time && date){
            let updatedTime = '';
            if (!time.includes(':')) {
                updatedTime = time.slice(0,2) + ':' + time.slice(2);
            } else {
                updatedTime = time;
            }

            if (typeof date === 'string') {
                return date.slice(0,11) + updatedTime + ":00z";
            };
        };

        return null;
    };

    const formatUnknownTime = (startTime?: Date | string | Moment, endTime?: Date | string | Moment, fixTimeZone?: boolean) => {
        const nullTime = '___:___';
        if (startTime && endTime) {
            if (fixTimeZone) {
                return `${moment.utc(startTime).local().format(APP_TIME_FORMAT)} - ${moment.utc(endTime).local().format(APP_TIME_FORMAT)}`;
            };
            return `${moment(startTime).utc().format(APP_TIME_FORMAT)} - ${moment(endTime).utc().format(APP_TIME_FORMAT)}`;
        } else if (startTime) {
            if (fixTimeZone) {
                return `${moment.utc(startTime).local().format(APP_TIME_FORMAT)} - ${nullTime}`;
            };
            return `${moment(startTime).utc().format(APP_TIME_FORMAT)} - ${nullTime}`;
        } else if (endTime) {
            if (fixTimeZone) {
                return `${nullTime} - ${moment.utc(endTime).local().format(APP_TIME_FORMAT)}`;
            };
            return `${nullTime} - ${moment(endTime).utc().format(APP_TIME_FORMAT)}`;
        };
        return null;
    };
    
    const handleSolicitationModal = async (item: any, status?: string) => {

        if (!isEmpty(item)) {
            let data = {};
           
            if (props.request?.id) {data['id'] = props.request.id};
            if (item['adjustedStartTime']) {data['adjustedStartTime'] = formatUpdatedDatetime(item['adjustedStartTime'].toString(), moment().format())}
            if (item['adjustedFinalTime']) {data['adjustedFinalTime'] = formatUpdatedDatetime(item['adjustedFinalTime'].toString(), moment().format())}
            if (item['managerFile']) {data['managerFile'] = item.managerFile};
            if (item['managerJustification']) {data['managerJustification']= item.managerJustification};
            data['accessControl'] = {};
            
            if (status === Tag.PENDING || status === Tag.OK || status === Tag.CANCELED || status === Tag.ADJUSTED) {
                data['accessControl']['id'] = props.accessControl?.id;

                await RequestService.createRequest(data);
                if (props.getAccessControls) {
                    props.getAccessControls(true)
                };
                setShowSolicitationModal(false);
            };

            if (status === Tag.ADJUSTED_ADMIN) {
                data['accessControl']['status'] = Tag.ADJUSTED_ADMIN;
                await RequestService.updateRequest(data);
                if (props.getAccessControls) {
                    props.getAccessControls(true)
                };
                setShowSolicitationModal(false);
            };

            if (status === Tag.REJECTED) {
                data['accessControl']['status'] = Tag.ADJUSTED_ADMIN;
                await RequestService.resolveRequest(data);
                if (props.getAccessControls) {
                    props.getAccessControls(true)
                };
                setShowSolicitationModal(false);
            } ;
        }
    };

    const handleResolveSolicitationModal = async (item: any) => {
        if (!isEmpty(item)) {
            
            if (isEmpty(item?.accessControl)) {
                setShowSelectNotification(true);
                return;
            } else if ((item.accessControl.status === Tag.CORRECTION || item.accessControl.status === Tag.REJECTED) && isEmpty(item?.managerJustification)) {
                setShowJustificationNotification(true);
                return;
            };
            
            let data = {};
            data['accessControl'] = {...item.accessControl};
            data['id'] = props.request?.id;
            if (item['managerFile']) {data['managerFile'] = item?.managerFile};
            if (item['managerJustification']) {data['managerJustification'] = item?.managerJustification};

            await RequestService.resolveRequest(data);
            if (props.getAccessControls) {
                props.getAccessControls(true)
            };
            setShowResolveSolicitationModal(false);
        }
    };

    const handleResolveContestedModal = async (item: any) => {
        if (isEmpty(item?.accessControl)) {
            setShowSelectNotification(true);
            return;
        };
        
        let data = {};
        data['accessControl'] = {...item.accessControl};
        data['id'] = props.request?.id;
        
        if (item['adjustedStartTime']) {data['adjustedStartTime'] = formatUpdatedDatetime(item['adjustedStartTime'].toString(), moment().format())}
        if (item['adjustedFinalTime']) {data['adjustedFinalTime'] = formatUpdatedDatetime(item['adjustedFinalTime'].toString(), moment().format())}
        
        await RequestService.resolveRequest(data);
        if (props.getAccessControls) {props.getAccessControls(true)};
        setShowResolveContestedModal(false);
    };

    const handleResolveCorrectionModal = async (item: any) => {
        if (isEmpty(item?.accessControl)) {
            setShowSelectNotification(true);
            return;
        };

        let data = {};
        data['accessControl'] = {...item.accessControl};
        data['id'] = props.request?.id;

        await RequestService.resolveRequest(data);
        if (props.getAccessControls) {props.getAccessControls(true)};
        setShowResolveCorrectionModal(false);
    };

    return (
        <>
            {/* ********  SOLICITATION MODAL  ***********  */}
            <Modal isOpen={showSolicitationModal} className="contract-request__modal" contentLabel="Example Modal" ariaHideApp={false}>
                <img className="close-img" alt="close" src={CloseImg} onClick={() => setShowSolicitationModal(false)}/>
                <div className="contract-request__modal--title">
                    {
                        (props.status === Tag.PENDING || props.status === Tag.REJECTED || props.status === Tag.OK || props.status === Tag.CANCELED || props.status === Tag.ADJUSTED) ?
                        t("contractDetail.request.modal.newSolicitation") : t("contractDetail.request.modal.solicitation")
                    }
                </div>
                <Row>
                    <Col>
                        <div className="contract-request__modal--subtitle">{t("contractDetail.request.modal.performancePlace")}</div>
                        <div className="contract-request__modal--container">
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.place")}</div>
                                <div className="contract-request__modal--container-answer">{props.accessControl?.onCall?.schedule?.workplace?.unitName ?? ""}</div>
                            </div>
                            <div className="contract-request__modal--container-line-second">
                                <div style={{ flex: "1 1 20%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.scale")}</div>
                                    <div className="contract-request__modal--container-answer">{props.accessControl?.onCall?.schedule?.scheduleName ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 15%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.period")}</div>
                                    <div className="contract-request__modal--container-answer">{props.accessControl?.onCall?.startTime && props.accessControl?.onCall.endTime ? DateUtils.formatTime(props.accessControl.onCall.startTime, props.accessControl.onCall.endTime, true) : ""}</div>
                                </div>
                                <div style={{ flex: "1 1 10%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.date")}</div>
                                    <div className="contract-request__modal--container-answer">{props.accessControl?.onCall?.date ? moment(props.accessControl.onCall.date, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                                </div>
                            </div>
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.accomplishedTime")}</div>
                                <div className="contract-request__modal--container-answer">{props.accessControl?.startTime && props.accessControl?.endTime ? DateUtils.formatTime(props.accessControl.startTime, props.accessControl.endTime, true) : ''}</div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div className="contract-request__modal-adjust">
                                <img alt="time" src={TimeImg} />
                                {t("contractDetail.request.modal.adjust")}
                            </div>
                            <div style={{ display: "flex", marginBottom: "26px", marginTop: "16px" }}>
                                <CustomTextField
                                    style={{position: 'relative', width: '150px', marginRight: '18px'}}
                                    mask={'99:99'}
                                    id={t(`${props.request?.accessControl?.id}.textField.startTime`)}
                                    className={'custom-text-field-reference solicitation-modal__custom-text-field'}
                                    label={t("contractDetail.request.modal.startTime")}
                                    placeholder={t("contractDetail.request.modal.startTime")}
                                    value={newRequest?.adjustedStartTime ?? ''}
                                    onChange={(e) => {
                                        setNewRequest({ ...newRequest, adjustedStartTime: e });
                                    }}
                                />
                                <CustomTextField
                                    mask={'99:99'}
                                    id={t(`${props.request?.accessControl?.id}.textField.endTime`)}
                                    className={'custom-text-field-reference solicitation-modal__custom-text-field'}
                                    label={t("contractDetail.request.modal.endTime")}
                                    placeholder={t("contractDetail.request.modal.endTime")}
                                    value={newRequest?.adjustedFinalTime}
                                    onChange={(e) => {
                                        setNewRequest({ ...newRequest, adjustedFinalTime: e });
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <TextareaAutosize
                                className="text-area"
                                rowsMin={4}
                                rowsMax={4}
                                style={newRequest?.managerJustification || props.request?.managerJustification ? {} : {backgroundColor: "#f8f8f8", border: "1px solid #c4c4c4"}}
                                placeholder={t("contractDetail.request.modal.enterComment")}
                                defaultValue={props.status === Tag.ADJUSTED_ADMIN ? props.request?.managerJustification : ''}
                                value={newRequest?.managerJustification}
                                onChange={(e) => {
                                    setNewRequest({ ...newRequest, managerJustification: e.target.value });
                                }}
                            />
                        </div>
                        <div className="contract-request__modal--file-form" style={{height: '65px'}}>
                            <FilesForm request={newRequest} setRequest={setNewRequest} type='TAG' label={t("contractRegister.body.files.textField.attachDocument")}/>
                        </div>
                    </Col>
                </Row>
                <hr/>
                <div className="contract-request__modal--buttons">
                    <div style={{ marginRight: "12px" }}>
                        <IconButton color="white" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => setShowSolicitationModal(false)}>
                            <div className="icon-arrow-filled" />
                            Voltar
                        </IconButton>
                    </div>
                    <div style={{ marginLeft: "12px" }}>
                        <IconButton 
                            color="green"
                            isAlignCenter
                            width={"150px"}
                            height={"44px"}
                            fontSize="15px"
                            filled
                            clickButton={() => handleSolicitationModal(newRequest, props.status)}
                        >
                            {t("global.button.submit")}
                        </IconButton>
                    </div>
                </div>
            </Modal>

            {/* ********  RESOLVE SOLICITATION MODAL  ***********  */}
            <Modal isOpen={showResolveSolicitationModal} className="contract-request__modal" contentLabel="Example Modal" ariaHideApp={false}>
                <img className="close-img" alt="close" src={CloseImg} onClick={() => setShowResolveSolicitationModal(false)}/>
                <div className="contract-request__modal--title">{t("contractDetail.request.modal.resolveSolicitation")}</div>
                <Row>
                    <Col>
                        <div className="contract-request__modal--subtitle">{t("contractDetail.request.modal.performancePlace")}</div>
                        <div className="contract-request__modal--container">
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.place")}</div>
                                <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.schedule?.workplace?.unitName ?? ""}</div>
                            </div>
                            <div className="contract-request__modal--container-line-second">
                                <div style={{ flex: "1 1 20%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.scale")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.schedule?.scheduleName ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 15%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.period")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.accessControl?.onCall?.startTime, props.request?.accessControl?.onCall?.endTime, true) ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 10%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.date")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.date ? moment(props.request.accessControl.onCall.date, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                                </div>
                            </div>
                            <div className="contract-request__modal--container-line-second">
                                <div style={{ flex: "1 1 22%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.accomplishedTime")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.accessControl?.startTime, props.request?.accessControl?.endTime, true) ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 23%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.justifiedTime")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.adjustedStartTime, props.request?.adjustedFinalTime, true) ?? ""}</div>
                                </div>
                            </div>
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.justification")}</div>
                                <div className="contract-request__modal--container-answer">{props.request?.doctorJustification ?? ''}</div>
                            </div>
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.attachment")}</div>
                                <div className="contract-detail__container--body-archive">
                                    <ShowFileContainer<Document> item={props.request?.doctorFile ?? ''}>
                                        <div className="icon-attach" />
                                        <span>{`${props.request?.doctorFile?.fileName ?? ''}`}</span>
                                    </ShowFileContainer>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="contract-request__modal--subtitle">{t("contractDetail.request.modal.justificationAswer")}</div>
                        <div style={{ display: "flex", marginTop: "10px", marginBottom: "28px" }}>
                            <button style={newRequest?.accessControl?.status === Tag.ADJUSTED ? { marginRight: "10px", backgroundColor: "#149372", color: "#ffffff", boxShadow: "none"} : { marginRight: "10px" }} className="selection-button" onClick={() => setNewRequest({ ...newRequest, accessControl: {status: Tag.ADJUSTED} })}>
                                {t("contractDetail.request.modal.approved")}
                            </button>
                            <button style={newRequest?.accessControl?.status === Tag.REJECTED ? { marginRight: "10px", backgroundColor: "#149372", color: "#ffffff", boxShadow: "none"} : { marginRight: "10px" }} className="selection-button" onClick={() => setNewRequest({ ...newRequest, accessControl: {status: Tag.REJECTED} })}>
                                {t("contractDetail.request.modal.disapproved")}
                            </button>
                            <button style={newRequest?.accessControl?.status === Tag.CORRECTION ? { backgroundColor: "#149372", color: "#ffffff", boxShadow: "none"} : {}} className="selection-button" onClick={() => setNewRequest({ ...newRequest, accessControl: {status: Tag.CORRECTION} })}>
                                {t("contractDetail.request.modal.correction")}
                            </button>
                        </div>
                        {(showSelectNotification && !newRequest?.accessControl?.status) ? <div style={{position: "absolute", top: "75px", left: "3px"}} className="contract-request__modal--required-notification">{t("management.fieldError.selectionRequired")}</div> : ""}
                        <div style={{ marginBottom: "20px", position: "relative" }}>
                            <TextareaAutosize
                                className="text-area"
                                rowsMin={4}
                                rowsMax={4}
                                style={newRequest?.managerJustification ? {} : {backgroundColor: "#f8f8f8", border: "1px solid #c4c4c4"}}
                                placeholder={t("contractDetail.request.modal.enterComment")}
                                defaultValue={props.status === Tag.ADJUSTED_ADMIN ? props.request?.managerJustification : ''}
                                value={newRequest?.managerJustification}
                                onChange={(e) => {
                                    setNewRequest({ ...newRequest, managerJustification: e.target.value });
                                }}
                            />
                            {(showJustificationNotification && !newRequest?.managerJustification && (newRequest?.accessControl?.status === Tag.CORRECTION || newRequest?.accessControl?.status === Tag.REJECTED)) ? <div style={{position: "absolute", top: "102px", left: "-14px"}} className="contract-request__modal--required-notification">{t("management.fieldError.required")}</div> : ""}
                        </div>
                        <div className="contract-request__modal--file-form" style={{height: '65px'}}>
                            <FilesForm request={newRequest} setRequest={setNewRequest} type='TAG' label={t("contractRegister.body.files.textField.attachDocument")}/>
                        </div>
                    </Col>
                </Row>
                <hr/>
                <div className="contract-request__modal--buttons">
                    <div style={{ marginRight: "12px" }}>
                        <IconButton color="white" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => setShowResolveSolicitationModal(false)}>
                            <div className="icon-arrow-filled" />
                            Voltar
                        </IconButton>
                    </div>
                    <div style={{ marginLeft: "12px" }}>
                        <IconButton color="green" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => handleResolveSolicitationModal(newRequest)}>
                            Enviar
                        </IconButton>
                    </div>
                </div>
            </Modal>

            {/* ********  RESOLVE CORRECTION MODAL  ***********  */}
            <Modal isOpen={showResolveCorrectionModal} className="contract-request__modal" contentLabel="Example Modal" ariaHideApp={false}>
                <img className="close-img" alt="close" src={CloseImg} onClick={() => setShowResolveCorrectionModal(false)}/>
                <div className="contract-request__modal--title">{t("contractDetail.request.modal.resolveSolicitation")}</div>
                <Row>
                    <Col>
                        <div className="contract-request__modal--subtitle">{t("contractDetail.request.modal.performancePlace")}</div>
                        <div className="contract-request__modal--container">
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.place")}</div>
                                <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.schedule?.workplace?.unitName ?? ""}</div>
                            </div>
                            <div className="contract-request__modal--container-line-second">
                                <div style={{ flex: "1 1 20%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.scale")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.schedule?.scheduleName ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 15%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.period")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.accessControl?.onCall?.startTime, props.request?.accessControl?.onCall?.endTime, true) ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 10%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.date")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.date ? moment(props.request.accessControl.onCall.date, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                                </div>
                            </div>
                            <div className="contract-request__modal--container-line-second">
                                <div style={{ flex: "1 1 22%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.accomplishedTime")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.accessControl?.startTime, props.request?.accessControl?.endTime, true) ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 23%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.justifiedTime")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.adjustedStartTime, props.request?.adjustedFinalTime, true) ?? ""}</div>
                                </div>
                            </div>
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.justification")}</div>
                                <div className="contract-request__modal--container-answer">{props.request?.doctorJustification ?? ""}</div>
                            </div>
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.comment")}</div>
                                <div className="contract-request__modal--container-answer">{props.request?.managerJustification ?? ""}</div>
                            </div>
                            {props.status === Tag.CONTESTED && (
                                <div className="contract-request__modal--container-line">
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.whyNot")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.doctorJustificationNotAccepted ?? ""}</div>
                                </div>
                            )}
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.attachment")}</div>
                                <div className="contract-detail__container--body-archive">
                                    <ShowFileContainer<Document> item={props.request?.doctorFile ?? ""}>
                                        <div className="icon-attach" />
                                        <span>{`${props.request?.doctorFile?.fileName ?? ""}`}</span>
                                    </ShowFileContainer>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="contract-request__modal--column">
                            <div className="contract-request__modal--subtitle">{t("contractDetail.request.modal.justificationAswer")}</div>
                            <div style={{position: "relative"}}>
                                <div style={{ display: "flex", marginTop: "10px", marginBottom: "20px" }}>
                                    <button style={newRequest?.accessControl?.status === Tag.REJECTED ? { marginRight: "10px", backgroundColor: "#149372", color: "#ffffff", boxShadow: "none"} : { marginRight: "10px" }} className="selection-button" onClick={() => setNewRequest({ ...newRequest, accessControl: {status: 'REJECTED'} })}>
                                        {t("contractDetail.request.modal.disapproved")}
                                    </button>
                                    <button style={newRequest?.accessControl?.status === Tag.ADJUSTED ? { backgroundColor: "#149372", color: "#ffffff", boxShadow: "none"} : {}} className="selection-button" onClick={() => setNewRequest({ ...newRequest, accessControl: {status: 'ADJUSTED'} })}>
                                        {t("contractDetail.request.modal.approved")}
                                    </button>
                                </div>
                                {(showSelectNotification && !newRequest?.accessControl?.status) ? <div style={{position: "absolute", bottom: "-1px", left: "-13px"}} className="contract-request__modal--required-notification">{t("management.fieldError.selectionRequired")}</div> : ""}
                            </div>
                        </div>
                    </Col>
                </Row>
                <hr/>
                <div className="contract-request__modal--buttons">
                    <div style={{ marginRight: "12px" }}>
                        <IconButton color="white" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => setShowResolveCorrectionModal(false)}>
                            <div className="icon-arrow-filled" />
                            Voltar
                        </IconButton>
                    </div>
                    <div style={{ marginLeft: "12px" }}>
                        <IconButton color="green" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => handleResolveCorrectionModal(newRequest)}>
                            Enviar
                        </IconButton>
                    </div>
                </div>
            </Modal>

            {/* ********  RESOLVE CONTESTED MODAL  ***********  */}
            <Modal isOpen={showResolveContestedModal} className="contract-request__modal" contentLabel="Example Modal" ariaHideApp={false}>
                <img className="close-img" alt="close" src={CloseImg} onClick={() => setShowResolveContestedModal(false)}/>
                <div className="contract-request__modal--title">{t("contractDetail.request.modal.resolveSolicitation")}</div>
                <Row>
                    <Col>
                        <div className="contract-request__modal--subtitle">{t("contractDetail.request.modal.performancePlace")}</div>
                        <div className="contract-request__modal--container">
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.place")}</div>
                                <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.schedule?.workplace?.unitName ?? ""}</div>
                            </div>
                            <div className="contract-request__modal--container-line-second">
                                <div style={{ flex: "1 1 20%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.scale")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.schedule?.scheduleName ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 15%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.period")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.accessControl?.onCall?.startTime, props.request?.accessControl?.onCall?.endTime, true) ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 10%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.date")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.date ? moment(props.request.accessControl.onCall.date, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                                </div>
                            </div>
                            <div className="contract-request__modal--container-line-second">
                                <div style={{ flex: "1 1 22%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.accomplishedTime")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.accessControl?.startTime, props.request?.accessControl?.endTime, true) ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 23%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.justifiedTime")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.adjustedStartTime, props.request?.adjustedFinalTime, true) ?? ""}</div>
                                </div>
                            </div>
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.comment")}</div>
                                <div className="contract-request__modal--container-answer">{props.request?.managerJustification ?? ""}</div>
                            </div>
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.whyNot")}</div>
                                <div className="contract-request__modal--container-answer">{props.request?.doctorJustificationNotAccepted ?? ""}</div>
                            </div>
                            <div className="contract-request__modal--container-line">
                                <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.attachment")}</div>
                                <div className="contract-detail__container--body-archive">
                                    <ShowFileContainer<Document> item={props.request?.doctorFile ?? ""}>
                                        <div className="icon-attach" />
                                        <span>{`${props.request?.doctorFile?.fileName ?? ""}`}</span>
                                    </ShowFileContainer>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div className="contract-request__modal-adjust">
                                <img alt="time" src={TimeImg} />
                                {t("contractDetail.request.modal.adjust")}
                            </div>
                            <div style={{ display: "flex", marginBottom: "26px", marginTop: "16px" }}>
                                <CustomTextField
                                    style={{position: 'relative', width: '150px', marginRight: '18px'}}
                                    mask={'99:99'}
                                    id={t(`${props.request?.accessControl?.id}.textField.startTime`)}
                                    className={'custom-text-field-reference solicitation-modal__custom-text-field'}
                                    label={t("contractDetail.request.modal.startTime")}
                                    placeholder={t("contractDetail.request.modal.startTime")}
                                    value={newRequest?.adjustedStartTime ?? ''}
                                    onChange={(e) => {
                                        setNewRequest({ ...newRequest, adjustedStartTime: e });
                                    }}
                                />
                                <CustomTextField
                                    mask={'99:99'}
                                    id={t(`${props.request?.accessControl?.id}.textField.endTime`)}
                                    className={'custom-text-field-reference solicitation-modal__custom-text-field'}
                                    label={t("contractDetail.request.modal.endTime")}
                                    placeholder={t("contractDetail.request.modal.endTime")}
                                    value={newRequest?.adjustedFinalTime}
                                    onChange={(e) => {
                                        setNewRequest({ ...newRequest, adjustedFinalTime: e });
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", paddingRight: "72px" }}>
                            <div className="contract-request__modal--subtitle">{t("contractDetail.request.modal.justificationAswer")}</div>
                            <div style={{position: "relative"}}>
                                <div style={{ display: "flex", marginTop: "10px", marginBottom: "20px" }}>
                                    <button style={newRequest?.accessControl?.status === Tag.REJECTED ? { marginRight: "10px", backgroundColor: "#149372", color: "#ffffff", boxShadow: "none"} : { marginRight: "10px" }} className="selection-button" onClick={() => setNewRequest({ ...newRequest, accessControl: {status: 'REJECTED'} })}>
                                        {t("contractDetail.request.modal.disapproved")}
                                    </button>
                                    <button style={newRequest?.accessControl?.status === Tag.ADJUSTED ? { backgroundColor: "#149372", color: "#ffffff", boxShadow: "none"} : {}} className="selection-button" onClick={() => setNewRequest({ ...newRequest, accessControl: {status: 'ADJUSTED'} })}>
                                        {t("contractDetail.request.modal.approved")}
                                    </button>
                                </div>
                                {(showSelectNotification && !newRequest?.accessControl?.status) ? <div style={{position: "absolute", bottom: "-1px", left: "-13px"}} className="contract-request__modal--required-notification">{t("management.fieldError.selectionRequired")}</div> : ""}
                            </div>
                        </div>
                    </Col>
                </Row>
                <hr/>
                <div className="contract-request__modal--buttons">
                    <div style={{ marginRight: "12px" }}>
                        <IconButton color="white" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => setShowResolveContestedModal(false)}>
                            <div className="icon-arrow-filled" />
                            Voltar
                        </IconButton>
                    </div>
                    <div style={{ marginLeft: "12px" }}>
                        <IconButton color="green" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => handleResolveContestedModal(newRequest)}>
                            Enviar
                        </IconButton>
                    </div>
                </div>
            </Modal>

            {/* ********  RESOLVE NOT REGISTERED MODAL  ***********  */}
            <Modal isOpen={showResolveNotRegisteredModal} className="contract-request__modal" contentLabel="Example Modal" ariaHideApp={false}>
                <img className="close-img" alt="close" src={CloseImg} onClick={() => setShowResolveNotRegisteredModal(false)}/>
                <div className="contract-request__modal--title">{t("contractDetail.request.modal.resolve")}</div>
                <Row>
                    <Col>
                        <div className="contract-request__modal--subtitle">{t("contractDetail.request.modal.performancePlace")}</div>
                        <div className="contract-request__modal--container">
                            <div style={{ border: "none" }} className="contract-request__modal--container-line-second">
                                <div style={{ flex: "1 1 20%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.place")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.schedule?.workplace?.unitName ?? ""}0</div>
                                </div>
                                <div style={{ flex: "1 1 15%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.period")}</div>
                                    <div className="contract-request__modal--container-answer">{formatUnknownTime(props.request?.accessControl?.onCall?.startTime, props.request?.accessControl?.onCall?.endTime, true) ?? ""}</div>
                                </div>
                                <div style={{ flex: "1 1 10%" }}>
                                    <div className="contract-request__modal--container-title">{t("contractDetail.request.modal.date")}</div>
                                    <div className="contract-request__modal--container-answer">{props.request?.accessControl?.onCall?.date ? moment(props.request.accessControl.onCall.date, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "16px", marginBottom: "11px" }} className="contract-request__modal--subtitle">
                            {t("contractDetail.request.modal.selectScale")}
                        </div>
                        <CustomTextField className="custom-text-field-reference" id="" onChange={() => {}} label={t("contractDetail.cost.modal.selectScale")} />
                        <div style={{ marginTop: "16px", marginBottom: "11px" }} className="contract-request__modal--subtitle">
                            {t("contractDetail.request.modal.select")}
                        </div>
                        <div style={{ maxHeight: "236px", overflowY: "auto" }} className="">
                            <SimpleOrderTable
                                // {...this.props}
                                rows={[['']]}
                                // page={this.state.page}
                                page={{
                                    page,
                                    totalPages: 10,
                                }}
                                columnNameKeys={[
                                    { name: t("contractDetail.request.modal.selectSecond") },
                                    { name: t("contractDetail.request.table.sector") },
                                    { name: t("contractDetail.request.table.day") },
                                    { name: t("contractDetail.request.table.date") },
                                    { name: t("contractDetail.request.table.estimatedTime") },
                                ]}
                                // onChangePage={this.handleChangePage}
                                onChangePage={(index) => {
                                    setPage(index);
                                }}
                                // onSort={(code: string) => this.handleSort(code)}
                                onSort={() => {}}
                            />
                        </div>
                    </Col>
                </Row>
                <hr/>
                <div className="contract-request__modal--buttons">
                    <div style={{ marginRight: "12px" }}>
                        <IconButton color="white" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => {}}>
                            <div className="icon-arrow-filled" />
                            Voltar
                        </IconButton>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginLeft: "12px" }}>
                            <IconButton color="greenSecond" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => setShowResolveNotRegisteredModal(false)}>
                                Rejeitar
                            </IconButton>
                        </div>
                        <div style={{ marginLeft: "12px" }}>
                            <IconButton color="green" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => {}}>
                                Salvar
                            </IconButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default SolicitationModal;
