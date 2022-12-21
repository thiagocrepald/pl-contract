import { Moment } from 'moment';

export interface IAdminReport {
    id?: number;

    idDoctor?: number;
    nameDoctor?: string;
    crmNumber?: string;
    cpfNumber?: string;
    cnpjNumber?: string;
    doctorCity?: string;
    doctorState?: string;
    crmState?: string;

    idContract?: number;
    contractNumber?: string;
    sankhyaCode?: number;
    resultsCenter?: string;
    serviceTypeContractMacro?: string;

    nameContractor?: string;
    cityContractor?: string;
    stateContractor?: string;

    hiredName?: string;
    hiredCity?: string;
    hiredState?: string;

    accessResponsible?: string;
    closureResponsible?: string;

    idSchedule?: number;
    nameSchedule?: string;
    scheduleStartDate?: string | Date | Moment;
    scheduleEndDate?: string | Date | Moment;
    unitName?: string;
    unitObject?: string;
    unitServiceType?: string;

    idOnCall?: number;
    onCallDate?: string | Date | Moment;
    onCallStartTime?: string | Date | Moment;
    onCallEndTime?: string | Date | Moment;
    onCallShift?: string;
    onCallDay?: string;
    onCallSector?: string;
    onCallSpeciality?: string;
    onCallDateMonth?: string;
    onCallDateYear?: number;
    
    bond?: string;
    paymentType?: string;
    PrePaymentType?: string; // verificar

    totalAmountOnCallExpected?: number;
    totalHoursOnCallExpected?: string | Date | Moment;
    hourValueOnCallExpected?: number;
    hourValueExpectedToReceive?: number;
    totalAmountExpectedToReceive?: number;
    hourValueDifferentCostDoctor?: number;
    hourValueExpectedDoctor?: number;
    totalAmountExpectedDoctor?: number;


    finalTimeDoctorOnCall?: string | Date | Moment;
    initialTimeDoctorOnCall?: string | Date | Moment;
    totalHoursWorkedDoctor?: number;
    adjustedFinalTime?: string | Date | Moment;
    adjustedStartTime?: string | Date | Moment;
    adjustedTotalHoursWorked?: string | Date | Moment;
    statusAccessDoctor?: string;
    valueHourPaidDoctor?: number;
    totalAmountPaidDoctor?: number;
    nameDoctorBore?: string;
    valueHourDoctorBore?: number;
    amountPaidDoctorBore?: number;

    extraordinaryExpenseAmount?: number;
    descriptionExtraordinaryExpense?: string;

    nameDoctorCoordinator?: string;
    valueFixedCoordinator?: number;
    valueHourCoordinator?: number;
    minimalHourCoordinator?: number;
};