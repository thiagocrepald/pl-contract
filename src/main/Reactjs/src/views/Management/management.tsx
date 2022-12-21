import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import IconButton from '../../components/icon-button/icon-button';
import MenuPage from '../../components/menu-page/menu-page';
import SearchTextField from '../../components/search-text-field/search-text-field';
import NotificationModal from '../../components/notification-modal/notification-modal';
import { Tab } from '../../model/enums/tabs';
import './management.scss';

const Management: React.FC = () => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [t, _i18n] = useTranslation();
    const [_isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(Tab.COMPANYDATA);
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [showNotifications, setShowNotifications] = useState(false);


    const history = useHistory();

    // CHANGE COLOR FOR THIS PAGE ONLY AND CLEAN-UP WHEN LEAVING THE PAGE
    useLayoutEffect(() => {
        window.document.body.style.background = 'white';
        return () => {
            window.document.body.style.background = '';
        };
    });

    const onChange = () => {
        return '';
    };

    const tabs = [
        { name: t('management.tabs.companyData'), code: Tab.COMPANYDATA },
        { name: t('management.tabs.payments'), code: Tab.PAYMENTS }
    ];

    return (
        <div className='management__container'>
            <div className='management__container--header'>
                <span>{t('management.title.management')}</span>
                <IconButton clickButton={() => setShowNotifications(!showNotifications)}>
                    <div className='notification-img' />
                </IconButton>
            </div>
            {showNotifications && <NotificationModal/>}
            <div className='management__container--body'>
                <div className='management__container--body-menu'>
                    <MenuPage tabs={tabs} activeTab={activeTab} onChange={(activeTab) => setActiveTab(activeTab)} />
                </div>
                <div className='management__container--body-action'>
                    <div style={{ maxWidth: '222px' }}>
                        <SearchTextField id={'search-field'} style={{ marginRight: '10px' }} placeholder='Buscar por' onChange={onChange} />
                    </div>
                    <div style={{ marginLeft: '26px' }}>
                        <IconButton color='green' isAlignCenter width={'170px'} height={'40px'} filled clickButton={() => setIsModalOpen(true)}>
                            <div className='icon-plus'/>
                            {t('management.buttons.company-data')}
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className='management__container--body-table'>
                {activeTab === Tab.COMPANYDATA && history.replace('/admin/management/company-data')}
                {activeTab === Tab.PAYMENTS && history.replace('/admin/management/payments')}
            </div>
        </div>
    );
};

export default Management;
