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
 * Extracts content from a single Notion property.
 * @param {Object} property - The property object from a Notion page.
 * @returns {string} - Extracted content as a string.
 */
const extractContent = (property) => {
    let content = '';

    if (property.type === 'title' || property.type === 'rich_text') {
        content = property[property.type].map(textObj => textObj.text.content).join(' ');
    } else if (property.type === 'multi_select') {
        content = property.multi_select.map(selectObj => selectObj.name).join(', ');
    }
    return content;
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

        let pageContent = '';
        Object.entries(randomPage.properties).forEach(([key, property]) => {
            const content = extractContent(property);
            if (content) {
                pageContent += `${key}: ${content}\n`
            }
        });
        const pageUrl = randomPage.url;
        const message = `Check out this Notion page:\n${pageContent}\n${pageUrl}`;
        await sendSlackNotification(message);
    } else {
        console.log('No pages found in Notion database');
    }
};

(async () => {
    await pickRandomPage();
})();
