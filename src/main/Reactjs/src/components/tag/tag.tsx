import React, { CSSProperties } from 'react';
import './tag.scss';

interface Props {
  color: string;
  children: Node;
  className?: string;
  background?: string;
  styles?: CSSProperties;
}

export class Tags extends React.Component<Props> {
  render() {
    const { children, color, background, className, styles } = this.props;
    return (
        <div style={{ color, ...styles }} className="tag__container">
          <span style={{ background }} className={className}>{children}</span>
        </div>
    );
  }
}

export default Tags;
