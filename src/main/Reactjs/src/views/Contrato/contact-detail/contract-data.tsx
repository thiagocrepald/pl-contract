import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import IconButton from '../../../components/icon-button/icon-button';
import { useTranslation } from 'react-i18next';
import '../contract-detail.scss';
import '../../../components/main.scss';
import { Col, Row } from 'react-bootstrap';
import SimpleDonutChart from '../../../components/donut-chart/simple-donut-chart';
import SimpleStackedBarChart from '../../../components/stacked-bar-chart/simple-stacked-bar-chart';
import GroupedChartToolTip, { ChartGroupData } from '../../../components/chart-tooltip/grouped-chart-tooltip';
import UngroupedChartTooTip from '../../../components/chart-tooltip/ungrouped-chart-tooltip';
import CustomChartLegend from '../../../components/chart-legend/custom-chart-legend';
import moment from 'moment';
import { maskCnpj, maskZipCode } from '../../../util/mask-utils';
import ContractService from '../../../services/contract-service';
import { Contract } from '../../../model/contract';
import _ from 'lodash';
import StringUtils from '../../../util/string-utils';
import ShowFileContainer from '../../../components/download-container/download-container';
import { Document } from '../../../model/document';
import { ContractState } from '../../../model/enums/contract-state';
import AuthUtils from '../../../util/auth-utils';
import { Workplace } from '../../../model/workplace';

const formatLabel = (x) => {
    return `R$ ${x}`;
};

const customizeUngroupedToolTip = (id, value, color) => {
    return `
  <div style="display: flex; align-items: center">
      <div style="background-color:${color}; width: 10px; height: 10px; display: inline-block; margin-right: 5px"></div>
      <b style="font-size: 10px">${id}</b>
  </div>
  <hr style="margin: 5px 0" />
  <b>${value}</b>`;
};

const customizeGroupedToolTip = (itens: ChartGroupData[]) => {
    const buildItem = (item: ChartGroupData) => `
      <div>
          <div style="background-color:${item.color}; width: 10px; height: 10px; display: inline-block; margin-right: 5px"></div>
          <b style="font-size: 10px">${item.id}</b>
          ${item.value}
      </div>`;

    return `
  <div style="display: flex; align-items: center; flex-direction: column;">
      ${itens.map(buildItem)}
  </div>`;
};

interface Props {
    contractId: number;
}

const ContractData = ({ contractId }: Props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch("/admin/contract-detail/:id");
    const [contract, setContract] = useState<Contract>({});

    const [chartData, setChartData] = useState([
        { month: "abr", value: 10, base: 0, date: "25/08", amount: 0, diff: 1000 },
        { month: "mai", value: 50, base: 0, date: "24/08", amount: 0, diff: 1000 },
        { month: "jun", value: 40, base: 0, date: "23/08", amount: 0, diff: 1000 },
        { month: "jul", value: 88, base: 0, date: "22/08", amount: 0, diff: 1000 },
        { month: "ago", value: 28, base: 0, date: "21/08", amount: 0, diff: 1000 },
        { month: "set", value: 83, base: 0, date: "18/08", amount: 0, diff: 1000 },
        { month: "out", value: 22, base: 0, date: "17/08", amount: 0, diff: 1000 },
        { month: "nov", value: 28, base: 0, date: "16/08", amount: 0, diff: 1000 },
        { month: "dez", value: 68, base: 0, date: "15/08", amount: 0, diff: 1000 },
        { month: "jan", value: 21, base: 0, date: "14/08", amount: 0, diff: 1000 },
    ]);

    useEffect(() => {
        const id = match?.params?.['id'];

        getContract(id);

    }, []);

    const getContract = (id: number) => {
        ContractService.getContract(id).then(result => {
            const contract: Contract = {
                ...result,
                exitDelayTolerance: StringUtils.convertDuration(result.exitDelayTolerance),
                entryDelayTolerance: StringUtils.convertDuration(result.entryDelayTolerance),
                integralDelayTolerance: StringUtils.convertDuration(result.integralDelayTolerance)
            };
            setContract(contract);
        });
    };

    const maskPrice = (price) => {
        return price?.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const renderWorkplaceItem = (workplace: Workplace) => {
        return workplace?.workplaceItems?.map(it => (
            <>
                <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.place.titleItem")}</div>
                <div className="contract-detail__container--body-date-fields">
                    <div className="multiple-questions">
                        <Row>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.item")}</div>
                                <div className="body-fields--answer">{it.item ?? ""}</div>
                            </Col>
                            <Col md="4">
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.object")}</div>
                                <div className="body-fields--answer">{it.object ?? ""}</div>
                            </Col>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.amount")}</div>
                                <div className="body-fields--answer">{it.quantity ?? ""}</div>
                            </Col>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.receivableValue")}</div>
                                <div className="body-fields--answer">{maskPrice(it.receivableAmount) ?? ""}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.paymentRpaAmount")}</div>
                                <div className="body-fields--answer">{maskPrice(it.paymentRpaAmount) ?? ""}</div>
                            </Col>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.paymentPjAmount")}</div>
                                <div className="body-fields--answer">{maskPrice(it.paymentPjAmount) ?? ""}</div>
                            </Col>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.paymentValue")}</div>
                                <div className="body-fields--answer">{maskPrice(it.payablePartnerAmount) ?? ""}</div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </>
        ));
    };

    const renderWorkplaces = () => {
        return contract?.workplaces?.map(it => (
            <>
                <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.place.title")}</div>
                <div className="contract-detail__container--body-date-fields">
                    <div className="multiple-questions">
                        <Row>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.name")}</div>
                                <div className="body-fields--answer">{it.unitName ?? ""}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.address")}</div>
                                <div className="body-fields--answer">{it.address?.street ?? ""}</div>
                            </Col>
                            <Col md="3">
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.number")}</div>
                                <div className="body-fields--answer">{it.address?.number ?? ""}</div>
                            </Col>
                            <Col md="3">
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.cep")}</div>
                                <div className="body-fields--answer">{maskZipCode(it.address?.zipcode! ?? "")}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.type")}</div>
                                <div className="body-fields--answer">{it.serviceType?.description ?? ""}</div>
                            </Col>
                            <Col>
                                <div className="body-fields--question"> {t("contractDetail.data.place.textField.value")}</div>
                                <div className="body-fields--answer">{maskPrice(it.discountAmount) ?? ""}</div>
                            </Col>
                        </Row>
                        {renderWorkplaceItem(it)}
                    </div>
                </div>
            </>
        ));
    };

    const renderAdditives = () => {
        return contract?.additives?.map((it, index) => (
            <div key={index} className="multiple-questions">
                <Row>
                    <Col md="3">
                        <div className="body-fields--question"> {t("contractDetail.data.additive.contractAdditive")}</div>
                        <div className="body-fields--answer">{it.contractAdditive ?? ""}</div>
                    </Col>
                    <Col md="2">
                        <div className="body-fields--question"> {t("contractDetail.data.additive.additiveTerm")}</div>
                        <div className="body-fields--answer">{it.additiveTerm ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.additive.startDate")}</div>
                        <div className="body-fields--answer">{it?.startDate ? moment(it?.startDate, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.additive.realFinalDate")}</div>
                        <div className="body-fields--answer">{it?.startDate ? moment(it?.startDate, "YYYY/MM/DD").add(it?.additiveTerm ?? 0, 'day').format("DD/MM/YYYY") : ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.additive.attach")}</div>
                        <div className="body-fields--answer">
                            <ShowFileContainer<Document> item={it.attachment}>
                                <div className="icon-attach" />
                                <span>{`${it.attachment?.fileName ?? ''}`}</span>
                            </ShowFileContainer>
                        </div>
                        {/* <div className="body-fields--answer">{it?.startDate ? moment(it?.startDate, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div> */}
                    </Col>
                </Row>
            </div>
        ));
    };

    const renderCoordinatingDoctors = () => {
        return contract?.coordinatingDoctors?.map((it, index) => (
            <div key={index} className="multiple-questions">
                <Row>
                    <Col md="3">
                        <div className="body-fields--question"> {t("contractDetail.data.coordinatingDoctors.textField.name")}</div>
                        <div className="body-fields--answer">{it.doctor?.name ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.coordinatingDoctors.textField.hours")}</div>
                        <div className="body-fields--answer">{it.minimumHours ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.coordinatingDoctors.textField.hourValue") ?? ""}</div>
                        <div className="body-fields--answer">{maskPrice(it.hourValueAmount)}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.coordinatingDoctors.textField.fixedValue") ?? ""}</div>
                        <div className="body-fields--answer">{maskPrice(it.fixedValueAmount)}</div>
                    </Col>
                </Row>
            </div>
        ));
    };

    const renderDelays = () =>
        <div className="multiple-questions">
            <Row>
                <Col md="3">
                    <div className="body-fields--question"> {t("contractDetail.data.delays.entry")}</div>
                    <div className="body-fields--answer">{contract.entryDelayTolerance ?? ""}</div>
                </Col>
                <Col>
                    <div className="body-fields--question"> {t("contractDetail.data.delays.exit")}</div>
                    <div className="body-fields--answer">{contract?.exitDelayTolerance ?? ""}</div>
                </Col>
                <Col>
                    <div className="body-fields--question"> {t("contractDetail.data.delays.integral")}</div>
                    <div className="body-fields--answer">{contract?.integralDelayTolerance ?? ""}</div>
                </Col>
            </Row>
        </div>


    const renderAuthorizedDoctors = () => {
        return _.sortBy(contract?.contractDoctorLocks ?? [], 'doctor.name').map(it => <span>{it.doctor?.name ?? ''}</span>);
    };


    const body = (
        <div className="contract-detail__container--body-date">
            <div className="contract-detail__container--body-date-title" />
            <div className="contract-detail__container--body-date-fields">
                <Row>
                    <Col md="3">
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.contractNumber")}</div>
                        <div className="body-fields--answer">{contract?.contractNumber ?? ""}</div>
                    </Col>
                    <Col md="3">
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.startDate")}</div>
                        <div className="body-fields--answer">{contract?.startDate ? moment(contract?.startDate, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.finalDate")}</div>
                        <div className="body-fields--answer">{contract?.endDate ? moment(contract?.endDate, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.realFinalDate")}</div>
                        <div className="body-fields--answer">{contract?.contractEndTerm ? moment(contract?.contractEndTerm, "YYYY/MM/DD").format("DD/MM/YYYY") : ""}</div>
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.resultsCenter")}</div>
                        <div className="body-fields--answer">{contract?.resultsCenter?.toUpperCase() ?? ""}</div>
                    </Col>
                    <Col md="2">
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.code")}</div>
                        <div className="body-fields--answer">{contract?.sankhyaCode ?? ""}</div>
                    </Col>
                    <Col md="3">
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.paymentDate")}</div>
                        <div className="body-fields--answer">{contract?.datePaymentPayroll ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.receipt")}</div>
                        <div className="body-fields--answer">{contract?.deadlineReceipt ?? ""}</div>
                    </Col>
                </Row>
                
                <Row>
                    <Col md="4">
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.bidding")}</div>
                        <div className="body-fields--answer">{contract?.biddingReference ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.process")}</div>
                        <div className="body-fields--answer">{contract?.administrativeProcess ?? ""}</div>
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.guarantee")}</div>
                        <div className="body-fields--answer">{contract?.contractualGuarantee ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.readjustment")}</div>
                        <div className="body-fields--answer">{contract?.readjustmentIndex ?? ""}</div>
                    </Col>
                </Row>

                <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.generalData.textField.contractor")}</div>
                <Row>
                    <Col>
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.name")}</div>
                        <div className="body-fields--answer">{contract?.contractingParty?.name ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.cnpj")}</div>
                        <div className="body-fields--answer">{maskCnpj(contract?.contractingParty?.cnpj!) ?? ""}</div>
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.address")}</div>
                        <div className="body-fields--answer">{contract?.contractingParty?.address?.street ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.number")}</div>
                        <div className="body-fields--answer">{contract?.contractingParty?.address?.number ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.cep")}</div>
                        <div className="body-fields--answer">{maskZipCode(contract?.contractingParty?.address?.zipcode!) ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.city")}</div>
                        <div className="body-fields--answer">{contract?.contractingParty?.address?.city?.name ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.state")}</div>
                        <div className="body-fields--answer">{contract?.contractingParty?.address?.city?.state?.name ?? ""}</div>
                    </Col>
                </Row>

                <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.generalData.textField.hired")}</div>
                <Row>
                    <Col>
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.name")}</div>
                        <div className="body-fields--answer">{contract?.hired?.name ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.cnpj")}</div>
                        <div className="body-fields--answer">{maskCnpj(contract?.hired?.cnpj!) ?? ""}</div>
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                        <div className="body-fields--question">{t("contractDetail.data.generalData.textField.address")}</div>
                        <div className="body-fields--answer">{contract?.hired?.address?.street ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.number")}</div>
                        <div className="body-fields--answer">{contract?.hired?.address?.number ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.cep")}</div>
                        <div className="body-fields--answer">{maskZipCode(contract?.hired?.address?.zipcode!) ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.city")}</div>
                        <div className="body-fields--answer">{contract?.hired?.address?.city?.name ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.generalData.textField.state")}</div>
                        <div className="body-fields--answer">{contract?.hired?.address?.city?.state?.name ?? ""}</div>
                    </Col>
                </Row>
            </div>
            {renderWorkplaces()}
            <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.additive.title")}</div>
            <div className="contract-detail__container--body-date-fields">
                {renderAdditives()}
            </div>
            <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.responsible.title")}</div>
            <div className="contract-detail__container--body-date-fields">
                <Row>
                    <Col md="4">
                        <div className="body-fields--question"> {t("contractDetail.data.responsible.textField.responsibleAcess")}</div>
                        <div className="body-fields--answer">{contract?.responsibleAccessUser?.name ?? ""}</div>
                    </Col>
                    <Col>
                        <div className="body-fields--question"> {t("contractDetail.data.responsible.textField.responsibleClosing")}</div>
                        <div className="body-fields--answer">{contract?.closingOfficerUser?.name ?? ""}</div>
                    </Col>
                </Row>
            </div>
            <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.coordinatingDoctors.title")}</div>
            <div className="contract-detail__container--body-date-fields">
                {renderCoordinatingDoctors()}
            </div>
            <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.authorizedDoctors.title")}</div>
            <div className="contract-detail__container--body-tags">
                {renderAuthorizedDoctors()}
            </div>
            <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.delays.title")}</div>
            <div className="contract-detail__container--body-date-fields">
                {renderDelays()}
            </div>
            <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.files.title")}</div>
            <div>
                {contract?.contractAttachments?.map((it, index) => (
                    <div key={index} style={{display: "flex"}}>
                        <ShowFileContainer<Document> item={it.attachment}>
                            <div className="icon-attach" style={{fontSize: "12px", lineHeight: "18px"}} />
                            <span style={{fontSize: "12px", color: "#149372", marginLeft: "5px"}}>{`${it.attachment?.fileName}`}</span>
                        </ShowFileContainer>
                    </div>
                ))}
            </div>
            <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.note.title")}</div>
            <div className="contract-detail__container--body-note-text">
                {contract?.notes}
            </div>
        </div>
    );

    const handleEdit = () => {
        history.push(`/admin/contract-register/${contractId}`);
    };

    const handleDownload = () => {

    };

    return (
        <>
            <div className="contract-detail__container--body-group">
                <div className="contract-detail__container--body-title">{contract?.contractingParty?.name ?? ''}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton color="gray" isAlignCenter width={"118px"} height={"28px"} filled clickButton={handleDownload}>
                        <i className="icon-dowload2" />
                        <span>{t("contractDetail.data.buttons.download")}</span>
                    </IconButton>
                    {AuthUtils.userHasPermission(1) && contract.status === ContractState.ACTIVE && <div style={{ marginLeft: "14px" }}>
                        <IconButton color="gray" isAlignCenter width={"144px"} height={"28px"} filled clickButton={handleEdit}>
                            <span>{t("contractDetail.data.buttons.edit")}</span>
                        </IconButton>
                    </div>}
                </div>
            </div>
            {body}
            <Row>
                <Col md="4">
                    <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.globalValue.title")}</div>
                    <div className="contract-detail__container--body-margin">
                        <UngroupedChartTooTip className="some-class" customize={customizeUngroupedToolTip}>
                            {(tooltip) => (
                                <SimpleDonutChart
                                    className="some-class"
                                    data={[chartData[0]]} // mocking only one value of array (optional)
                                    config={{
                                        height: 160,
                                        width: 160,
                                        labelKey: "month",
                                        categoriesKeys: ["value", "base"],
                                        categoryLabelFormat: formatLabel,
                                        donutWidth: 25,
                                        donutLabelPositionAdjust: 0.85,
                                    }}
                                    tooltipOptions={tooltip}
                                    title={"93% Receitas % Orçamento"}
                                />
                            )}
                        </UngroupedChartTooTip>
                    </div>
                </Col>
                <Col>
                    <div className="contract-detail__container--body-date-title"> {t("contractDetail.data.monthlyValue.title")}</div>
                    <div className="contract-detail__container--body-margin">
                        <GroupedChartToolTip className="some-class" customize={customizeGroupedToolTip}>
                            {(tooltip) => (
                                <SimpleStackedBarChart
                                    className="some-class"
                                    data={chartData}
                                    config={{
                                        height: 150,
                                        labelKey: "month",
                                        stackKeys: ["base", "value"],
                                        stackLabelFormat: formatLabel,
                                    }}
                                    tooltipOptions={tooltip}
                                    barWidth={20}
                                >
                                    {(chart, keys) => (
                                        <CustomChartLegend
                                            chart={chart}
                                            keys={keys}
                                            formatKey={(key) => (key === "value" ? "ABC" : "XYZ")} // map key to desired label
                                        />
                                    )}
                                </SimpleStackedBarChart>
                            )}
                        </GroupedChartToolTip>
                    </div>
                </Col>
                <div className="contract-detail__container--body-date-caption"> {t("contractDetail.data.monthlyValue.textField.caption")}</div>
            </Row>
        </>
    );
};
export default ContractData;
