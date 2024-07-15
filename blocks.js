/**
 * Generates Slack message blocks for a Notion page.
 * @param {string} databaseName - The name of the Notion database.
 * @param {string} titleContent - The title property content.
 * @param {Array} contentArray - An array of key-value pairs for other properties.
 * @param {string} pageUrl - The URL of the Notion page.
 * @returns {Array} - The Slack message blocks.
 */
const generateSlackBlocks = (databaseName, titleContent, contentArray, pageUrl) => {
    const contentBlocks = contentArray.flatMap(([key, content]) => ([
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*${key}*`,
            },
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: content,
            },
        }
    ]));

    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*${databaseName}*`,
            },
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*${titleContent}*`,
            },
        },
        ...contentBlocks,
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `<${pageUrl}|View in Notion>`,
            },
        },
    ];
};

module.exports = generateSlackBlocks;
