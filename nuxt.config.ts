// https://nuxt.com/docs/api/configuration/nuxt-config
/*export default defineNuxtConfig({
  devtools: { enabled: false }
}
)*/
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      googleSheetsClientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      googleSheetsPrivateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      googleSheetsSpreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      penaiApiKey: process.env.OPENAI_API_KEY,
    },
  },
  routeRules: {
    '/ss': { middleware: ['auth'] },
  },
});
