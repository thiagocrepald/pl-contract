import { AxesOptions, ChartAPI, ChartConfiguration, Data, generate, Primitive, TooltipOptions } from 'c3';
import React from 'react';
import useUID from './uid-utils';
import { DEFAULT_COLOR_PATTERN } from './constants';
import { DonutChartUtils } from './donut-chart-utils';
import './donut-chart.scss';

export interface BarChartConfiguration<T extends object, K extends keyof T> {
    height: number;
    width?: number;
    labelKey: K;
    categoriesKeys: K[];
    categoryLabelFormat?: (value: number) => string;
    colorPatern?: string[];
    title?: string[];
    donutWidth: number;
    donutLabelPositionAdjust: number;
}

export interface SimpleDonutChartProps<T extends object, K extends keyof T> {
    data: T[];
    className?: string;
    config: BarChartConfiguration<T, K>;
    children?: (chart: ChartAPI, keys: string[]) => React.ReactNode;
    tooltipOptions?: TooltipOptions;
    title?: string;
}

export const SimpleDonutChart = <T extends Record<string, Primitive>, K extends keyof T>(props: SimpleDonutChartProps<T, K>) => {
    const UID = useUID();

    const [chart, setChart] = React.useState<ChartAPI>({} as ChartAPI);
    const [config] = React.useState<BarChartConfiguration<T, K>>(props.config);
    const [initialData] = React.useState<T[]>(props.data);
    const [hasLoaded, setLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        const chartData: Data = {
            json: initialData,
            type: 'donut',
            keys: {
                x: config.labelKey.toString(),
                value: config.categoriesKeys.map(it => it.toString())
            }
        };

        const axesConfig: AxesOptions = {
            x: { type: 'category', tick: { outer: false } },
            y: { tick: { format: config.categoryLabelFormat, outer: false } }
        };

        const handleRendered = () => {
            DonutChartUtils.adjustLabelPosition(UID, it => it * config.donutLabelPositionAdjust);
        };

        const charConfiguration: ChartConfiguration = {
            data: chartData,
            bindto: `#${UID}`,
            size: { height: config.height, width: config.width },
            legend: { hide: true },
            transition: { duration: 400 },
            grid: { y: { show: true } },
            color: { pattern: config.colorPatern ?? DEFAULT_COLOR_PATTERN },
            tooltip: { ...props.tooltipOptions },
            donut: { expand: true, width: config.donutWidth, title: props.title },
            axis: axesConfig,
            onrendered: handleRendered
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
                    value: config.categoriesKeys.map(it => it.toString())
                }
            });
        }
    }, [props.data, config, chart]);

    const classes: string = ['donut-chart', props.className].filter(it => !!it).join(' ');

    return (
        <div className={classes}>
            <div id={UID} />
            {props.children &&
                hasLoaded &&
                props.children(
                    chart,
                    props.config.categoriesKeys.map(it => it.toString())
                )}
        </div>
    );
};
export default SimpleDonutChart;
