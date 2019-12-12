# Exercise Tracker REST API

#### A microservice project, part of Free Code Camp's curriculum

### ユーザーストーリー
1. userを作成<br>
POST [project_url]/api/exercise/new-user<br>
input : username<br>
output : JSON {_id: ?, username: ?}
2. 全てのユーザを表示<br>
GET /api/exercise/users
3. Exercise(Log)を作成<br>
POST /api/exercise/add<br>
input ：userId(_id), description, duration,（任意で)date<br>
output : JSON {_id: ?, username: ?, description: ?, duration: ?, date: ?}
4. yourIdが登録した全てのExercise(Log)を表示<br>
GET /api/exercise/log?userId=yourId
5. from, to, limitでその条件にあったLogを表示<br>
GET /api/exercise/log?userId=yourId&limit=3&to=2019-12-11<br>
(Date format yyyy-mm-dd, limit = int)

## Configuration
```
$ cat > .env RET
MLAB_URI=<your_mongodb_url>
```

### User Stories

1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)
