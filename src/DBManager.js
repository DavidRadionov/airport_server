import sqlite3 from "sqlite3";
import { User } from "./model/user.js";
import { NotificationObject } from "./model/notification.js";
import { Cargo } from "./model/cargo.js";
import { Time } from "./model/time.js";
import { Route } from "./model/route.js";

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

    getCargoByID = function (id) {
        const cargo = new Cargo();
        console.log("2");
        return new Promise((resolve, reject) => {
            this.db.get("SELECT cargo.status_code, cargo.status_message, client.name AS clientName, client.email, client.phone" +
                ", route.city_start, route.city_end, route.position, scheme.name AS schemeName, time.hour, time.minute, time.second, time.date_now" +
                " FROM cargo INNER JOIN client ON client.id=cargo.id_client INNER JOIN route ON route.id=cargo.id_route " +
                " INNER JOIN scheme ON scheme.id=cargo.id_scheme INNER JOIN time ON time.id=cargo.id_time  WHERE cargo.id='" + id + "'", function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    cargo.id = id;
                    cargo.route.cityStart = row.city_start;
                    cargo.route.cityEnd = row.city_end;
                    cargo.route.position = row.position;
                    cargo.time.hours = row.hour;
                    cargo.time.minutes = row.minute;
                    cargo.time.seconds = row.second;
                    cargo.time.date_start = row.date_now;
                    cargo.statusMessage = row.status_message;
                    cargo.statusCode = row.status_code;
                    cargo.client.phone = row.phone;
                    cargo.client.email = row.email;
                    cargo.client.name = row.clientName;
                    cargo.scheme.name = row.schemeName;
                    resolve(cargo);
                }
                console.log(row);
            });

        });

    }


    getUsers = function () {
        const users = {
            users: []
        }
        return new Promise((resolve, reject) => {
            this.db.all("SELECT name, email, phone, id_role, personal_number FROM user WHERE id_role=1", function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    row.forEach(userRow => {
                        let user = new User();
                        user.name = userRow.name;
                        user.email = userRow.email;
                        user.phone = userRow.phone;
                        user.role = userRow.id_role;
                        user.personal_number = userRow.personal_number;
                        users.users.push(user);
                    });
                    resolve(users);
                }
            });
        });
    }

    getTimeByID = function (id) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT hour, minute, second, date_now FROM time WHERE id=" + id, function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    const time = new Time();
                    time.hours = row.hour;
                    time.minutes = row.minute;
                    time.seconds = row.second;
                    time.date_start = row.date_now;
                    resolve(time);
                }
            });
        });
    }

    getTimeByDateStart = function (date) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT id FROM time WHERE date_now=" + date, function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    resolve(row.id);
                }
            });
        });
    }

    getRouteByID = function (id) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT city_start, sity_end, position FROM route WHERE id=" + id, function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    const route = new Route();
                    route.cityStart = row.city_start;
                    route.cityEnd = row.city_end;
                    route.position = row.position;
                    resolve(route);
                }
            });
        });
    }

    addCargo = function (cargo) {
        const id_client = Math.floor(Math.random() * 10000000);
        const id_time = Math.floor(Math.random() * 10000000);
        const id_route = Math.floor(Math.random() * 10000000);
        const clientValue = " ('" + cargo.client.name + "', '" + cargo.client.email + "', '" + cargo.client.phone + "', " + id_client + ", '" + cargo.id + "')";
        console.log(clientValue);
        const timeValue = " (" + cargo.time.hours + ", " + cargo.time.minutes + ", " + cargo.time.seconds + ", " + cargo.time.data_start + "," + id_time + ")";
        const routeValue = " ('" + cargo.route.cityStart + "', '" + cargo.route.cityEnd + "', " + cargo.route.position + ", " + id_route + ")";
        const cargoValue = " ('" + cargo.id + "', " + id_time + ", " + cargo.scheme.id + ", " + id_route + ", " + id_client + "," + cargo.statusCode + ", '" + cargo.statusMessage + "')";

        this.db.run("INSERT INTO time ( hour, minute, second, date_now, id ) VALUES " + timeValue);
        this.db.run("INSERT INTO route ( city_start, city_end, position, id ) VALUES " + routeValue);
        this.db.run("INSERT INTO cargo ( id, id_time, id_scheme, id_route, id_client, status_code, status_message ) VALUES " + cargoValue);
        this.db.run("INSERT INTO client ( name, email, phone, id, id_cargo ) VALUES " + clientValue);
    }

    removeCargoByID = function (id) {
        this.db.run("DELETE FROM cargo WHERE id='" + id + "'");
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

    removeSchemeByName = function (name) {
        this.db.run("DELETE FROM scheme WHERE name='" + name + "'");
    }

    getSchemeByID = function (id) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT name FROM scheme WHERE id=" + id, function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    resolve(row.name);
                }
            });
        });
    }

    addScheme = function (name) {
        this.db.run("INSERT INTO scheme (name) VALUES ('" + name + "')");
    }


    removeCity = function (name) {
        this.db.run("DELETE FROM city WHERE name='" + name + "'");
    }

    addCity = function (name) {
        this.db.run("INSERT INTO city (name) VALUES ('" + name + "')");
    }


    addPoint = function (name) {
        this.db.run("INSERT INTO point (name) VALUES ('" + name + "')");
    }

    getPointBySchemeName = function (name) {
        const points = {
            points: []
        }
        return new Promise((resolve, reject) => {
            this.db.all("SELECT connection.point_position, point.name  FROM connection INNER JOIN scheme ON scheme.id=connection.id_scheme INNER JOIN point ON point.id=connection.id_point WHERE scheme.name='" + name + "'", function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row.length !== 0) {
                    console.log("row: ", row);
                    row.forEach(point => {
                        console.log(point);
                        points.points.push({
                            name: point.name,
                            numb: point.point_position
                        });
                    });
                    points.points.sort((point, point2) => point.point - point2.point);
                    resolve(points);
                } else {
                    reject(err)
                }

            });
        });
    }

    getSchemesName = function () {
        const schemes = {
            schemes: []
        }
        return new Promise((resolve, reject) => {
            this.db.all("SELECT name FROM scheme", function (err, row) {
                if (err) {
                    return reject(err);
                } else if (row !== undefined) {
                    console.log("row: ", row);
                    row.forEach(scheme => {
                        schemes.schemes.push(scheme.name);
                    })
                }
                resolve(schemes);
            });
        });
    }

    updateUser = function (user) {
        console.log(user);
        if (user.target !== "create") {
            this.db.run("UPDATE user SET name='" + user.name + "', email='" + user.email + "', phone='" + user.phone + "' WHERE personal_number=" + user.personal_number);
        } else {
            const value = "('" + user.name + "', '" + user.phone  + "', '" +user.email + "', " + user.role + ", '" + user.personal_number+ "')";
            this.db.run("INSERT INTO user (name, phone, email, id_role, personal_number) VALUES " + value);
        }

    }
    // Привет, очень приятный дизайн, спасибо за обнову!
    setMessage = function (message) {
        console.log(message);
        let result = new Promise((resolve, reject) => {
                this.db.get("SELECT id FROM user WHERE email='" + message.recipientEmail + "'", function (err, row) {
                    if (err) {
                        console.log(err);
                    } else if (row !== undefined) {
                        console.log("row: ", row);
                        resolve(row.id);
                    }
                });
            });
        result.then(id => {
            const value = " ('" + message.message + "', '" + message.name + "', '" + message.email + "', " + message.codeError + ", " + id + ")";
            this.db.run("INSERT INTO notification (message, name, email, id_status, recipient) VALUES " + value);
        })

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
            this.db.all("SELECT notification.message, notification.name, notification.email,  notification.id_status FROM notification INNER JOIN user ON user.id=notification.recipient  WHERE user.personal_number='" + id + "'", function (err, row) {
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
                    notifications.notifications.reverse();
                    resolve(notifications);
                }
            });
        });
    }

    authorization = async function (id = "") {
        let user = new User();
        console.log("id: ", id);

        return new Promise((resolve, reject) => {
            this.db.get("SELECT name, email, phone, id_role, personal_number FROM user WHERE personal_number='" + id + "'", function (err, row) {
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