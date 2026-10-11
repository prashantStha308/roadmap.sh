# Task Tracker

A TS based, cli mini-project which can be used to manage your everyday tasks from the ease of your terminal.

## Usages
This mini-project can add, display, update and delete tasks using intuitive commands

```bash
# Adding a new task
npm dev add "Buy groceries"
# Output: Task added successfully (ID: 1)
# Updating and deleting tasks
npm dev update 1 "Buy groceries and cook dinner"
npm dev delete 1
# Marking a task as in progress or done
npm dev mark-in-progress 1
npm dev mark-done 1
# Listing all tasks
npm dev list
# Listing tasks by status
npm dev list done
npm dev list todo
npm dev list in-progress
```

## Requirements
- [Node.js](https://nodejs.org) v18 or later
- A package manager: npm, pnpm, or yarn
- [Git](https://git-scm.com) (only if you're cloning the repo)

No database or external services are needed. Tasks are saved locally in `bin/tracker-data.json`.

This project is one of the assigements i picked up from `roadmap.sh`
Project URL: https://roadmap.sh/projects/task-tracker