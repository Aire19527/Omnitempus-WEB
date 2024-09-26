export interface AddWorkHours {
    name: string,
    abbreviation: string,
    weekDays: string[],
    surchargePercentageAdjusted: number,
    initialTime: string,
    endTime: string,
    overtimeCount: string,
    hourType: number
    surchargePercentageOT: number,
}

export interface WorkHours
  extends AddWorkHours {
  id: number;
}

export interface TypeOvertimeModel {
  idTypeOvertime: number;
  typeOvertime: string;
  isActive: boolean;
}
