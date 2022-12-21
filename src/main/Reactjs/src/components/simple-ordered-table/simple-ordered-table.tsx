import {
    createMuiTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter, TableHead,
    TableRow,
    ThemeProvider
} from '@material-ui/core';
import { ptPT } from '@material-ui/core/locale';
import { Pagination, PaginationItem } from '@material-ui/lab';
import React, { Fragment } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Pageable } from '../../model/pageable';
import { ComparisonOperator, LogicalOperator } from '../../model/predicate-operators';
import ClickableIcon from '../clickable-icon/clickable-icon';
import './simple-ordered-table.scss';

interface Props {
    page: Pageable;
    stickyHeader?: boolean;
    disabledRows?: boolean[];
    emptyTableMessage?: string;
    columnNameKeys: ColumnSort[];
    onSort?: (code: string) => void;
    rows?: (string | JSX.Element | number)[][];
    onClickRow?: (index: number) => void;
    onChangePage: (newPage: number) => void;
    handleChangePage?: () => any;
    borderRadius?: boolean;
    border?: boolean;
    canFilter?: boolean;
    totalPages?: number;
    items?: any[];
    utilProp?: string;
    firstCustom?: boolean;
    onFilter?: (e: any, filterCode?: string, translate?: string, operators?: (ComparisonOperator | LogicalOperator)[]) => void;
    footer?: (string | JSX.Element | number);
}

interface State {
    columnNameKeys: ColumnSort[];
}

export interface ColumnSort {
    name?: string;
    sortCode?: string;
    translate?: string;
    icon?: JSX.Element;
    type?: "asc" | "desc";
    sortDisabled?: boolean;
    sortActivated?: boolean;
    operators?: (ComparisonOperator | LogicalOperator)[];
}

export class SimpleOrderedTable extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            columnNameKeys: props.columnNameKeys,
        };
    }

    private renderCells = (row: (string | JSX.Element | number)[], rowKey: string, rowIndex: number): JSX.Element[] => {
        const result: JSX.Element[] = [];
        row.forEach((item: string | JSX.Element | number, index: number) => {
            const style = index === 0 ? "td-first" : index === row.length - 1 ? "td-last" : "";
            if (this.props.firstCustom && index === 0) {
                result.push(
                    <td style={{ width: '20px', height: '50px', padding: '0px', paddingRight: '20px' }} key={`${rowKey}[cell-${index}]`}>
                        {item}
                    </td>
                );
            } else {
                result.push(
                    <TableCell
                        className={style}
                        key={`${rowKey}[cell-${index}]`}
                        onClick={() => {
                            if (this.props.onClickRow && typeof item === "string") {
                                this.props.onClickRow(rowIndex);
                            }
                        }}
                    >
                        {item}
                    </TableCell>
                );
            }
        });

        return result;
    };

    private renderEmptyContentMessage = () => {
        return (
            <TableRow className={"row-container"}>
                <TableCell className={"cell-text item-max-width empty-list-container"}>
                    <span>{'Nenhum resultado encontrado!'}</span>
                </TableCell>
            </TableRow>
        );
    };

    private onSort = (column: ColumnSort) => {
        const columnNameKeys = [...this.state.columnNameKeys];
        const type = column.sortActivated ? (column.type === "asc" ? "desc" : "asc") : "asc";
        const code = `${column.sortCode ?? ""},${type}`;

        columnNameKeys
            .filter((it) => !it.sortDisabled)
            .forEach((it) => {
                if (column.name === it.name) {
                    it.sortActivated = true;
                    it.type = type;
                } else if (column.name !== it.name && it.sortActivated) {
                    it.sortActivated = false;
                }
            });

        if (this.props.onSort) {
            this.setState(
                {
                    columnNameKeys,
                },
                () => this.props.onSort!(code)
            );
        }
    };

    private renderSortHeader = (column: ColumnSort): JSX.Element => {
        const iconSortActivated =
            column.type === "desc" ? require("../../assets/img/svg/flecha-cima.svg") : require("../../assets/img/svg/flecha-baixo.svg");
        return (
            <div style={{ cursor: "pointer" }} onClick={() => (!column.sortDisabled && !column.icon ? this.onSort(column) : null)}>
                {column.name ?? ""}
                {column.icon ?? (this.props.canFilter ? (
                    <div
                        className="icon-filter"
                        style={{ display: "inline-block", marginLeft: "8px", cursor: "pointer" }}
                        onClick={(e) => this.props.onFilter && this.props.onFilter(e, column.sortCode, column.translate, column.operators)}
                    />
                ) : !column.sortDisabled && column.sortActivated ? (
                    <span>
                        <ClickableIcon className="sort-icon" iconPath={iconSortActivated} onClick={() => null} />
                    </span>
                ) : (
                    <span>
                        <ClickableIcon className="sort-default-icon" iconPath={require("../../assets/img/svg/flechas.svg")} onClick={() => null} />
                    </span>
                ))}
            </div>
        );
    };

    private renderPagination = () => {
        return (
            <div className={"pagination-wrapper"}>
                <Pagination
                    shape="rounded"
                    defaultPage={1}
                    boundaryCount={1}
                    variant="outlined"
                    page={(this.props.page.page ?? 0) + 1}
                    count={this.props.totalPages || 0}
                    onChange={(event, page) => {
                        this.props.onChangePage(page - 1)
                    }}
                    className="pagination-container"
                    renderItem={(itemArgs) => {
                        if (itemArgs.type === "previous" || itemArgs.type === "next") {
                            return <PaginationItem {...itemArgs} />;
                        } else if (itemArgs.page === 1) {
                            return (
                                <Fragment>
                                    <span className={"text-style"}>{"Página "}</span>
                                    <input
                                        className={"input-style"}
                                        value={(this.props.page.page ?? 0) + 1}
                                        onChange={(evt) => this.props.onChangePage(Math.max(0, Math.min(this.props.totalPages || 0, +evt.target.value) - 1))}
                                    />
                                    <span className={"text-style"}>{" de "}</span>
                                    <span className={"text-style"}>{this.props.totalPages || 0}</span>
                                </Fragment>
                            );
                        }
                        return null;
                    }}
                />
            </div>
        );
    };

    render() {
        return (
            <ThemeProvider theme={createMuiTheme(ptPT)}>
                <div
                    style={{
                        borderRadius: "5px",
                        border: "1px solid #E1E2E6 ",
                        overflowY: 'auto',
                        overflowX: 'auto',
                    }}
                >
                    <TableContainer className={'table-container-sot'}>
                        <Table aria-label="simple table" className={"table"} stickyHeader={this.props.stickyHeader ?? true}>
                            <TableHead>
                                <TableRow className={"header-container"}>
                                    {this.state.columnNameKeys != null &&
                                        this.state.columnNameKeys.map((column: ColumnSort, index: number) => (
                                            <TableCell key={`column-header-${index}`}>{column.sortDisabled ? column.name ?? "" : this.renderSortHeader(column)}</TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflow: 'scroll'}}>
                                {this.props.rows != null && this.props.rows.length !== 0
                                    ? this.props.rows.map((row: (string | JSX.Element | number)[], index: number) => (
                                        <TableRow
                                            key={`row-${index}`}
                                            className={`row-container${this.props.items && this.props.utilProp ? `--${this.props.items[index][this.props.utilProp]}` : ""}`}
                                            style={{
                                                opacity: this.props.disabledRows && this.props.disabledRows[index] ? "0.5" : "",
                                                boxShadow: this.props.disabledRows && this.props.disabledRows[index] ? "unset" : "",
                                                backgroundColor: this.props.disabledRows && this.props.disabledRows[index] ? "#eeeeee" : "",
                                            }}
                                        >
                                            {this.renderCells(row, `row-${index}`, index)}
                                        </TableRow>
                                    ))
                                    : this.renderEmptyContentMessage()}
                            </TableBody>
                            {this.props.footer != null && this.props.rows != null &&
                                <TableFooter>
                                    <TableRow>
                                        <TableCell style={{ padding: "0" }} colSpan={this.state.columnNameKeys.length}>
                                            {this.props.footer}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            }
                        </Table>
                    </TableContainer>
                </div>
                {this.renderPagination()}
            </ThemeProvider>
        );
    }
}

export default SimpleOrderedTable;
