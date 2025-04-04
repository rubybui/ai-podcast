import {
  AnalyzeBatchAction,
  AzureKeyCredential,
  TextAnalysisClient,
} from "@azure/ai-language-text";

import { AppConfig } from "../config";

const endpoint = AppConfig.endPoint;
const apiKey = AppConfig.apiKey;

const DEFAULT_MAX_SENTENCE_COUNT = 5;

export interface TextSummaryPrams {
  content: string[];
  maxSentenceCount: number;
}

export async function textSummaryService({
  content,
  maxSentenceCount = DEFAULT_MAX_SENTENCE_COUNT,
}: TextSummaryPrams) {
  const client = new TextAnalysisClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );
  const actions: AnalyzeBatchAction[] = [
    {
      kind: "ExtractiveSummarization",
      maxSentenceCount,
    },
  ];
  const poller = await client.beginAnalyzeBatch(actions, content, "en");

  let summaryContent = "";

  poller.onProgress(() => {
    console.log(
      `Last time the operation was updated was on: ${
        poller.getOperationState().modifiedOn
      }`
    );
  });

  console.log(
    `The operation was created on ${poller.getOperationState().createdOn}`
  );
  console.log(
    `The operation results will expire on ${
      poller.getOperationState().expiresOn
    }`
  );

  const results = await poller.pollUntilDone();

  for await (const actionResult of results) {
    if (actionResult.kind !== "ExtractiveSummarization") {
      throw new Error(
        `Expected extractive summarization results but got: ${actionResult.kind}`
      );
    }
    if (actionResult.error) {
      const { code, message } = actionResult.error;
      throw new Error(`Unexpected error (${code}): ${message}`);
    }

    // TODO: shoule be removed when ts is fully supported in this lib
    const results: any = actionResult;

    for (const result of results.results) {
      console.log(`- Document ${result.id}`);
      if (result.error) {
        const { code, message } = result.error;
        throw new Error(`Unexpected error (${code}): ${message}`);
      }
      console.log("Summary:");
      console.log(result.sentences.map((sentence) => sentence.text).join("\n"));

      summaryContent = result.sentences
        .map((sentence) => sentence.text)
        .join("\n");
    }

    return summaryContent;
  }
}
