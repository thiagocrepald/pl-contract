const adjustLabelPosition = (UID: string, positionMap: (value: number) => number) => {
    // selectAll(`#${UID} .c3-chart-arc text`).each(
    //     // https://github.com/d3/d3/issues/2246
    //     // tslint:disable-next-line
    //     function () {
    //         // https://github.com/d3/d3/issues/2246
    //         // tslint:disable-next-line
    //         const label = select();
    //         const positions = label
    //             .attr('transform')
    //             .match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/g)
    //             ?.filter(it => !!it)
    //             .map(it => Number(it))
    //             .filter(it => !isNaN(it));

    //         if (!positions || positions.length !== 2) return;

    //         label.attr('transform', `translate(${positions.map(positionMap).join(',')})`);
    //     }
    // );
}

export const DonutChartUtils = {
    adjustLabelPosition
}
