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
                text: `*${key}*\n${content}`,
            },
        },
    ]));

    return [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": `${titleContent}`,
                "emoji": true
            }
        },
        ...contentBlocks,
        {
            "type": "divider"
        },
        {
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `:books: Database: ${databaseName}`,
                }
            ]
        },
        {
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `:link: <${pageUrl}|View in Notion>`,
                },
            ]
        },
    ];
};

module.exports = generateSlackBlocks;
