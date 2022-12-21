import { AxesOptions, ChartAPI, ChartConfiguration, Data, generate, Primitive, TooltipOptions } from 'c3';
import React from 'react';
import useUID from '../donut-chart/uid-utils';
import { DEFAULT_COLOR_PATTERN } from '../donut-chart/constants';
import './horizontal-bar-chart.scss';

export interface BarChartConfiguration<T extends object, K extends keyof T> {
    height: number;
    labelKey: K;
    stackKeys: K[];
    stackLabelFormat?: (value: number) => string;
    colorPatern?: string[];
    textColorY?: string;
    textColorX?: string;
    dataColorFunction?: (color: string, datum: any) => string;
    customStyle?: string;
}

export interface SimpleHorizontalBarChartProps<T extends object, K extends keyof T> {
    data: T[];
    className?: string;
    config: BarChartConfiguration<T, K>;
    children?: (chart: ChartAPI, keys: string[]) => React.ReactNode;
    tooltipOptions?: TooltipOptions;
}

export const SimpleHorizontalBarChart = <T extends Record<string, Primitive>, K extends keyof T>(
    props: SimpleHorizontalBarChartProps<T, K>
) => {
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
            groups: [config.stackKeys.map(it => it.toString())],
            order: null,
            color: props.config.dataColorFunction,
        };
        const axesConfig: AxesOptions = {
            rotated: true,
            x: { type: 'category', tick: { outer: false } },
            y: {
                tick: {
                    format: config.stackLabelFormat,
                    outer: false
                }
            }
        };

        const charConfiguration: ChartConfiguration = {
            data: chartData,
            bindto: `#${UID}`,
            size: { height: config.height },
            legend: { hide: true },
            transition: { duration: 400 },
            grid: { y: { show: false } },
            color: { pattern: config.colorPatern ?? DEFAULT_COLOR_PATTERN },
            tooltip: { ...props.tooltipOptions },
            axis: axesConfig
        };
        const _chart = generate(charConfiguration);
        setLoaded(true);
        setChart(_chart);
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

    const classes: string = ['horizontal-bar-chart', props.className].filter(it => !!it).join(' ');

    return (
        <div className={classes}>
            <style>
                #{UID} .c3-axis-x text {'{'}
                    fill: {props.config.textColorX};
                {'}'}
                #{UID} .c3-axis-y text {'{'}
                    fill: {props.config.textColorY};
                {'}'}

                #{UID} {props.config.customStyle}
            </style>
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
export default SimpleHorizontalBarChart;
