const express = require('express');
const app = express();
const body_parser = require('body-parser');
app.use(body_parser.json());
const fs = require('fs');
const { uid } = require('uid');
const cors = require('cors')

app.use(cors())

const db = {
    create: function (new_user, id) {

        const users = this.read();

        if (!id) new_user.id = uid(20);
        else new_user.id = id;

        users.push(new_user);

        fs.writeFileSync(`./dataSet.json`, JSON.stringify(users));

        return new_user;
    },
    read: function () {
        return JSON.parse(Buffer.from(fs.readFileSync('./dataSet.json').toString('utf-8')));
    },
    update: function (id, change_type, new_password) {

        const users = this.read();

        for (const user of users) {
            if(user.id == id) {
                user[change_type] = new_password;

                this.delete([id]);

                this.create(user, id);

                return user;
            }
        }
    },
    delete: function (id_mass) {

        const users = this.read();

        let deleted_users = []

        for(let i = 0; i < users.length; i++) {
            if (id_mass.includes(users[i].id)) {
                deleted_users.push(users[i]);
                users.splice(i, 1);
                i--;
            }
        }

        fs.writeFileSync(`./dataSet.json`, JSON.stringify(users));

        return deleted_users;
    }
}

const registration_handler = function(req, res) {

    const body = req.body;

    let {login, password, try_password} = body;

    const users = db.read();

    for(const user of users) if(user.login === login) return res.json({ message: 'this login is already in use', status: 'Error', payload: body });

    if(login.length < 8 || login.length > 128) return res.json({ message: 'incorrect length of login', status: 'Error', payload: body });

    if(password.length < 8 || password.length > 256) return res.json({ message: 'incorrect length of password', status: 'Error', payload: body });

    if(password !== try_password) return res.json({ message: 'не идентичный пароль', status: 'Error', payload: body });

    const new_user = db.create({login, password});

    return res.json({message:'Успешно добавлен новый пользователь', status:'ok', payload: new_user});
}

const authorization_handler = function(req, res) {

    const body = req.body;

    let {login, password} = body;

    const users = db.read();

    for(const user of users) {
        if(user.login === login && user.password === password) {
            return res.json({message:'Успешно вошли в аккаунт', status:'ok', payload: {user, is_auth: true}});
        }
    }
    return res.json({message:'Такого пользователя не существует', status:'error', payload: {is_auth: false}});
}

const get_users_handler = function(req, res) {
    const users = db.read();

    return res.json({message:'Все пользователи', status:'ok', payload: users});
}

const get_user_by_id_handler = function(req, res) {
    const { id } = req.params;

    if (!id) return res.json({message:'Не корректный ID пользователя', status:'error', payload: {id}});

    console.log(id);

    const users = db.read();

    for(const user of users) if(user.id == id) return res.json({message:`User login:${user.login}`, status:'ok', payload: user});

    return res.json({message:'Такой пользователь отсуствует', status:'error', payload: {id}});
}

const delete_users_handler = function(req, res) {

    const {ids} = req.body;
    console.log(req.body)
    console.log(ids)

    if(!Array.isArray(ids)) return res.json({message:'Это не массив', status:'error', payload: {ids}});

    if(ids.length <= 0) return res.json({message:'Не корректная длина массива', status:'error', payload: {ids}});        

    const deleted_users = db.delete(ids);

    return res.json({message:'Все удаленные пользователи', status:'ok', payload: deleted_users});

}

const change_user_password_handler = function(req, res) {

    const body = req.body;

    console.log(body);

    let {id, old_password, try_old_password, new_password} = body;

    if(old_password !== try_old_password) return res.json({message:'не идентичный пароль', status:'error', payload: body});

    if(new_password.length < 8 || new_password.length > 256) return res.json({ message: 'incorrect length of password', status: 'Error', payload: body });

    let updated_user = db.update(id, 'password', new_password);

    return res.json({message:'Пароль успешно изменен', status:'ok', payload: updated_user});
}

app.post('/registration', registration_handler);

app.post('/authorization', authorization_handler);

app.get('/users', get_users_handler);

app.get('/user/:id', get_user_by_id_handler);

app.post('/delete', delete_users_handler);

app.post('/users/change_password', change_user_password_handler);

app.listen(3000);



///////////////////////////////////////////////////////////////////////////////////////////////////////

// http://127.0.0.1:3000/users/change_password

/*
{
  "id":1,
  "old_password":"asd",
  "try_old_password": "asd",
  "new_password":"qwertyuiop"
}
*/

/*
{"id":1,"login":"123","password":"asd"}, {"id":2,"login":"12345678","password":"asdfghjk"}
*/

/*
{
 "id": 1,
 "new_password":"zxc"
}
*/