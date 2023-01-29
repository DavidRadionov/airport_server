import sqlite3 from "sqlite3";
import { User } from "./model/user.js";
import { NotificationObject } from "./model/notification.js";

export class DBManager {

    db = new sqlite3.Database('src/data/airportDB.db', sqlite3.OPEN_READWRITE);
    static managerDB;
    constructor() {
        if (!DBManager.managerDB) {
            DBManager.managerDB = this;
            return DBManager.managerDB;
        } else {
            console.log("Ошибка: ты пытаешься создать экземпляр класса DBManager. Экземлпяр класса DBManager уже создан");
        }
    }

    getDBManager() {
        return DBManager.managerDB;
    }

    addCargo = function (cargo) { //TODO

    }

    getCargoByID = function (id) { //TODO
        // return new Promise((resolve, reject) => {
        //     this.db.get("SELECT user_name, user_email, user_phone, id_role, personal_number FROM cargo WHERE id=" + id, function (err, row) {
        //         if (err) {
        //             return reject(err);
        //         } else if (row !== undefined) {
        //             console.log("row: ", row);
        //
        //         }
        //         resolve(user);
        //     });
        // });
    }

    removeCargoByID = function (id) {
        this.db.run("DELETE FROM cargo WHERE cargo_id=" + id);
    }

    getCargoListID = function () {
        const listID = {
            list: []
        }
        return new Promise((resolve, reject) => {
            this.db.all("SELECT id FROM cargo", function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    row.forEach(cargo => {
                        listID.list.push(cargo.id);
                    });
                    resolve(listID);
                }
            });
        });
    }

    removeScheme = function (name) {

    }

    getSchemes = function () {

    }

    updateUser = function (user) {
        console.log(user);
        this.db.run("UPDATE user SET name='" + user.name + "', email='" + user.email + "', phone='" + user.phone + "' WHERE personal_number=" + user.personal_number);
    }

    setMessage = function (message) {
        this.db.get("SELECT id FROM user WHERE email='" + message.recipientEmail + "'", function (err, row) {
            if (err) {
                console.log(err);
            } else if (row !== undefined) {
                console.log("row: ", row);
                const value = " ('" + message.message + "', '" + message.name + "', '" + message.email + "', " + message.codeError + ", " + row.id + ")";
                db.run("INSERT INTO notification (message, name, email, id_status, recipient) VALUES " + value);
            }
        });
    }

    getCites = async function () {
        const cities = {
            cities: []
        }
        return new Promise((resolve, reject) => {
            this.db.all("SELECT name FROM city", function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    row.forEach(city => {
                        cities.cities.push(city.name);
                    })
                }
                resolve(cities);
            });
        });

    }

    getNotificationsByID = async function (id = "") {
        const notifications = {
            notifications: []
        };
        console.log("id: ", id);
        return new Promise((resolve, reject) => {
            this.db.all("SELECT notification.message, notification.name, notification.email,  notification.id_status FROM notification INNER JOIN user ON user.id=notification.recipient  WHERE personal_number=" + id, function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    row.forEach(element => {
                        let message = new NotificationObject();
                        message.name = element.name;
                        message.email = element.email;
                        message.message = element.message;
                        message.codeError = element.id_status;
                        notifications.notifications.push(message);
                    });
                    resolve(notifications);
                }
            });
        });
    }

    authorization = async function (id = "") {
        let user = new User();
        console.log("id: ", id);

        return new Promise((resolve, reject) => {
            this.db.get("SELECT name, email, phone, id_role, personal_number FROM user WHERE personal_number=" + id, function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    user = new User();
                    user.name = row.name;
                    user.email = row.email;
                    user.phone = row.phone;
                    user.role = row.id_role;
                    user.personal_number = row.personal_number;
                    console.log("User : " + user.role);
                }
                resolve(user);
            });
        });
    };
}