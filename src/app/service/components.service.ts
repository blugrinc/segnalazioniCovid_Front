import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http"


import { Report } from "../models/report";
import { Observable } from "rxjs";
import { getLocaleDateFormat } from "@angular/common";
import { IfStmt } from "@angular/compiler";


const report = {
  person: "person",
  reportDate: new Date(),
  triage: true,
  abstention: false,
  disinfectionDate: false,

  typeOfReport: "",

  questions1: "",
  questions2: "",
  questions3: "",
  questions4: "",
  questions5: "",
  questions6: "",
  questions7: "",
  questions8: "",

  answer1: "",
  answer2: "",
  answer3: "",
  answer4: "",
  answer5: "",
  answer6: "",
  answer7: "",
  answer8: "",

  newClassification: "mantiene la precedente",
  oldClassification: "mantiene la precedente",
  proposedAbstentionDate: {},
  path: "",
}


@Injectable({
  providedIn: "root",
})
export class ComponentService {

  constructor(private http: HttpClient, private router: Router) { }

  getSurvey_1(item: any) {
    if (item.value !== "") {
      report.typeOfReport = item.typeOfReport;
      report.questions1 = item.question1;
      report.questions2 = item.question2;
      report.questions3 = item.question3;
      report.questions4 = item.question4;

      report.answer1 = item.answer1;
      report.answer2 = item.answer2;
      report.answer3 = item.answer3;
      report.answer4 = item.answer4;
    }
  }
  getSurvey_2(item: any) {
    if (item.value !== "") {
      report.questions5 = item.question5;
      report.questions6 = item.question6;

      report.answer5 = item.answer5;
      report.answer6 = item.answer6;

    }
  }
  getSurvey_3(item: any) {
    if (item.value !== "") {
      report.questions7 = item.question7;
      report.questions8 = item.question8;

      report.answer7 = item.answer7;
      report.answer8 = item.answer8;
      report.reportDate = new Date();
    }
    /* this.postSurvey(TestReport) */;
    this.setOtherValueSurvey();

    console.log(report);

    return this.redirectControll();
  }

  setOtherValueSurvey() {
    //ABSTENTION ( TRUE OR FALSE )
    if (report.typeOfReport === "Sono positivo ad un test diagnostico") {
      report.abstention = true;
    }
    //OLD CLASSIFICATION
    if (report.answer1 === "Test_molecolare") {
      report.oldClassification = "Caso probabile"
    } else if (report.answer1 === "Tampone_rapido") {
      report.oldClassification = "Caso possibile"
    }
    //NEW CLASSIFICATION
    if (report.answer1 === "Test_molecolare" && report.answer8 === "no") {
      report.newClassification = "Caso confermato_molecolare"
    } else if (report.answer1 === "Tampone_rapido" && report.answer8 === "no") {
      report.newClassification = "Caso confermato_antigenico"
    } else if (report.answer8 === "si") {
      report.newClassification = "Caso confermato_variante"
    }

    //ABSTENTION DATE
    if (report.typeOfReport === "Sono positivo ad un test diagnostico") {
      const abstentionDate = new Date(report.answer2);
      report.proposedAbstentionDate = new Date(abstentionDate.setDate(abstentionDate.getDate() + 14));
    } else {
      report.proposedAbstentionDate = "nessuna";
    }
    //TRIAGE
    const date_F = new Date(report.answer2); /* data_Tampone */
    const date_H = new Date(report.answer3); /* data_Ultima_Presenza_In_Sede */
    const date_L = new Date(report.answer5); /* date_Sintomi */

    //2 GIORNI PRIMA
    const twoDaysBeforeL = new Date(date_L);
    twoDaysBeforeL.setDate(twoDaysBeforeL.getDate() - 2);
    const twoDaysBeforeF = new Date(date_F);
    twoDaysBeforeF.setDate(twoDaysBeforeF.getDate() - 2);
    //14 GIORNI PRIMA
    const fourteenDaysBeforeL = new Date(date_L);
    fourteenDaysBeforeL.setDate(fourteenDaysBeforeL.getDate() - 14);
    const fourteenBeforeF = new Date(date_F);
    fourteenBeforeF.setDate(fourteenBeforeF.getDate() - 14);
    //14 GG DOPO
    const fourteenDaysAfterL = new Date(date_L);
    fourteenDaysAfterL.setDate(fourteenDaysAfterL.getDate() + 14);
    const fourteenDaysAfterF = new Date(date_F);
    fourteenDaysAfterF.setDate(fourteenDaysAfterF.getDate() + 14);

    //SINTOMI SI, VARIANTE = NO
    if (report.answer4 === "si" && report.answer8 === "no") {


      console.log("TRIAGE 1.2")
      if ((date_H >= twoDaysBeforeL && date_H <= fourteenDaysAfterL) ||
        (date_H >= twoDaysBeforeF && date_H <= fourteenDaysAfterF)) {
        console.log("TRIAGE 1.2")
        report.triage = true;
      } else report.triage = false;
    }

    //SINTOMI SI, VARIANTE = SI
    if (report.answer4 === "si" && report.answer8 === "si") {
      console.log("TRIAGE 2.1")

      if ((date_H >= fourteenDaysBeforeL && date_H <= fourteenDaysAfterL) ||
        (date_H >= fourteenBeforeF && date_H <= fourteenDaysAfterF)) {
        console.log("TRIAGE 2.2")
        report.triage = true;
      } else report.triage = false;
    }

    //SINTOMI = NO, VARIANTE = SI
    if (report.answer4 === "no" && report.answer8 === "si") {
      report.answer5 = "";
      console.log("TRIAGE 3.1")
      if (date_H >= fourteenBeforeF && date_H <= fourteenDaysAfterF) {
        console.log("TRIAGE 3.2")
        report.triage = true;
      } else report.triage = false;
    }
    //SANIFICATION
    const threeDayBefore = new Date();
    threeDayBefore.setDate(threeDayBefore.getDate() - 3);
    if (date_H >= threeDayBefore) {
      report.disinfectionDate = true;
    } else report.disinfectionDate = false;
  }

  redirectControll() {

    if (
      report.typeOfReport === "Sono positivo ad un test diagnostico" &&
      report.answer1 === "Test_molecolare" &&
      report.answer8 === "no") {
      report.path = "1";
      this.router.navigate([ '/path1' ]);
    }

    if (
      report.typeOfReport === "Sono positivo ad un test diagnostico" &&
      report.answer1 === "Tampone_rapido" &&
      report.answer8 === "no") {
      report.path = "2";
      this.router.navigate([ '/path2' ]);
    }

    if (report.typeOfReport === "Aggiornamento per richiesta fine astenzione"
    ) {
      report.path = "22";
      this.router.navigate([ '/path22' ]);
    }

    if (
      report.typeOfReport === "Sono positivo ad un test diagnostico" &&
      report.answer8 === "si") {
      report.path = "25"
      this.router.navigate([ '/path25' ]);
    }
  }

  postSurvey(item: any) {
    return this.http.post<any>("http://localhost:8080/report/add", item)
      .subscribe(res => console.log(res));
  }

}



