import { DataPoint, TooltipOptions } from 'c3';
import React from 'react';
import './chart-tooltip.scss';

export interface ChartGroupData {
    id: string;
    value: number;
    color: unknown;
}

export interface GroupedChartToolTipProps {
    className?: string;
    customize: (data: ChartGroupData[]) => string;
    children: (t: TooltipOptions) => React.ReactNode;
}

const buildToolTip = (
    data: DataPoint[],
    color: (...args: unknown[]) => unknown,
    customize: (data: ChartGroupData[]) => string,
    className?: string
): string => {
    const itens: ChartGroupData[] = data.map(it => {
        const item: ChartGroupData = { id: it.id, value: it.value, color: color(it) };
        return item;
    });
    return `<div class="tooltip-chart ${className ?? ''}">${customize(itens)}</div>`;
};

export const GroupedChartToolTip = (props: GroupedChartToolTipProps) => {
    const tooltip: TooltipOptions = {
        grouped: true,
        contents: (d, _x, _y, c) => buildToolTip(d, c, props.customize, props.className)
    };

    return <>{props.children(tooltip)}</>;
};

export default GroupedChartToolTip;
