import { Coda } from "coda-js";
import { AppConfig } from "../config";
import { Table } from "coda-js/build/models";

class CodaService {
  private coda: Coda;
  private codaForReportData: Coda;
  private CODA_DOC_ID: string = "QBbmH0xZ3s";
  private SURVEY_CODA_TABLE_ID: string = "grid-MM8O5TB2ke";
  private REPORT_CODA_TABLE_ID: string = "grid-8xayzVKy9U";

  private surveyTable: Table;
  private reportTable: Table;

  constructor() {
    this.coda = new Coda(AppConfig.coda);
    this.codaForReportData = new Coda(AppConfig.codaReportData);
    this.getSurveyTable();
    this.getReportTable();
  }


  async getSurveyTable() {
    this.surveyTable = await this.coda.getTable(
      this.CODA_DOC_ID,
      this.SURVEY_CODA_TABLE_ID
    );
  }
  async getReportTable() {
    this.reportTable = await this.codaForReportData.getTable(
      this.CODA_DOC_ID,
      this.REPORT_CODA_TABLE_ID
    );
  }
  
  async AddReportRow(
    subject: string,
    message: string,
    anonymous: boolean,
    name?: string,
    email?: string
  ) {
    await this.reportTable.insertRows([
      {
        Name: name,
        Email: email,
        Subject: subject,
        Message: message,
        Anonymous: anonymous,
      },
    ]);
  }

  async getSurveyData() {
    const surveyData = await this.surveyTable.listRows({
      useColumnNames: true,
    });
    return surveyData
      .filter((row) => row.values.Active)
      .map((row) => {
        return {
          id: row.id,
          name: row.values.Name,
        };
      });
  }
  async addSurveyOption(option: string) {
    await this.surveyTable.insertRows([
      {
        Name: option,
        Upvote: 1,
      },
    ]);
  }

  async voteSurveyOption(id: string) {
    const row = await this.surveyTable.getRow(id, { useColumnNames: true });
    const upvote = row.values.Upvote;
    await row.update({
      Upvote: upvote + 1,
    });
  }
}

export const codaService = new CodaService();


