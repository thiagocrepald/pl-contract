export enum ColumnType {
    // médico
    separator_doctor = "Médico",
    // idDoctor = "ID_DOCTOR",
    nameDoctor = "DOCTOR_NAME", 
    crmNumber = "CRM_NUMBER",
    cpfNumber = "CPF",
    cnpjNumber = "CNPJ",
    doctorCity = "DOCTOR_CITY",
    doctorState = "DOCTOR_STATE",
    crmState = "CRM_STATE",
    // contrato
    separator_contract = "Contrato",
    // idContract = "ID_CONTRACT",
    contractNumber = "CONTRACT_NUMBER",
    sankhyaCode = "SANKHYA_CODE",
    resultsCenter = "RESULTS_CENTER",
    serviceTypeContractMacro = "SERVICE_TYPE_CONTRACT_MACRO",
    // contratante
    separator_contractor = "Contratante",
    nameContractor = "CONTRACTOR_NAME",
    cityContractor = "CONTRACTOR_CITY",
    stateContrator = "CONTRACTOR_STATE",
    // contratada
    separator_hired = "Contratada",
    hiredName = "HIRED_NAME",
    hiredCity = "HIRED_CITY",
    hiredState = "HIRED_STATE",
    // responsáveis
    separator_responsible = "Responsáveis",
    accessResponsible = "ACCESS_RESPONSIBLE",
    closureResponsible = "CLOSURE_RESPONSIBLE",
    // escala
    separator_schedule = "Escala",
    // idSchedule = "ID_SCHEDULE",
    nameSchedule = "NAME_SCHEDULE", 
    scheduleStartDate = "SCHEDULE_START_DATE",
    scheduleEndDate = "SCHEDULE_END_DATE",
    unitName = "UNIT_NAME",
    unitObject = "UNIT_OBJECT",
    unitServiceType = "UNIT_SERVICE_TYPE",
    // plantão
    separator_onCall = "Plantão",
    // idOnCall = "ID_ON_CALL",
    onCallDate = "ON_CALL_DATE",
    onCallStartTime =  "ON_CALL_START_TIME",
    onCallEndTime =  "ON_CALL_END_TIME",
    onCallShift = "ON_CALL_SHIFT",
    onCallDay = "ON_CALL_DAY",
    onCallSector = "ON_CALL_SECTOR", 
    onCallSpeciality = "ON_CALL_SPECIALITY",
    onCallDateMonth = "ON_CALL_DATE_MONTH",
    onCallDateYear = "ON_CALL_DATE_YEAR",
    // pagamento
    separator_payment = "Pagamento",
    bond = "BOND",
    paymentType = "PAYMENT_TYPE",
    PrePaymentType = "PREPAYMENT_TYPE",
    // outros
    separator_more = "Outros Dados",
    totalAmountOnCallExpected = "TOTAL_AMOUNT_ON_CALL_EXPECTED",
    totalHoursOnCallExpected = "TOTAL_HOURS_ON_CALL_EXPECTED",
    hourValueOnCallExpected = "HOUR_VALUE_ON_CALL_EXPECTED",
    hourValueExpectedToReceive = "HOUR_VALUE_EXPECTED_TO_RECEIVE",
    totalAmountExpectedToReceive = "TOTAL_AMOUNT_EXPECTED_TO_RECEIVE",
    hourValueDifferentCostDoctor = "HOUR_VALUE_DIFFERENT_COST_DOCTOR",
    hourValueExpectedDoctor = "HOUR_VALUE_EXPECTED_DOCTOR",
    totalAmountExpectedDoctor = "TOTAL_AMOUNT_EXPECTED_DOCTOR",
    // horário realizado médico
    separator_doctorHours = "Horário Realizado",
    finalTimeDoctorOnCall = "FINAL_TIME_DOCTOR_ON_CALL",
    initialTimeDoctorOnCall = "INITIAL_TIME_DOCTOR_ON_CALL",
    totalHoursWorkedDoctor = "TOTAL_HOURS_DOCTOR_ACCOMPLISHED",
    adjustedFinalTime = "FINAL_TIME_DOCTOR_ON_CALL_ADJUSTED",
    adjustedStartTime = "START_TIME_DOCTOR_ON_CALL_ADJUSTED",
    adjustedTotalHoursWorked = "TOTAL_HOURS_DOCTOR_ACCOMPLISHED_ADJUSTED",
    statusAccessDoctor = "STATUS_ACCESS_DOCTOR",
    valueHourPaidDoctor = "HOUR_VALUE_PAID_DOCTOR",
    totalAmountPaidDoctor = "TOTAL_AMOUNT_PAID_DOCTOR",
    nameDoctorBore = "NAME_DOCTOR_BORE",
    valueHourDoctorBore = "HOUR_VALUE_DOCTOR_BORE",
    amountPaidDoctorBore = "AMOUNT_PAID_DOCTOR_BORE",
    // despesas 
    separator_expenses = "Despesas Extraordinárias",
    extraordinaryExpenseAmount = "EXTRAORDINARY_EXPENSE_AMOUNT",
    descriptionExtraordinaryExpense = "EXTRAORDINARY_EXPENSE_DESCRIPTION",
    // coordenador
    separator_coordinator = "Coordenador",
    nameDoctorCoordinator = "COORDINATOR_NAME",
    valueFixedCoordinator = "COORDINATOR_FIXED_VALUE",
    valueHourCoordinator = "COORDINATOR_HOUR_VALUE",
    minimalHourCoordinator = "COORDINATOR_MINIMUM_HOURS"
};

export enum ReportParameterType {
    UUID = "id",

    ID_DOCTOR = "idDoctor",
    DOCTOR_NAME = "nameDoctor",
    CRM_NUMBER = "crmNumber",
    CPF = "cpfNumber",
    CNPJ = "cnpjNumber",
    DOCTOR_CITY = "doctorCity",
    DOCTOR_STATE = "doctorState",
    CRM_STATE = "crmState",

    ID_CONTRACT = "idContract",
    CONTRACT_NUMBER = "contractNumber",
    SANKHYA_CODE = "sankhyaCode",
    RESULTS_CENTER = "resultsCenter",
    SERVICE_TYPE_CONTRACT_MACRO = "serviceTypeContractMacro",
    
    CONTRACTOR_NAME = "nameContractor",
    CONTRACTOR_CITY = "cityContractor",
    CONTRACTOR_STATE = "stateContrator",
    
    HIRED_NAME = "hiredName",
    HIRED_CITY = "hiredCity",
    HIRED_STATE = "hiredState",
    
    ACCESS_RESPONSIBLE = "accessResponsible",
    CLOSURE_RESPONSIBLE = "closureResponsible",
    
    ID_SCHEDULE = "idSchedule",
    NAME_SCHEDULE = "nameSchedule",
    SCHEDULE_START_DATE = "scheduleStartDate",
    SCHEDULE_END_DATE = "scheduleEndDate",
    UNIT_NAME = "unitName",
    UNIT_OBJECT = "unitObject",
    UNIT_SERVICE_TYPE = "unitServiceType",
    
    ID_ON_CALL = "idOnCall",
    ON_CALL_DATE = "onCallDate",
    ON_CALL_START_TIME = "onCallStartTime",
    ON_CALL_END_TIME = "onCallEndTime",
    ON_CALL_SHIFT = "onCallShift",
    ON_CALL_DAY = "onCallDay",
    ON_CALL_SECTOR = "onCallSector",
    ON_CALL_SPECIALITY = "onCallSpeciality",
    ON_CALL_DATE_MONTH = "onCallDateMonth",
    ON_CALL_DATE_YEAR = "onCallDateYear",
    
    BOND = "bond",
    PAYMENT_TYPE = "paymentType",
    PREPAYMENT_TYPE = "PrePaymentType",
    
    TOTAL_AMOUNT_ON_CALL_EXPECTED = "totalAmountOnCallExpected",
    TOTAL_HOURS_ON_CALL_EXPECTED = "totalHoursOnCallExpected",
    HOUR_VALUE_ON_CALL_EXPECTED = "hourValueOnCallExpected",
    HOUR_VALUE_EXPECTED_TO_RECEIVE = "hourValueExpectedToReceive",
    TOTAL_AMOUNT_EXPECTED_TO_RECEIVE = "totalAmountExpectedToReceive",
    HOUR_VALUE_DIFFERENT_COST_DOCTOR = "hourValueDifferentCostDoctor",
    HOUR_VALUE_EXPECTED_DOCTOR = "hourValueExpectedDoctor",
    TOTAL_AMOUNT_EXPECTED_DOCTOR = "totalAmountExpectedDoctor",

    FINAL_TIME_DOCTOR_ON_CALL = "finalTimeDoctorOnCall",
    INITIAL_TIME_DOCTOR_ON_CALL = "initialTimeDoctorOnCall",
    TOTAL_HOURS_DOCTOR_ACCOMPLISHED = "totalHoursWorkedDoctor",
    FINAL_TIME_DOCTOR_ON_CALL_ADJUSTED = "adjustedFinalTime",
    START_TIME_DOCTOR_ON_CALL_ADJUSTED = "adjustedStartTime",
    TOTAL_HOURS_DOCTOR_ACCOMPLISHED_ADJUSTED = "adjustedTotalHoursWorked",
    STATUS_ACCESS_DOCTOR = "statusAccessDoctor",
    HOUR_VALUE_PAID_DOCTOR = "valueHourPaidDoctor",
    TOTAL_AMOUNT_PAID_DOCTOR = "totalAmountPaidDoctor",
    NAME_DOCTOR_BORE = "nameDoctorBore",
    HOUR_VALUE_DOCTOR_BORE = "valueHourDoctorBore",
    AMOUNT_PAID_DOCTOR_BORE = "amountPaidDoctorBore",
    
    EXTRAORDINARY_EXPENSE_AMOUNT = "extraordinaryExpenseAmount",
    EXTRAORDINARY_EXPENSE_DESCRIPTION = "descriptionExtraordinaryExpense",
    
    COORDINATOR_NAME = "nameDoctorCoordinator",
    COORDINATOR_FIXED_VALUE = "valueFixedCoordinator",
    COORDINATOR_HOUR_VALUE = "valueHourCoordinator",
    COORDINATOR_MINIMUM_HOURS = "minimalHourCoordinator"
};

export enum ReportFieldType {
    UUID = "UUID",
    ID_DOCTOR = "ID_DOCTOR",
    DOCTOR_NAME = "DOCTOR_NAME",
    CRM_NUMBER = "CRM_NUMBER",
    CPF = "CPF",
    CNPJ = "CNPJ",
    DOCTOR_CITY = "DOCTOR_CITY",
    DOCTOR_STATE = "DOCTOR_STATE",
    CRM_STATE = "CRM_STATE",

    ID_CONTRACT = "ID_CONTRACT",
    CONTRACT_NUMBER = "CONTRACT_NUMBER",
    SANKHYA_CODE = "SANKHYA_CODE",
    RESULTS_CENTER = "RESULTS_CENTER",
    SERVICE_TYPE_CONTRACT_MACRO = "SERVICE_TYPE_CONTRACT_MACRO",
    
    CONTRACTOR_NAME = "CONTRACTOR_NAME",
    CONTRACTOR_CITY = "CONTRACTOR_CITY",
    CONTRACTOR_STATE = "CONTRACTOR_STATE",
    
    HIRED_NAME = "HIRED_NAME",
    HIRED_CITY = "HIRED_CITY",
    HIRED_STATE = "HIRED_STATE",
    
    ACCESS_RESPONSIBLE = "ACCESS_RESPONSIBLE",
    CLOSURE_RESPONSIBLE = "CLOSURE_RESPONSIBLE",
    
    ID_SCHEDULE = "ID_SCHEDULE",
    NAME_SCHEDULE = "NAME_SCHEDULE",
    SCHEDULE_START_DATE = "SCHEDULE_START_DATE",
    SCHEDULE_END_DATE = "SCHEDULE_END_DATE",
    UNIT_NAME = "UNIT_NAME",
    UNIT_OBJECT = "UNIT_OBJECT",
    UNIT_SERVICE_TYPE = "UNIT_SERVICE_TYPE",
    
    ID_ON_CALL = "ID_ON_CALL",
    ON_CALL_DATE = "ON_CALL_DATE",
    ON_CALL_START_TIME = "ON_CALL_START_TIME",
    ON_CALL_END_TIME = "ON_CALL_END_TIME",
    ON_CALL_SHIFT = "ON_CALL_SHIFT",
    ON_CALL_DAY = "ON_CALL_DAY",
    ON_CALL_SECTOR = "ON_CALL_SECTOR",
    ON_CALL_SPECIALITY = "ON_CALL_SPECIALITY",
    ON_CALL_DATE_MONTH = "ON_CALL_DATE_MONTH",
    ON_CALL_DATE_YEAR = "ON_CALL_DATE_YEAR",
    
    BOND = "BOND",
    PAYMENT_TYPE = "PAYMENT_TYPE",
    PREPAYMENT_TYPE = "PREPAYMENT_TYPE",
    
    TOTAL_AMOUNT_ON_CALL_EXPECTED = "TOTAL_AMOUNT_ON_CALL_EXPECTED",
    TOTAL_HOURS_ON_CALL_EXPECTED = "TOTAL_HOURS_ON_CALL_EXPECTED",
    HOUR_VALUE_ON_CALL_EXPECTED = "HOUR_VALUE_ON_CALL_EXPECTED",
    HOUR_VALUE_EXPECTED_TO_RECEIVE = "HOUR_VALUE_EXPECTED_TO_RECEIVE",
    TOTAL_AMOUNT_EXPECTED_TO_RECEIVE = "TOTAL_AMOUNT_EXPECTED_TO_RECEIVE",
    HOUR_VALUE_DIFFERENT_COST_DOCTOR = "HOUR_VALUE_DIFFERENT_COST_DOCTOR",
    HOUR_VALUE_EXPECTED_DOCTOR = "HOUR_VALUE_EXPECTED_DOCTOR",
    TOTAL_AMOUNT_EXPECTED_DOCTOR = "TOTAL_AMOUNT_EXPECTED_DOCTOR",

    FINAL_TIME_DOCTOR_ON_CALL = "FINAL_TIME_DOCTOR_ON_CALL",
    INITIAL_TIME_DOCTOR_ON_CALL = "INITIAL_TIME_DOCTOR_ON_CALL",
    TOTAL_HOURS_DOCTOR_ACCOMPLISHED = "TOTAL_HOURS_DOCTOR_ACCOMPLISHED",
    FINAL_TIME_DOCTOR_ON_CALL_ADJUSTED = "FINAL_TIME_DOCTOR_ON_CALL_ADJUSTED",
    START_TIME_DOCTOR_ON_CALL_ADJUSTED = "START_TIME_DOCTOR_ON_CALL_ADJUSTED",
    TOTAL_HOURS_DOCTOR_ACCOMPLISHED_ADJUSTED = "TOTAL_HOURS_DOCTOR_ACCOMPLISHED_ADJUSTED",
    STATUS_ACCESS_DOCTOR = "STATUS_ACCESS_DOCTOR",
    HOUR_VALUE_PAID_DOCTOR = "HOUR_VALUE_PAID_DOCTOR",
    TOTAL_AMOUNT_PAID_DOCTOR = "TOTAL_AMOUNT_PAID_DOCTOR",
    NAME_DOCTOR_BORE = "NAME_DOCTOR_BORE",
    HOUR_VALUE_DOCTOR_BORE = "HOUR_VALUE_DOCTOR_BORE",
    AMOUNT_PAID_DOCTOR_BORE = "AMOUNT_PAID_DOCTOR_BORE",
    
    EXTRAORDINARY_EXPENSE_AMOUNT = "EXTRAORDINARY_EXPENSE_AMOUNT",
    EXTRAORDINARY_EXPENSE_DESCRIPTION = "EXTRAORDINARY_EXPENSE_DESCRIPTION",
    
    COORDINATOR_NAME = "COORDINATOR_NAME",
    COORDINATOR_FIXED_VALUE = "COORDINATOR_FIXED_VALUE",
    COORDINATOR_HOUR_VALUE = "COORDINATOR_HOUR_VALUE",
    COORDINATOR_MINIMUM_HOURS = "COORDINATOR_MINIMUM_HOURS"
};

export enum GroupType {
    TOTAL_AMOUNT_ON_CALL_EXPECTED = 'TOTAL_AMOUNT_ON_CALL_EXPECTED',
    HOUR_VALUE_EXPECTED_TO_RECEIVE = 'HOUR_VALUE_EXPECTED_TO_RECEIVE',
    TOTAL_AMOUNT_EXPECTED_TO_RECEIVE = 'TOTAL_AMOUNT_EXPECTED_TO_RECEIVE',
    TOTAL_AMOUNT_EXPECTED_DOCTOR = 'TOTAL_AMOUNT_EXPECTED_DOCTOR',
    TOTAL_HOURS_DOCTOR_ACCOMPLISHED = 'TOTAL_HOURS_DOCTOR_ACCOMPLISHED',
    TOTAL_AMOUNT_PAID_DOCTOR = 'TOTAL_AMOUNT_PAID_DOCTOR',
    AMOUNT_PAID_DOCTOR_BORE = 'AMOUNT_PAID_DOCTOR_BORE',
    EXTRAORDINARY_EXPENSE_AMOUNT = 'EXTRAORDINARY_EXPENSE_AMOUNT'
};

export enum ModalType {
    SAVE = 'SAVE',
    EDIT = 'EDIT',
    HIDDEN = 'HIDDEN',
    DOTS = 'DOTS'
};

export enum DropdownType {
    GROUP = 'GROUP',
    COLUMN = 'COLUMN',
    DOCTOR = 'DOCTOR',
    ON_CALL = 'ON_CALL',
    SCHEDULE = 'SCHEDULE',
    CONTRACT = 'CONTRACT'
};