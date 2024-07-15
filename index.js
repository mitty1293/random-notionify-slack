const { Client } = require('@notionhq/client');
const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const generateSlackBlocks = require('./blocks');

// Load configuration from JSON file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Notion API setup
const notion = new Client({ auth: config.notion.apiKey });
const databaseIds = config.notion.databaseIds;

// Slack API setup
const slackClient = new WebClient(config.slack.botToken);
const slackChannel = config.slack.channel;

/**
 * Fetches pages from the specified Notion database.
 * @param {string} databaseId - The ID of the Notion database.
 * @returns {Promise<Array>} - A promise that resolves to an array of Notion pages.
 */
const getNotionPages = async (databaseId) => {
    try {
        const response = await notion.databases.query({ database_id: databaseId });
        return response.results;
    } catch (error) {
        console.error(`Error fetching Notion pages from database: ${databaseId}`);
        console.error(error);
        return [];
    }
};

/**
 * Retrieves the name of the specified Notion database.
 * @param {string} databaseId - The ID of the Notion database.
 * @returns {Promise<string>} - A promise that resolves to the name of the Notion database.
 */
const getDatabaseName = async (databaseId) => {
    try {
        const response = await notion.databases.retrieve({ database_id: databaseId });
        return response.title[0].text.content;
    } catch (error) {
        console.error(`Error retrieving database name for ${databaseId}`);
        console.error(error);
        return 'Unknown Database';
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
 * Sends a notification message to Slack using Block Kit.
 * @param {Object} blocks - The blocks to send to Slack.
 * @returns {Promise<void>}
 */
const sendSlackNotification = async (blocks) => {
    try {
        await slackClient.chat.postMessage({
            channel: slackChannel,
            blocks: blocks,
            text: "sendSlackNotification"
        });
    } catch (error) {
        console.error('Error sending message');
        console.error(error);
    }
};

/**
 * Picks a random page from each specified Notion database and sends their details to Slack.
 * @returns {Promise<void>}
 */
const pickRandomPage = async () => {
    for (const databaseId of databaseIds) {
        const databaseName = await getDatabaseName(databaseId);
        const pages = await getNotionPages(databaseId);
        if (pages.length > 0) {
            const randomPage = pages[Math.floor(Math.random() * pages.length)];
            console.dir(randomPage, { depth: null });
            let titleContent = '';
            const contentArray = [];

            Object.entries(randomPage.properties).forEach(([key, property]) => {
                const content = extractContent(property);
                if (content) {
                    if (property.type === 'title') {
                        titleContent = content;
                    } else {
                        contentArray.push([key, content]);
                    }
                }
            });

            const pageUrl = randomPage.url;
            const blocks = generateSlackBlocks(databaseName, titleContent, contentArray, pageUrl);
            await sendSlackNotification(blocks);
        } else {
            console.log(`No pages found in Notion database ${databaseName}`);
        }
    }
};

(async () => {
    await pickRandomPage();
})();
