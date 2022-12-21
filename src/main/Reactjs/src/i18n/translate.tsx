import * as React from 'react';
import { Translation } from 'react-i18next';

export interface ITranslateProps {
  contentKey?: string;
}

export class Translate extends React.Component<ITranslateProps> {
  constructor(props: Readonly<ITranslateProps>) {
    super(props);
  }

  render() {
    if (this.props.contentKey != null) {
      return <Translation>{t => t(String(this.props.contentKey ?? ''))}</Translation>;
    }

    return <p />;
  }
}

export default Translate;
