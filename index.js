const { Client } = require('@notionhq/client');
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

// Notion API setup
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// Slack API setup
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackChannel = process.env.SLACK_CHANNEL;
const slackClient = new WebClient(slackBotToken);

/**
 * Fetches pages from the Notion database.
 * @returns {Promise<Array>} - A promise that resolves to an array of Notion pages.
 */
const getNotionPages = async () => {
    try {
        const response = await notion.databases.query({ database_id: databaseId });
        return response.results;
    } catch (error) {
        console.error('Error fetching Notion pages');
        console.error(error);
        return [];
    }
};

/**
 * Sends a notification message to Slack.
 * @param {string} message - The message to send to Slack.
 * @returns {Promise<void>}
 */
const sendSlackNotification = async (message) => {
    try {
        await slackClient.chat.postMessage({
            channel: slackChannel,
            text: message,
        });
    } catch (error) {
        console.error('Error sending message');
        console.error(error);
    }
};

/**
 * Picks a random page from Notion and sends its details to Slack.
 * @returns {Promise<void>}
 */
const pickRandomPage = async () => {
    const pages = await getNotionPages();
    if (pages.length > 0) {
        const randomPage = pages[Math.floor(Math.random() * pages.length)];
        console.dir(randomPage, { depth: null });
        const pageTitle = randomPage.properties.Spelling.title[0].plain_text;
        const pageUrl = randomPage.url;
        const message = `Check out this Notion page:\n${pageTitle}\n${pageUrl}`;
        await sendSlackNotification(message);
    } else {
        console.log('No pages found in Notion database');
    }
};

(async () => {
    await pickRandomPage();
})();
