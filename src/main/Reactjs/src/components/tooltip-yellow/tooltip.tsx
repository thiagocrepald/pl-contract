import React from 'react';
import { useTranslation } from 'react-i18next';
import './tooltip.scss';
import FecharImg from '../../assets/img/svg/fechar-tooltip.svg';

const TooltipYellow = ({show, setShow}) => {
  const { t } = useTranslation();

  return (
    <>
      {show && 
        <div className="yellow-tooltip__container" >
          <div className="yellow-tooltip__container--text">
            {t("global.tooltip.filter")}
            <img className="fechar-img" src={FecharImg} alt=" " onClick={() => setShow(!show)}/>
            <div className="triangle-yellow" />
          </div>
        </div>
      }
    </>
  );
};
export default TooltipYellow;
