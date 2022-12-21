import { ChartAPI } from 'c3';
import { select } from 'd3';
import React from 'react';
import useUID from '../donut-chart/uid-utils';
import './chart-legend.scss';

export interface CustomChartLegendProps {
    chart: ChartAPI;
    keys: string[];
    formatKey: (key: string) => string;
    textColor?: string;
}

export const CustomChartLegend = (props: CustomChartLegendProps) => {
    const { chart, keys, formatKey } = props;
    const UID = useUID();
    React.useEffect(() => {
        select(`.chart-legend-${UID}`)
            .insert('div', '.chart')
            .attr('class', 'legend')
            .selectAll('span')
            .data(keys)
            .enter()
            .append('span')

            .html(
                id =>
                    `<div class="chart-legend--items">
                        <div class="chart-legend--items-color" style="background-color:${chart.color(id)}"/>
                        <div class="chart-legend--items-text" style="color:${props.textColor}">${formatKey ? formatKey(id) : id}</div>
                    </div>`
            )
            .attr('data-id', id => id)
            .on('mouseover', id => chart.focus(id))
            .on('mouseout', () => chart.revert())
            .on('click', id => chart.toggle(id))
            .exit()
            .remove();
            
            return () => {
                select(`.chart-legend-${UID} .legend`)
                .remove()
            }
    }, [chart, UID, formatKey, keys]);

    return <div className={`chart-legend chart-legend-${UID}`} />;
};

export default CustomChartLegend;
