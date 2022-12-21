import { DataPoint, TooltipOptions } from 'c3';
import React from 'react';
import './chart-tooltip.scss';

export interface UngroupedChartToolTipProps {
    className?: string;
    customize: (id: string, value: number, color: unknown) => string;
    children: (t: TooltipOptions) => React.ReactNode;
}

const buildToolTip = (
    data: DataPoint[],
    color: (...args: unknown[]) => unknown,
    customize: (id: string, value: number, color: unknown) => string,
    className?: string
): string => {
    const item = data[0];
    return `<div class="tooltip-chart ${className ?? ''}">${customize(item.id, item.value, color(item))}</div>`;
};

export const UngroupedChartTooTip = (props: UngroupedChartToolTipProps) => {
    const tooltip: TooltipOptions = {
        grouped: false,
        contents: (d, _x, _y, c) => buildToolTip(d, c, props.customize, props.className)
    };

    return <>{props.children(tooltip)}</>;
};

export default UngroupedChartTooTip;
