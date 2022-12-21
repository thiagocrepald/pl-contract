export interface PredicateOperators {
    [key: string]: {
        value?: any;
        operators?: (ComparisonOperator | LogicalOperator)[];
    }
}

export enum ComparisonOperator {
    EQ = 'eq',
    NE = 'ne',
    CI = 'ci',
    GT = 'gt',
    LT = 'lt',
    LTE = 'lte',
    GTE = 'gte',
    MATCHES = 'matches',
    CONTAINS = 'contains',
    ENDS_WITH = 'endsWith',
    STARTS_WITH = 'startsWith'
}

export enum LogicalOperator {
    OR = 'or',
    AND = 'and',
    NOT = 'not'
}
