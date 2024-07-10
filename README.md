# sustainify

mysql: follow pratical 2a activity 1 to create the mysql db, replace all "learning" to "sustainify".
then create a file ".env" in sustainify\server and paste this:

```
APP_PORT = 3001
CLIENT_URL = "http://localhost:3000"
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "sustainify"
DB_PWD = "mysql"
DB_NAME = "sustainify"
```

for vite base urls:
create .env folder under client and add the following
```
VITE_API_BASE_URL = "http://localhost:3001"
```

to start on creating your page:
1. /client/src/pages contains the folders for each feature
--> this is where the jsx files are which is like the html, refer to Homepage.jsx
2. After creating a file for your page, add the path and route in /client/src/App.jsx , at the bottom u can see examples


```
Commit changes:
git commit -m "message"
git checkout main
git merge <branchname>
git push -f

git pull
git checkout <branchname>
git pull
git merge main
git push
```