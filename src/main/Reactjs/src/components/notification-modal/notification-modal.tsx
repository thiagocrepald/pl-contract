import React, {useState, useEffect } from 'react';
import moment from 'moment';
import {APP_LOCAL_DATE_FORMAT} from '../../config/constants';
import { useTranslation } from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {INotifications} from '../../model/notifications';
import NotificationService from '../../services/notification.service';
import './notification-modal.scss';
import { ClipLoader } from 'react-spinners';
import RightImg from '../../assets/img/svg/arrow-right.svg';

const NotificationModal = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [notifications, setNotifications] = useState<INotifications>();
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
      NotificationService.getAllNotifications().then(result => {
        setNotifications(result);
        setIsLoading(false);
      });
  }

  const translateDate = (date) => {
    const offset = moment().utcOffset();
    const newDate = moment.utc(date).utcOffset(date).format(APP_LOCAL_DATE_FORMAT);
    const today = moment().format(APP_LOCAL_DATE_FORMAT);

    if(newDate === today){
        return t("notification.today");
    }

    return newDate;
  }

  return (
    <>
      <div className="notification__container">
        <div className="notification__container--items">
          <div className="triangle-img" />
          <div className="notification__container--items-title">
            {t("notification.title")}
            <button onClick={() => history.push('/admin/notifications')}>
              {t("notification.buttonSecond")}
              <img src={RightImg} />
            </button>
          </div>
        </div>
        <div className="notification__container--items-body">
        {isLoading && <ClipLoader sizeUnit={'px'} size={50} color={'#009776'} loading={isLoading} />}
        {!notifications?.empty && notifications?.content?.map(item => (
          <div key={item.id} className="notification__container--line" onClick={() => history.push('/admin/notifications')}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
              {!item.seen && <div className='notification-active' />}
                <div style={{ textAlign: "left" }}>
                  <div className="notification-title">{item.title}</div>
                  <div className="notification-description">{item.message}</div>
                </div>
              </div>
              <div className="notification-date">{translateDate(item?.incUserDate)}</div>
            </div>
          </div>
        ))}
        </div>        
      </div>
    </>
  );
};
export default NotificationModal;
