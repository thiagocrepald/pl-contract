import * as React from 'react';
import './menu-page.scss';

interface Props {
  tabs: { name: string, code: number | string }[],
  activeTab: number | string,
  onChange: (number) => void
};

export class MenuPage extends React.Component<Props> {
  render() {
    const { tabs, activeTab, onChange } = this.props;

    return (
      <div className="menu-page__container">
        {tabs.map((tab, index) => (
          <div key={index} onClick={() => onChange(tab.code)} className="menu-page__container--items" data-active={tab.code === activeTab} >{tab.name}</div>
        ))}
      </div>
    );
  }
}

export default MenuPage;
