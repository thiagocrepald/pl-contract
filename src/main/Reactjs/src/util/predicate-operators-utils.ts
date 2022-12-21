import moment, { Moment } from 'moment';
import { isEmpty } from 'lodash';
import { ComparisonOperator, LogicalOperator, PredicateOperators } from '../model/predicate-operators';

export const statusConverter = (value: string) => {
    return {
        value,
        operators: [LogicalOperator.OR, ComparisonOperator.EQ]
    };
};

export const dateConverter = (state: 'start' | 'end', value: Date | string | Moment) => {
    const comparisonOperator = state === 'start' ? ComparisonOperator.GTE : ComparisonOperator.LTE;
    return {
        value: moment(value).toISOString(),
        operators: [LogicalOperator.AND, comparisonOperator]
    };
};

export const defaultConverter = (newFilter: PredicateOperators, key: string) => {
    return {
        value: newFilter[key].value,
        operators: newFilter[key].operators
    };
};

export const convertFilterToOperators = (newFilter: PredicateOperators) => {
    const newPredicateOperators: PredicateOperators[] = [];

    Object.keys(newFilter).forEach(item => {
        switch (item) {
            case 'status':
                Object.keys(newFilter['status'] ?? {}).forEach(statusItem => {
                    if (!newFilter['status']?.[statusItem]) return;
                    newPredicateOperators.push({ status: statusConverter(statusItem) });
                });
                break;

            case 'dates':
                Object.keys(newFilter['dates'] ?? {}).forEach(dateItem => {
                    if (!newFilter['dates']?.[dateItem] || newFilter['dates']?.[dateItem] === 'Invalid date') return;
                    newPredicateOperators.push({ ['onCall.date']: dateConverter(dateItem as 'start' | 'end', newFilter['dates'][dateItem]) });
                });
                break;

            default:
                if (newFilter[item]?.value == null) return;
                newPredicateOperators.push({ [item]: defaultConverter(newFilter, item) });
                break;
        }
    });

    return newPredicateOperators;
};

export const requestPredicateOperatorsFormatter = (predicateOperators?: PredicateOperators[]) => {
    if (predicateOperators == null || isEmpty(predicateOperators)) return '';

    let completePredicate = '';

    predicateOperators.forEach((predicateOperator, index) => {
        Object.keys(predicateOperator).forEach(key => {
            const predicateObject = predicateOperator[key];
            const predicateObjectValue = predicateObject.value ?? '';
            const isLastPredicateItem = (predicateOperators.length - 1) === index;

            let predicate = `${key ?? ''}=`;

            predicateObject.operators?.forEach((operator, operatorIndex) => {
                const isLastItem = (predicateObject.operators!.length - 1) === operatorIndex;
                predicate = predicate.concat(`${operator ?? ''}(`);
                if (isLastItem) predicate = predicate.concat(predicateObjectValue);
            });

            predicateObject.operators?.forEach(() => predicate = predicate.concat(')'));

            if (isEmpty(predicateObject.operators)) predicate = predicate.concat(predicateObjectValue);

            completePredicate = completePredicate.concat(predicate);

            if (!isLastPredicateItem) completePredicate = completePredicate.concat('&');
        })
    });

    return completePredicate;
};
