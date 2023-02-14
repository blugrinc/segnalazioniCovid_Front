import { Report } from "./report";
export interface Person {
  idPerson: string;
  fiscalCode: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  role: string;
  reportList: Report[];
}


