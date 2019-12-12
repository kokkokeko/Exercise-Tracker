# Exercise Tracker REST API

#### A microservice project, part of Free Code Camp's curriculum

### ユーザーストーリー
1. フォームにユーザネームを入力すると POST [project_url]/api/exercise/new-user を通してuserを作成します。JSON形式で{_id: ?, username: ?}を表示します。
2. GET [project_url]/api/exercise/usersで全てのユーザをJSON形式で表示します。
3.　フォームにuserId(_id), description, duration,（任意で)dateを入力すると POST /api/exercise/addを通してExercise(Log)を作成します。JSON形式で{_id: ?, username: ?, description: ?, duration: ?, date: ?}を表示します。
4. GET [project_url]/api/exercise/log?userId=yourUserIdで入力されたパラメータuserIdが登録した全てのExercise(Log)を表示します。
5. 任意のパラメータfrom, to, limitを使うとその条件にあったLogを表示します。(Date format yyyy-mm-dd, limit = int)

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
