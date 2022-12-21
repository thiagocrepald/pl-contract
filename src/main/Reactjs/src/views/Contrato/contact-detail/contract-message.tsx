import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import DateUtils from '../../../util/date-utils';
import ShowMoreText from 'react-show-more-text';
import Modal from 'react-modal';
import { isEmpty } from 'lodash';
import { Menu, MenuItem, TextareaAutosize } from '@material-ui/core';
import IconButton from '../../../components/icon-button/icon-button';
import Pagination from '../../../components/pagination';
import { useTranslation } from 'react-i18next';
import { PredicateOperators } from '../../../model/predicate-operators';
import { IMessage } from '../../../model/message';
import { Contract } from '../../../model/contract';
import { Predicate } from '../../../model/predicate';
import { Pageable } from '../../../model/pageable';
import ArchiveImg from '../../../assets/img/svg/archive.svg';
import ArrowImg from '../../../assets/img/svg/arrow-green.svg';
import CloseImg from '../../../assets/img/svg/fechar-gray.svg';
import HistImg from '../../../assets/img/svg/hist.svg';
import SendImg from '../../../assets/img/svg/send-message.svg';
import MessageService from '../../../services/message.service';
import '../contract-detail.scss';
import './contract-message.scss';
import '../../../components/main.scss';

export enum ModalType {
  FILED = 'FILED',
  EDIT = 'EDIT',
  HISTORY = 'HISTORY',
  DOTS = 'DOTS'
};

export enum DataType {
  ALL = 'ALL',
  FILED = 'FILED',
  HISTORY = 'HISTORY'
};

interface IContractMessage {
  contractId: number;
  contract?: Contract;
};

const ContractMessage = (props: IContractMessage) => {
  const { t } = useTranslation();
  const maxCharacters = 1200;
  const [anchorDots, setAnchorDots] = useState<any>(null);

  const [forceNewPage, setForceNewPage] = useState<boolean>(false);
  const pageDefault = {
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
    sort: 'incUserDate,desc'
  };
  const [page, setPage] = useState<Pageable>({...pageDefault});
  const [modalPage, setModalPage] = useState<Pageable>({...pageDefault});

  const [showFiledModal, setShowFiledModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showDotsModal, setShowDotsModal] = useState<boolean>(false);

  const [predicateOperators, setPredicateOperators] = useState<PredicateOperators[]>([]);
  const [predicate] = useState<Predicate>({
    'contract.id': props.contractId,
    'status': 'ACTIVE'
  });
  const [filedPredicate] = useState<Predicate>({
    'contract.id': props.contractId,
    'status': 'INACTIVE'
  });
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<IMessage>({});
  const [newMessage, setNewMessage] = useState<IMessage>({});
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const [filedMessagesList, setFiledMessagesList] = useState<IMessage[]>([]);
  const [filedMessage, setFiledMessage] = useState<IMessage>({});
  
  const isExpandedDefault = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  };
  const [isExpanded, setIsExpanded] = useState({...isExpandedDefault});
  const [temporaryHideShowText, setTemporaryHideShowText] = useState<boolean>(false);

  useEffect(() => {
    getMessages(true, DataType.ALL);
  }, []);

  useEffect(() => {
    getMessages(true, DataType.ALL);
  }, [predicateOperators]);

  useEffect(() => {
    setIsExpanded({...isExpandedDefault});
    if (forceNewPage) getMessages(false, DataType.ALL);
    if (forceNewPage) setTemporaryHideShowText(true);
  }, [page]);

  useEffect(() => {
    if (temporaryHideShowText) setTemporaryHideShowText(false);
  }, [temporaryHideShowText]);

  useEffect(() => {
    if (forceNewPage) getMessages(false, DataType.FILED);
  }, [modalPage]);

  useEffect(() => {
    if (!isEmpty(filedMessage)) {
      onActivateMessage();
    };
  }, [filedMessage]);

  const getMessages = (shouldResetPageAction?: boolean, type?:string) => {
    if (shouldResetPageAction) return resetPage();

    if (type === DataType.ALL) {
      MessageService.getAllMessages(predicate, page, predicateOperators)
          .then((result) => {
            setForceNewPage(false);
            setMessagesList(result.content);
            setPage({
              ...page,
              size: result.size,
              page: result.number,
              totalPages: result.totalPages,
              totalElements: result.totalElements,
              sort: 'incUserDate,desc'
            });
          });
    };

    if (type === DataType.FILED) {
      MessageService.getAllMessages(filedPredicate, modalPage, predicateOperators)
          .then((result) => {
            setForceNewPage(false);
            setFiledMessagesList(result.content);
            setModalPage({
              ...modalPage,
              size: result.size,
              page: result.number,
              totalPages: result.totalPages,
              totalElements: result.totalElements,
              sort: 'incUserDate,desc'
            });
          });
    };
  };

  const handleChangePage = (newPage: number) => {
    setForceNewPage(true);
    setPage({ ...page, page: newPage });
  };

  const handleChangeModalPage = (newPage: number) => {
    setForceNewPage(true);
    setModalPage({ ...modalPage, page: newPage });
  };

  const resetPage = () => {
    setForceNewPage(true);
    setPage({...pageDefault});
  };

  const handleOpenModal = (type) => {
    setShowFiledModal(false);
    setShowEditModal(false);
    setShowHistoryModal(false);
    setShowDotsModal(false);

    switch(type){
      case ModalType.DOTS:
        setShowDotsModal(true);
        break;
      case ModalType.FILED:
        onListFiled();
        break;
      case ModalType.EDIT:
        setShowEditModal(true);
        break;
      case ModalType.HISTORY:
        onListHistory();
        setShowHistoryModal(true);
        break;
    };
  };

  const onListHistory = () => {
    if(!isEmpty(message?.history)) {
      let historyList: IMessage[] = [];
      historyList.push({...message, history: undefined});
      let msg = message.history;

      while (!isEmpty(msg)) {
        if (msg) {
          historyList.push({...msg[0], history: undefined});
          msg = msg[0].history;
        } else {
          msg = undefined;
        };
      };
      setMessageHistory(historyList);
    };
  };

  const onCreateMessage = async () => {
    if (!isEmpty(newMessage)) {
      let data = {};
      data['contract'] = {id: props.contractId};
      data['content'] = newMessage?.content;

      await MessageService.createMessage(data);
      getMessages(true);
      setNewMessage({});
    };
  };

  const onEditMessage = async () => {
    if (!isEmpty(message?.content)) {
      let data = {};
      data['id'] = message.id;
      data['content'] = message.content;

      await MessageService.editMessage(data);
      getMessages(true);
      setShowEditModal(false);
    };
  };

  const onActivateMessage = async () => {
    await MessageService.activateMessage(filedMessage, 'ACTIVATE');
    getMessages(true, DataType.ALL);
    onListFiled();
  };

  const onDeactivateMessage = async () => {
    if (!isEmpty(message)) {
      await MessageService.activateMessage(message, 'DEACTIVATE');
      getMessages(true, DataType.ALL);
      setShowDotsModal(false);
    };
  };

  const onListFiled = async () => {
    await MessageService.getAllMessages(filedPredicate, modalPage, predicateOperators)
        .then((result) => {
          setFiledMessagesList(result.content);
          setModalPage({
            ...modalPage,
            size: result.size,
            page: result.number,
            totalPages: result.totalPages,
            totalElements: result.totalElements,
            sort: 'incUserDate,desc'
          });
        });
    setShowFiledModal(true);
  };

  return (
      <>
        <div className="contract-message__container">
          <div className="contract-message__container--title">{props.contract?.contractingParty?.name ?? ''}</div>
          <div className="contract-message__container--header">
            <div className="contract-message__container--subtitle"> {t("contractDetail.message.title")}</div>
            <IconButton isAlignCenter width={"133px"} fontSize="14px" height={"40px"} filled color="gray" clickButton={() => handleOpenModal(ModalType.FILED)}>
              <img style={{ marginRight: "10px" }} src={ArchiveImg} />
              {t("global.button.archived")}
            </IconButton>
          </div>
          <div className="contract-message__container--body">
            <div className="contract-message__container--body-table">
              {messagesList?.map((item,index) => (
                  <div className="contract-message__container--body-table-row" key={index}>
                    <div className="row-name">
                      <span>{item?.user?.name?.toUpperCase() ?? ""}</span>
                      {item?.incUserDate ? DateUtils.formatDate(item.incUserDate) : ""}
                    </div>
                    {(!temporaryHideShowText && !forceNewPage) ? (
                        <ShowMoreText
                            lines={3}
                            more={
                              <div className="row-button-second">
                                <IconButton isAlignCenter width={"58px"} fontSize="12px" height={"19px"} clickButton={() => {}}>
                                  {t("global.button.most")}
                                  <img style={{ marginLeft: "10px", transform: "rotate(180deg)" }} src={ArrowImg} />
                                </IconButton>
                              </div>
                            }
                            less={
                              <div className="row-button">
                                <IconButton isAlignCenter width={"68px"} fontSize="12px" height={"19px"} clickButton={() => {}}>
                                  {t("global.button.less")}
                                  <img style={{ marginLeft: "10px" }} src={ArrowImg} />
                                </IconButton>
                              </div>
                            }
                            className={"row-text"}
                            anchorClass="my-anchor-class"
                            onClick={(value) => setIsExpanded({...isExpanded, [index]: value})}
                            expanded={isExpanded[index]}
                            width={0}
                        >
                          {item?.content ?? ""}
                        </ShowMoreText>
                    ) : (
                      <div className="row-text"/>
                    )}
                        
                    <div className="row-dots">
                      <div
                          aria-haspopup="true"
                          className="icon-dots"
                          aria-controls="simple-menu"
                          onClick={({ currentTarget }) => {
                            setMessage(item);
                            setAnchorDots(currentTarget);
                            handleOpenModal(ModalType.DOTS);
                          }} />
                    </div>
                  </div>
              ))}
            </div>
            <Pagination page={page} handleChangePage={handleChangePage}/>
            <Menu className='tooltip-style' anchorEl={anchorDots} keepMounted open={showDotsModal} onClose={() => setShowDotsModal(false)}>
              <MenuItem onClick={() => handleOpenModal(ModalType.EDIT)}>{t('contractDetail.message.tooltip.edit')}</MenuItem>
              {!isEmpty(message?.history) && <MenuItem onClick={(e) => handleOpenModal(ModalType.HISTORY)}>{t('contractDetail.message.tooltip.history')}</MenuItem>}
              <MenuItem onClick={() => onDeactivateMessage()}>{t('contractDetail.message.tooltip.toFile')}</MenuItem>
            </Menu>
          </div>
          <div className="contract-message__container--body-chat">
            <div className="text-container">
              <div className="text-input">
                <TextareaAutosize
                    className="text-area"
                    rowsMin={2}
                    rowsMax={2}
                    style={{backgroundColor: "#ffffff", border: "1px solid #d8d8d8", padding: "10px 50px 10px 13px"}}
                    placeholder={t("contractDetail.request.modal.enterComment")}
                    value={newMessage?.content ?? ''}
                    onChange={(e) => {setNewMessage({...newMessage, content: e.target.value.substring(0, maxCharacters)})}}
                />
                <div className="send-button">
                  <img src={SendImg} alt="send" onClick={() => onCreateMessage()}/>
                </div>
              </div>
            </div>
            <div className="text-counter">
              <span>Caracteres {newMessage?.content?.length ?? 0} de <b>{maxCharacters}</b></span>
            </div>
          </div>
        </div>

        {/* *************************** FILED MESSAGES MODAL ************************************* */}
        <Modal isOpen={showFiledModal} className="contract-message__modal" contentLabel="Example Modal" ariaHideApp={false}>
          <img className="close-img" alt="close" src={CloseImg} onClick={() => {setShowFiledModal(false); setModalPage({...pageDefault});}}/>
          <div className="contract-message__modal--title">{t("contractDetail.message.modal.title")}</div>
          <div className="contract-message__modal--body-wrapper">
            <div className="contract-message__container--body-table">
              {filedMessagesList?.map((item,index) => (
                  <div className="contract-message__container--body-table-row" key={index}>
                    <div className="row-name">
                      <span>{item?.user?.name?.toUpperCase() ?? ""}</span>
                      {item?.incUserDate ? DateUtils.formatDate(item.incUserDate) : ""}
                    </div>
                    <div className="row-text">
                      {item?.content ?? ""}
                    </div>
                    <div className="row-dots">
                      <img src={HistImg} onClick={() => {
                        setFiledMessage(item);
                      }}/>
                    </div>
                  </div>
              ))}
            </div>
            <Pagination page={modalPage} handleChangePage={handleChangeModalPage}/>
          </div>
        </Modal>

        {/* *************************** EDIT MODAL ************************************* */}
        <Modal isOpen={showEditModal} className="contract-message__edit-modal" contentLabel="Example Modal" ariaHideApp={false}>
          <img className="close-img" alt="close" src={CloseImg} onClick={() => setShowEditModal(false)}/>
          <div className="contract-message__edit-modal--title">{t("contractDetail.message.modal.titleSecond")}</div>
          <div className="contract-message__edit-modal--body-wrapper">
            <div className="contract-message__edit-modal--text-input">
              <TextareaAutosize
                  className="text-area"
                  rowsMin={7}
                  rowsMax={7}
                  style={{backgroundColor: "#ffffff", border: "1px solid #e1e2e6", padding: "19px 28px"}}
                  placeholder={t("contractDetail.request.modal.enterComment")}
                  value={message?.content}
                  onChange={(e) => {setMessage({...message, content: e.target.value.substring(0, maxCharacters)})}}
              />
            </div>
            <div className="text-counter">
              <span>Caracteres {message?.content?.length ?? 0} de <b>{maxCharacters}</b></span>
            </div>
          </div>
          <div className="contract-message__edit-modal--buttons">
            <div style={{ marginRight: "12px" }}>
              <IconButton color="white" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => setShowEditModal(false)}>
                <div className="icon-arrow-filled" />
                {t("global.button.return")}
              </IconButton>
            </div>
            <div style={{ marginLeft: "12px" }}>
              <IconButton color="green" isAlignCenter width={"150px"} height={"44px"} fontSize="15px" filled clickButton={() => onEditMessage()}>
                {t("global.button.save")}
              </IconButton>
            </div>
          </div>
        </Modal>

        {/* *************************** VERSION HISTORY MODAL ************************************* */}
        <Modal isOpen={showHistoryModal} className="contract-message__modal" contentLabel="Example Modal" ariaHideApp={false}>
          <img className="close-img" alt="close" src={CloseImg} onClick={() => setShowHistoryModal(false)}/>
          <div className="contract-message__modal--title">{t("contractDetail.message.modal.titleThird")}</div>
          <div style={{ maxHeight: "360px", overflow: "auto", outline: "1px solid #e1e2e6" }}>
            <div className="contract-message__container--body-table">
              {messageHistory?.map((item, index) => (
                  <div key={index} className="contract-message__container--body-table-row">
                    <div className="row-name">
                      <span>{item?.user?.name?.toUpperCase() ?? ""}</span>
                      {item?.incUserDate ? DateUtils.formatDate(item.incUserDate) : ""}
                    </div>
                    <div className="row-text">{item?.content ?? ""}</div>
                  </div>
              ))}
            </div>
          </div>
        </Modal>
      </>
  );
};
export default ContractMessage;
