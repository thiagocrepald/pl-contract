import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './contract-logs.scss';
import '../../../components/main.scss';
import SearchTextField from '../../../components/search-text-field/search-text-field';
import { Contract } from '../../../model/contract';
import { Pageable } from '../../../model/pageable';
import { LogType } from '../../../model/contract-log-type';
import ContractLogsService from '../../../services/contract-logs-service';
import DateUtils from '../../../util/date-utils';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Pagination, PaginationItem } from '@material-ui/lab';
import dateUtils from '../../../util/date-utils';

interface Props {
    contractId: number;
    contract?: Contract;
}

const ContractLogs = ({ contractId, contract }: Props) => {
    const { t } = useTranslation();
    const [page, setPage] = useState<Pageable>({
        page: 0,
        size: 10
    });
    const [totalPages, setTotalPages] = useState<number>(0);
    const [logList, setLogList] = useState<LogType[]>([]);
    const [searchField, setSearchField] = useState<string>('');

    // CHANGE COLOR FOR THIS PAGE ONLY AND CLEAN-UP WHEN LEAVING THE PAGE
    useLayoutEffect(() => {
        window.document.body.style.background = 'white';

        return () => {
            window.document.body.style.background = '';
        };
    });

    useEffect(() => {
        getLogs();
    }, [searchField, page.page]);

    const getLogs = async () => {
        const predicate = {
            search: searchField
        };

        await ContractLogsService.getLogs(page, predicate, contractId).then(result => {
            setLogList(result.content);
            setTotalPages(Math.ceil(result.total / result.pageable.size));
        });
    };

    const onChangePage = (page: number) => {
        setPage({ page, size: 10 });
    };

    const parseEntityName = (type: any) => {
        const types = {
            id: 'ID',
            adjustedFinalTime: t('contractDetail.logs.types.adjustedFinalTime'),
            adjustedStartTime: t('contractDetail.logs.types.adjustedStartTime'),
            doctorJustification: t('contractDetail.logs.types.doctorJustification'),
            doctorFile: t('contractDetail.logs.types.doctorFile'),
            status: t('contractDetail.logs.types.status'),
            seen: t('contractDetail.logs.types.seen'),
            name: t('contractDetail.logs.types.name'),
            email: t('contractDetail.logs.types.email'),
            startTime: t('contractDetail.logs.types.startTime'),
            endTime: t('contractDetail.logs.types.endTime'),
            accessControl: t('contractDetail.logs.types.accessControl'),
            originator: t('contractDetail.logs.types.originator'),
            initialDoctorLocation: t('contractDetail.logs.types.initialDoctorLocation'),
            doctor: t('contractDetail.logs.types.doctor'),
            onCall: t('contractDetail.logs.types.onCall'),
            contractNumber: t('contractDetail.logs.types.contractNumber'),
            DEFAULT: type
        };

        return types[type] || types.DEFAULT;
    };

    const returnEntityFormattedAccordingToType = (propertie: any) => {
        if (moment(propertie, 'YYYY-MM-DD HH:mm', false).isValid() && propertie.length > 13) {
            return DateUtils.getHourAndMinuteOfDate(propertie);
        }
        
        if (typeof propertie === 'object') {
            return `ID ${propertie.cdoId}`;
        }

        return convertEntityValue(propertie);
    };

    const convertEntityValue = (type: any) => {
        const types = {
            OK: t('contractDetail.logs.types.OK'),
            PENDING: t('contractDetail.logs.types.PENDING'),
            REJECTED: t('contractDetail.logs.types.REJECTED'),
            ADJUSTED: t('contractDetail.logs.types.ADJUSTED'),
            CORRECTION: t('contractDetail.logs.types.CORRECTION'),
            CONTESTED: t('contractDetail.logs.types.CONTESTED'),
            PROGRAMMED: t('contractDetail.logs.types.PROGRAMMED'),
            ATTENDANCE: t('contractDetail.logs.types.ATTENDANCE'),
            ADJUSTED_ADMIN: t('contractDetail.logs.types.ADJUSTED_ADMIN'),
            ADJUSTED_DOCTOR: t('contractDetail.logs.types.ADJUSTED_DOCTOR'),
            NOT_REGISTERED: t('contractDetail.logs.types.NOT_REGISTERED'),
            CANCELED: t('contractDetail.logs.types.CANCELED'),
            ACTIVE: t('contractDetail.logs.types.ACTIVE'),
            INACTIVE: t('contractDetail.logs.types.INACTIVE'),
            PENDECY: t('contractDetail.logs.types.PENDECY'),
            GENERATED: t('contractDetail.logs.types.GENERATED'),
            DEFAULT: type
        };

        return types[type] || types.DEFAULT;
    };

    return (
        <>
            <div className="contract-detail__container--body-group">
                <div className="contract-detail__container--body-title">{contract?.contractingParty?.name ?? ''}</div>
            </div>
            <div className="contract-logs__container">
                <div className="contract-logs__container--title" />
                <div className="contract-logs__container--header">
                    <div className="contract-logs__container--subtitle"> {t('contractDetail.logs.title')}</div>
                    <div style={{ maxWidth: '222px' }}>
                        <SearchTextField onChange={setSearchField} id={'search-field'} placeholder="Buscar por" value={searchField} />
                    </div>
                </div>
                <div className="contract-logs__container--body-table">
                    {logList?.map((item, index) => {
                        if (!isEmpty(item.snapshot?.changedProperties)) {
                            return (
                                <div key={index} className="contract-logs__container--body-table-row">
                                    <div className="row-name">
                                        {`${DateUtils.formatDate(item.snapshot?.commitMetadata?.commitDate)} - ${item.snapshot?.commitMetadata?.author ?? ''}`}
                                    </div>
                                    {item.snapshot?.changedProperties?.map((propertie, indexPropertie) => {
                                        const convertedProperty = parseEntityName(propertie);
                                        const convertedValueProperty = returnEntityFormattedAccordingToType(item.snapshot?.state[propertie] ?? "Vazio");

                                        return (
                                            <div key={`propertie-${indexPropertie}`} className="row-text">
                                                {`${t("contractDetail.logs.table.firstTextField")} ${convertedProperty} ${t("contractDetail.logs.table.secondTextField")} ${convertedValueProperty}`}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }
                    })}
                </div>
                <div className={"pagination-wrapper"}>
                    <Pagination
                        shape="rounded"
                        defaultPage={1}
                        boundaryCount={1}
                        variant="outlined"
                        page={(page.page ?? 0) + 1}
                        count={totalPages || 0}
                        onChange={(event, page) => {
                            onChangePage(page - 1);
                        }}
                        className="pagination-container"
                        renderItem={(itemArgs) => {
                            if (itemArgs.type === "previous" || itemArgs.type === "next") {
                                return <PaginationItem {...itemArgs} />;
                            } else if (itemArgs.page === 1) {
                                return (
                                    <>
                                        <span className={"text-style"}>{"Página "}</span>
                                        <input
                                            className={"input-style"}
                                            value={(page.page ?? 0) + 1}
                                            onChange={(evt) => onChangePage(Math.max(0, Math.min(totalPages || 0, +evt.target.value) - 1))}
                                        />
                                        <span className={"text-style"}>{" de "}</span>
                                        <span className={"text-style"}>{totalPages || 0}</span>
                                    </>
                                );
                            }
                            return null;
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default ContractLogs;
