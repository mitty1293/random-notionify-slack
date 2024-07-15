# random-notionify-slack
Randomly selects a Notion article and notifies Slack at scheduled intervals.

## Features

- Randomly selects a page from specified Notion databases.
- Sends a formatted message to a Slack channel with details of the selected page.
- Uses Node-cron to schedule the task at regular intervals.

## Installation

1. Clone the repository:

```bash
git clone git@github.com:mitty1293/random-notionify-slack.git
cd random-notionify-slack
```

2. Create a `src/config.json` file in the `src` directory with the following structure:

```json
{
  "notion": {
    "apiKey": "your_notion_api_key",
    "databaseIds": [
      "your_database_id_A",
      "your_database_id_B"
    ]
  },
  "slack": {
    "botToken": "your_slack_bot_token",
    "channel": "your_channel"
  }
}
```

Replace `your_notion_api_key`, `your_database_id_A`, `your_database_id_B`, `your_slack_bot_token`, and `your_channel` with your actual Notion API key, database IDs, Slack bot token, and Slack channel.

## Usage

### Running Locally

1. Install the dependencies:

```bash
npm install
```

2. Run the application:

```bash
node src/index.js
```

This will start the application and schedule the task to run every day at 9 AM. You can modify the schedule by changing the cron schedule expression in `src/index.js`.

### Running with Docker

1. Build and start the Docker containers using Docker Compose:

```bash
docker compose up --build -d
```

This will start the application and schedule the task to run every day at 9 AM. You can modify the schedule by changing the cron schedule expression in `src/index.js`.

## Project Structure

- `src/index.js`: Main script that handles Notion page selection and Slack notification.
- `src/blocks.js`: Contains the function to generate Slack message blocks.
- `src/config.json`: Configuration file containing Notion API key, database IDs, and Slack bot token.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Notion API](https://developers.notion.com/)
- [Slack API](https://api.slack.com/)
