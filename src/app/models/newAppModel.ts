export class VillageModel {
  public Customer_No: string;
  public Record_ID: number;
  public Village_Name: string;
}
export class PersonModel {
  public ID_Number: string;
  public First_Names: string;
  public Middle_Name: string;
  public Surname: string;
  public DOB: string;
  public Username: string;
  public Password: string;
  public valid: boolean;
  public status: string;
  public Person_Names: string;
  public Marital_Status: string;
  public Date_Married: string;
  public Deceased: string;
  public Deceased_Date: string;
  public Spouse_ID: string;
}
export class PersonViewModel extends PersonModel {
  public DOBDate: string;
  public ID_Issue_Date: string;
  public Address_1: string;
  public Address_2: string;
  public Address_3: string;
  public Postal_Code: string;
  public Dependents: string;
  public Account_Number: string;
  public Village: string;
  public Ward: string;
  public Cell: string;
  public Employed: string;
  public Employed_At: string;
  public email_Address: string;
  public Application_Reference: string;
  public Captured_By: string;
  public Municipal_Account_2: string;
  public Remarks: string;
  public Salary: number;
  public CellNumberOtp: string;
}

export class ValidateIdNumberModel {
  Valid: boolean;
  Errors: Array<string>;
}
export abstract class BaseApplicationModel {
  Application_Reference: string;
  ID_Issue_Date: string;
  Approved: string;
  Reason: string;
  Age_Bracket: string;
  Consumer_ID: string;
  Person_names: string;
  Surname: string;
  Gender: string;
  DOB: string;
  Receive_Sassa: string;
  Pay_UIF: string;
  Director_Of_Companies: string;
  Is_Home_Owner: string;
  Estimated_Income: string;
  Current_Bond_Amount: string;
  Cell_1: string;
  Email_1: string;
  Physical_Address_1: string;
  Physical_Address_2: string;
  Physical_Address_3: string;
  Physical_Cade: string;
  Known_Car: string;
  Household_Income: string;
  Occupation: string;
  Know_Bank_Account: string;
  Property_Count: string;
  Sassa_Status: string;
  Initial_Signature: string;
  ID_Document: string;
  Selfie: string;
  Captured_By: string;
  ID_Number: string;
  Full_Signature: string;
  Municipal_Account: string;
  Payslip_Image: string;
  SASSA_Card: string;
  Appeal: string;
  Dependents: string;
  Village: string;
  Employed_At: string;
  Employed: string;
  Ward: string;
  Appeal_Outcome: string;
  Appeal_Reason: string;
  Appeal_Reason_User: string;
  Override: string;
  Override_Reason: string;
  Appeal_Outcome_User: string;
  Remarks: string;
  Reason_Code: string;
  Municipal_Account_Number: string;
  Municipal_Account_2: string;
  Appeal_Date: string;
  Expiry: string;
  Over_Ride_Date: string;
  Over_Ride_Reason: string;
  Over_Ride_User: string;
  Reason_Code_1: string;
  Salary: number;
  Benefit: string;
}
