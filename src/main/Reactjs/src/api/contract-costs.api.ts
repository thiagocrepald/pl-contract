import { AxiosResponse } from "axios";
import {
  DifferentiatedValueType,
  BoreCostType,
  ExtraordinaryExpenseType,
} from "../model/contract-costs-type";
import { api as apiNew } from "./api.new";
import { Pageable, PageableResponse } from "../model/pageable";
import { Predicate } from "../model/predicate";
import { Schedule } from "../model/schedule";
import { OnCall } from "../model/on-call";
import { requestParamsFormatter } from "../util/api-utils";

class ContractCostsApi {
  static createBoreCost = (
    newBoreCost: BoreCostType
  ): Promise<AxiosResponse<BoreCostType>> => {
    return apiNew.post<BoreCostType>("/bore-costs", newBoreCost);
  };

  static getAllBoreCost = (
    pageable: Pageable,
    predicate: Predicate,
    contractId: number
  ): Promise<AxiosResponse<PageableResponse<BoreCostType>>> => {
    const [pageParams, filterParams] = requestParamsFormatter(
      pageable,
      predicate
    );
    return apiNew.get<PageableResponse<BoreCostType>>(
      "/bore-costs/contracts/" +
        contractId +
        (pageParams ? `?${pageParams}` : "") +
        (filterParams ? `&${filterParams}` : "")
    );
  };

  static updateBoreCost = (
    updateBoreCost: BoreCostType
  ): Promise<AxiosResponse<BoreCostType>> => {
    return apiNew.put<BoreCostType>("/bore-costs", updateBoreCost);
  };

  static deleteBoreCost = (id: number): Promise<AxiosResponse<void>> => {
    return apiNew.delete(`/bore-costs/${id}`);
  };

  static createDifferentiatedValue = (
    newDifferentiatedValue: DifferentiatedValueType
  ): Promise<AxiosResponse<DifferentiatedValueType>> => {
    return apiNew.post<DifferentiatedValueType>(
      "/different-value-costs",
      newDifferentiatedValue
    );
  };

  static getAllDifferentiatedValue = (
    pageable: Pageable,
    predicate: Predicate,
    contractId: number
  ): Promise<AxiosResponse<PageableResponse<DifferentiatedValueType>>> => {
    const [pageParams, filterParams] = requestParamsFormatter(
      pageable,
      predicate
    );
    return apiNew.get<PageableResponse<DifferentiatedValueType>>(
      "/different-value-costs/contracts/" +
        contractId +
        (pageParams ? `?${pageParams}` : "") +
        (filterParams ? `&${filterParams}` : "")
    );
  };

  static updateDifferentiatedValue = (
    updateDifferentiatedValue: DifferentiatedValueType
  ): Promise<AxiosResponse<DifferentiatedValueType>> => {
    return apiNew.put<DifferentiatedValueType>(
      "/different-value-costs",
      updateDifferentiatedValue
    );
  };

  static deleteDifferentiatedValue = (
    id: number
  ): Promise<AxiosResponse<void>> => {
    return apiNew.delete(`/different-value-costs/${id}`);
  };

  static checkIfTheDoctorExistsInDifferentValue = (
    contractId: number,
    doctorId: number
  ): Promise<AxiosResponse> => {
    return apiNew.get(
      "/different-value-costs/contracts/" + contractId + "/doctors/" + doctorId
    );
  };

  static createExtraordinaryExpense = (
    newExtraordinaryExpense: ExtraordinaryExpenseType
  ): Promise<AxiosResponse<ExtraordinaryExpenseType>> => {
    return apiNew.post<ExtraordinaryExpenseType>(
      "/extraordinary-expense-costs",
      newExtraordinaryExpense
    );
  };

  static getAllExtraordinaryExpenses = (
    pageable: Pageable,
    predicate: Predicate,
    contractId: number
  ): Promise<AxiosResponse<PageableResponse<ExtraordinaryExpenseType>>> => {
    const [pageParams, filterParams] = requestParamsFormatter(
      pageable,
      predicate
    );
    return apiNew.get<PageableResponse<ExtraordinaryExpenseType>>(
      "/extraordinary-expense-costs/contracts/" +
        contractId +
        (pageParams ? `?${pageParams}` : "") +
        (filterParams ? `&${filterParams}` : "")
    );
  };

  static updateExtraordinaryExpense = (
    updateExtraordinaryExpense: ExtraordinaryExpenseType
  ): Promise<AxiosResponse<ExtraordinaryExpenseType>> => {
    return apiNew.put<ExtraordinaryExpenseType>(
      "/extraordinary-expense-costs",
      updateExtraordinaryExpense
    );
  };

  static deleteExtraordinaryExpense = (
    id: number
  ): Promise<AxiosResponse<void>> => {
    return apiNew.delete(`/extraordinary-expense-costs/${id}`);
  };

  static getSchedules = (
    contractId: number
  ): Promise<AxiosResponse<PageableResponse<Schedule>>> => {
    return apiNew.get<PageableResponse<Schedule>>(
      "/schedules?contract.id=" + contractId
    );
  };

  static getOnCalls = (
    scheduleId
  ): Promise<AxiosResponse<PageableResponse<OnCall>>> => {
    return apiNew.get<PageableResponse<OnCall>>(
      "/on-calls?schedule.id=" + scheduleId + "&sort=date,asc"
    );
  };
}

export default ContractCostsApi;
