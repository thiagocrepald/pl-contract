import React, { useEffect, useState } from 'react';
import MenuPage from '../../components/menu-page/menu-page';
import Footer from '../../components/footer/footer';
import NotificationModal from '../../components/notification-modal/notification-modal';
import IconButton from '../../components/icon-button/icon-button';
import { useTranslation } from 'react-i18next';
import NotificationImg from '../../assets/img/svg/notificaçao.svg';
import './contract-detail.scss';
import './../../components/main.scss';
import ContractData from './contact-detail/contract-data';
import ContractBase from './contact-detail/contract-base';
import ContractControl from './contact-detail/contract-control';
import ContractRequest from './contact-detail/contract-request';
import { Route, Switch, useHistory } from 'react-router-dom';
import ContractService from '../../services/contract-service';
import { Contract } from '../../model/contract';
import ContractCost from '../../views/Contrato/contact-detail/contract-cost';
import ContractMessage from './contact-detail/contract-message';
import ContractLogs from '../../views/Contrato/contact-detail/contract-logs';

const ContractDetail = ({ match }) => {
  const { t } = useTranslation();
  const tabs = [
    { name: t("contractDetail.header.data"), code: '' },
    { name: t("contractDetail.header.base"), code: '/base' },
    { name: t("contractDetail.header.control"), code: '/control' },
    { name: t("contractDetail.header.request"), code: '/request' },
    { name: t("contractDetail.header.cost"), code: '/costs' },
    { name: t("contractDetail.header.message"), code: '/messages' },
    { name: t("contractDetail.header.logs"), code: '/logs' },
  ];

  const getCurrentTab = () => {
    let currentTab = '';
    tabs.forEach(tab => {
      if (window.location.href.indexOf(tab.code) !== -1) currentTab = tab.code;
    });
    return currentTab;
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());
  const [contract, setContract] = useState<Contract>({});

  const [showNotifications, setShowNotifications] = useState(false);

  const history = useHistory();

  const handleChangeMenuTable = (code: any) => {
    setActiveTab(code);
    history.push(`${match.url}${code}`);
  }

  useEffect(() => {
    getContract(match.params.id);
  }, []);

  const getContract = (id: number) => {
    ContractService.getContract(id).then(result => setContract(result));
  }

  return (
      <div className="contract-detail__container">
        <div className="contract-detail__container--header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="back-button" onClick={() => history.push("/admin/contracts")}>
                <div className="arrow-white" />
              </div>
              <div className="contract-detail__container--header-title">{t("contractDetail.header.title")}</div>
            </div>
            <img className="notification-img" src={NotificationImg} alt="" onClick={() => setShowNotifications(!showNotifications)}/>
          </div>
          <div className="contract-detail__container--body-menu">
            <MenuPage tabs={tabs} activeTab={activeTab} onChange={handleChangeMenuTable} />
          </div>
        </div>
        {showNotifications && <NotificationModal/>}
        <div className="contract-detail__container--body">
          <Switch>
            <Route exact path={`${match.url}`} component={() => <ContractData contractId={match.params.id} />} />
            <Route path={`${match.url}/base`} component={() => <ContractBase contractId={match.params.id} contract={contract} />} />
            <Route path={`${match.url}/control`} component={() => <ContractControl contractId={match.params.id} contract={contract} />} />
            <Route path={`${match.url}/control/doctor/:id`} component={() => <ContractControl contractId={match.params.id} contract={contract} />} />
            <Route path={`${match.url}/request`} component={() => <ContractRequest contractId={match.params.id} contract={contract} />} />
            <Route path={`${match.url}/costs`} component={() => <ContractCost contractId={match.params.id} contract={contract} />} />
            <Route path={`${match.url}/messages`} render={() => <ContractMessage contractId={match.params.id} contract={contract}/>} />
            <Route path={`${match.url}/logs`} component={() => <ContractLogs contractId={match.params.id} contract={contract} />}/>
          </Switch>
        </div>
        <Footer />
      </div>
  );
};
export default ContractDetail;
