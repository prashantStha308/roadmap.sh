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
Replace `npm` with the package manager you're using

## How to install?
Installing is pretty simple
```bash
git clone https://github.com/prashantStha308/roadmap.sh/tree/main/backend/task-tracker
cd task-tracker
npm install
```
--

This project is one of the assigements i picked up from `roadmap.sh`
Project Link: https://roadmap.sh/projects/task-tracker