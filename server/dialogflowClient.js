import dialogflow from 'dialogflow';
import dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.DIALOGFLOW_PROJECT_ID;

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const detectIntent = async (text, sessionId) => {
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'en',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;

  return result;
};
