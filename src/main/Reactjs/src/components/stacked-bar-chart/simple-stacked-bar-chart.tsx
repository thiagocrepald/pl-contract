import { ChartAPI, ChartConfiguration, Data, generate, Primitive, TooltipOptions } from 'c3';
import React from 'react';
import useUID from '../donut-chart/uid-utils';
import { DEFAULT_COLOR_PATTERN } from '../donut-chart/constants';
import './stacked-bar-chart.scss';

export interface BarChartConfiguration<T extends object, K extends keyof T> {
    height: number;
    labelKey: K;
    stackKeys: K[];
    stackLabelFormat?: (value: number) => string;
    colorPatern?: string[];
    hideAxisX?: boolean;
    hideAxisY?: boolean;
    hideGridX?: boolean;
    hideGridY?: boolean;
}

export interface BarChartProps<T extends object, K extends keyof T> {
    data: T[];
    className?: string;
    config: BarChartConfiguration<T, K>;
    children?: (chart: ChartAPI, keys: string[]) => React.ReactNode;
    tooltipOptions?: TooltipOptions;
    barWidth?: number;
}

export const SimpleStackedBarChart = <T extends Record<string, Primitive>, K extends keyof T>(props: BarChartProps<T, K>) => {
    const UID = useUID();

    const [chart, setChart] = React.useState<ChartAPI>({} as ChartAPI);
    const [config] = React.useState<BarChartConfiguration<T, K>>(props.config);
    const [initialData] = React.useState<T[]>(props.data);
    const [hasLoaded, setLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        const chartData: Data = {
            json: initialData,
            type: 'bar',
            keys: {
                x: config.labelKey.toString(),
                value: config.stackKeys.map(it => it.toString())
            },
            groups: [config.stackKeys.map(it => it.toString())]
        };
        const charConfiguration: ChartConfiguration = {
            data: chartData,
            bindto: `#${UID}`,
            size: { height: config.height },
            legend: { hide: true },
            transition: { duration: 400 },
            grid: { y: { show: config.hideGridY??true }},
            tooltip: { ...props.tooltipOptions },
            color: { pattern: config.colorPatern ?? DEFAULT_COLOR_PATTERN },
            axis: {
                x: { type: 'category', tick: { outer: false }, show: config.hideAxisX??true },
                y: { tick: { format: config.stackLabelFormat, outer: false } ,show: config.hideAxisY??true}
            },
            bar: { width: props.barWidth}
        };
        const _chart = generate(charConfiguration);
        setChart(_chart);
        setLoaded(true);
    }, [UID, config, initialData, props.tooltipOptions]);

    React.useEffect(() => {
        if (chart.load) {
            chart.load({
                json: props.data,
                keys: {
                    x: config.labelKey.toString(),
                    value: config.stackKeys.map(it => it.toString())
                }
            });
        }
    }, [props.data, config, chart]);

    const classes: string = ['stacked-bar-chart', props.className].filter(it => !!it).join(' ');

    return (
        <div className={classes}>
            <div id={UID} />
            {props.children &&
                hasLoaded &&
                props.children(
                    chart,
                    props.config.stackKeys.map(it => it.toString())
                )}
        </div>
    );
};
export default SimpleStackedBarChart;
