
# List-O-Matic (Server)

Server for shared list app using Node/Express and MongoDB.

This was started at a half-day hackathon for the WDI program at General Assembly


## ROUTES

| route | verb | return | description |
|-------|------|--------|-------------|
| /lists/new | GET | listKey | generates List key |
| /lists | GET | List _id[] | finds all lists that user has |
| /lists/:id | POST | List | add list item |
| /lists/:id/:id | PUT | List | update list item (poster/owner) |
| /lists/:id/:id | DELETE | List | remove item (poster/owner) |
| /lists/:id/completed | DELETE | List | remove completed (owner only) |
| /lists/:id | DELETE | | remove list (owner only) |
