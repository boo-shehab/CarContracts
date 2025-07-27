export interface AccountInformation {
    firstName: string;
    fatherName: string;
    grandfatherName: string;
    fourthName: string;
    surname: string;
    nationalId: string;
    phoneNumber: string;
    residenceCardNo: string;
    residence: string;
    district: string;
    alley: string;
    houseNo: string;
    infoOffice: string;
    issuingAuthority: string;
}

export interface CarInformation {
    name: string;
    type: string;
    color: string;
    model: string;
    chassisNumber: string;
    plateNumber: string;
    engineType: string;
    passengerCount: number;
    cylinderCount: number;
    kilometers: number;
    origin: string;
}