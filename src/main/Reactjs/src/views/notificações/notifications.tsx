/* eslint-disable  @typescript-eslint/no-unused-vars */
import { makeStyles } from '@material-ui/core';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import moment from 'moment';
import {APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT} from '../../config/constants';
import {useHistory} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationService from '../../services/notification.service';
import RightImg from '../../assets/img/svg/arrow-right.svg';
import Footer from '../../components/footer/footer';
import {INotifications} from '../../model/notifications';
import '../Relatorios/admin-report/styles.scss';
import '../Relatorios/import-report.scss';
import './notifications.scss';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

const NotificationScreen = () => {
    const { t, i18n } = useTranslation();

    const history = useHistory();

    // CHANGE COLOR FOR THIS PAGE ONLY AND CLEAN-UP WHEN LEAVING THE PAGE
    useLayoutEffect(() => {
        window.document.body.style.background = 'white';

        return () => {
            window.document.body.style.background = '';
        };
    });

    const [notifications, setNotifications] = useState<INotifications>();
    const [selectedNotification, setSelectedNotification] = useState<number>();
    
    useEffect(() => {
        getNotifications();
    }, [selectedNotification]);

    const getNotifications = () => {
        NotificationService.getAllNotifications().then(result => setNotifications(result));
    }

    const handleSeenNotification = (id, wasSeen) =>{
        if(!wasSeen){
            NotificationService.seenNotification(id);
        }
        setSelectedNotification(id);
    }

    const handleNotificationButton = (id) => {
        history.push('/admin/contract-detail/1/control');
    }

    const translateDate = (dateTime) => {
        const offset = moment().utcOffset();
        const newDateTime = moment.utc(dateTime).utcOffset(dateTime).format(APP_DATE_FORMAT);
        const today = moment().format(APP_LOCAL_DATE_FORMAT);

        if(newDateTime === today){
            return t("notification.today");
        }

        return `${newDateTime}`;
    }

    return (
        <>
            <div className='notifications__container'>
                <div className='notifications__container--header'>
                    <div className='notifications__container--header-title'>{t('notification.title')}</div>
                </div>
                <div className='content'>
                    <div className='content-left'>
                        {!notifications?.empty && notifications?.content?.map(item => (
                            <div key={item.id} className='notifications__container--line' onClick={() => handleSeenNotification(item.id, item.seen)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                        {!item.seen && <div className='notification-active' />}
                                        <div style={{ textAlign: 'left' }}>
                                            <div className='notification-title'>{item?.title}</div>
                                            <div className='notification-description'>{item?.message}</div>
                                        </div>
                                    </div>
                                    <div className='notification-date'>{translateDate(item?.incUserDate)}</div>
                                </div>
                            </div> 
                        ))}                        
                    </div>
                    <div className='content-right notifications__container--messages'>
                        {/* <div className='notifications__container--messages-title'>{t('notification.subtitle')}</div> */}
                        {selectedNotification && notifications?.content?.map(item => (
                            item.id === selectedNotification && (
                                <div key={item.id} className='notifications__container--messages-background'>
                                    <div className='triangle-img' />
                                    <div className='notifications__container--messages-text'>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div className='notifications__container--messages-text-title'>{item?.title}</div>
                                            <div className='notifications__container--messages-text-date'>{translateDate(item?.incUserDate)}</div>
                                        </div>
                                        <div>
                                            {item?.message}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                            <button onClick={() => handleNotificationButton(item.id)}>
                                                {t('notification.button')}
                                                <img src={RightImg} />
                                            </button>
                                            {/* <div className='notifications__container--messages-info'>Contrato X</div> */}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}  
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};
/* eslint-enable  @typescript-eslint/no-unused-vars */
export default NotificationScreen;

