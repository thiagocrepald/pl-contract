import React from 'react';
import { useTranslation } from 'react-i18next';
import './progress-spinner.scss';
 
const ProgressSpinner = () => { 
  const { t } = useTranslation();

  return (
    <figure className='progress__spinner'>
      <img alt='loading' src={require('../../assets/img/png/spinner.png')} className='progress__spinner--img' />
      <figcaption className='progress__spinner--description'>{t("report.import.spinner.text")}</figcaption>
    </figure>
  );
}

export default ProgressSpinner;
