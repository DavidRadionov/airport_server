import { Cargo } from "./model/cargo.js";
import { Client } from "./model/client.js";

class EmployeeCargo {
    name = null;
    id = null;
    hours = null;
    minutes = null;
    seconds = null;
    dateStart = null;
    email = null;
    phone = null;
    pointsClient = [];
    pointsScheme = [];
    schemeName = null;
    status = {
        message: null,
        code: null
    };
    positionClient = {
        name: null,
        numb: null,
    };
    positionScheme = {
        name: null,
        numb: null,
    }
}

class ClientCargo  {
    name = null;
    id = null;
    hours = null;
    minutes = null;
    seconds =  null;
    dateStart = null;
    points = [];
    email = null;
    phone = null;
    status = {
        message: null,
        code: null
    };
    position = {
        name: null,
        numb: null,
    }
}

export class Manager {
    client = new Client();

    constructor(dbManager, cargoManager) {
        this.cargoManager = cargoManager;
        this.dbManager = dbManager;
    }

    createID = () => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 7; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }


    getCargoForEmployeeByID = async (id) => {
        console.log(id)
        const cargo = new EmployeeCargo();
        const cargoDB = await this.dbManager.getCargoByID(id);

        console.log("db cargo result to manager: " + cargoDB);
        const timeDifferent = Date.now() - cargoDB.time.date_start;

        let hours = cargoDB.time.hours - parseInt((timeDifferent / (1000 * 60 * 60)) % 24);
        let minutes = cargoDB.time.minutes - parseInt((timeDifferent / (1000 * 60)) % 60);
        let seconds = cargoDB.time.seconds - parseInt((timeDifferent / 1000) % 60);
        if (minutes === 0 && hours > 0) {
            hours -= 1;
            minutes = 59;
        }
        if (seconds === 0 && minutes > 0) {
            minutes -= 1;
            seconds = 60;
        }
        cargoDB.time.hours = (hours > 0) ? hours : 0;
        cargoDB.time.minutes = (minutes > 0) ? minutes : 0;
        cargoDB.time.seconds = (seconds > 0) ? seconds : 0;

        cargo.name = cargoDB.client.name;
        cargo.email = cargoDB.client.email;
        cargo.phone = cargoDB.client.phone;
        cargo.id = cargoDB.id;
        cargo.hours = cargoDB.time.hours;
        cargo.seconds = cargoDB.time.seconds;
        cargo.minutes = cargoDB.time.minutes;
        cargo.schemeName = cargoDB.scheme.name;
        cargo.dateStart = cargoDB.time.date_start;
        cargo.status.code = cargoDB.statusCode;
        cargo.status.message = cargoDB.statusMessage;
        const points = await this.dbManager.getPointBySchemeName(cargoDB.scheme.name);
        points.points.forEach(point => {
            cargo.pointsScheme.push(point);
        })
        // this.employeeInfo.pointsScheme = await this.dbManager.getPointBySchemeName(cargo.scheme.name);
        cargo.pointsClient = [{name: cargoDB.route.cityStart, numb: 0}, {name: "Летит", numb: 1}, {name: cargoDB.route.cityEnd, numb: 1}];
        cargo.positionClient = cargo.pointsClient[cargoDB.route.position];
        cargo.positionScheme = cargo.pointsScheme[this.cargoManager.getPositionOnScheme(cargo.pointsScheme)];
        console.log(cargo);
        return cargo;
    }

    getCargoForClientByID = async (id) => {
        const cargoDB = await this.dbManager.getCargoByID(id);
        const cargo = new ClientCargo();
        const timeDifferent = Date.now() - cargoDB.time.date_start;
        let hours = cargoDB.time.hours - parseInt((timeDifferent / (1000 * 60 * 60)) % 24);
        let minutes = cargoDB.time.minutes - parseInt((timeDifferent / (1000 * 60)) % 60);
        let seconds = cargoDB.time.seconds - parseInt((timeDifferent / 1000) % 60);
        if (minutes === 0 && hours > 0) {
            hours -= 1;
            minutes = 59;
        }
        if (seconds === 0 && minutes > 0) {
            minutes -= 1;
            seconds = 60;
        }
        cargoDB.time.hours = (hours > 0) ? hours : 0;
        cargoDB.time.minutes = (minutes > 0) ? minutes : 0;
        cargoDB.time.seconds = (seconds > 0) ? seconds : 0;
        cargo.dateStart = cargoDB.time.date_start;
        cargo.name = cargoDB.client.name;
        cargo.email = cargoDB.client.email;
        cargo.phone = cargoDB.client.phone;
        cargo.id = cargoDB.id;
        cargo.hours = cargoDB.time.hours;
        cargo.seconds = cargoDB.time.seconds;
        cargo.minutes = cargoDB.time.minutes;
        cargo.status.code = cargoDB.statusCode;
        cargo.status.message = cargoDB.statusMessage;
        cargo.points = [{name: cargoDB.route.cityStart, numb: 0}, {
            name: "Летит",
            numb: 1
        }, {name: cargoDB.route.cityEnd, numb: 1}];
        cargo.position = cargo.points[cargoDB.route.position];
        // cargo.position.name =  this.clientInfo.points[cargo.route.position];
        console.log(cargo);
        return cargo;
    }

    removeCity = (city) => {
    }

    addCity = (city) => {
    }

    saveBaggage = async (data, id) => {
        let startPoint = data.startPoint;
        let endPoint = data.endPoint;
        let time = await this.cargoManager.getTimeByPoints(startPoint, endPoint);
        const schemeID = this.cargoManager.getScheme();
        console.log("time: " + time.hours + "," + time.minutes);
        const cargo = new Cargo();
        cargo.id = id;
        cargo.client.name = data.name;
        cargo.client.email = data.email;
        cargo.client.phone = data.phone;
        cargo.route.cityStart = startPoint;
        cargo.route.cityEnd = endPoint;
        cargo.route.position = 0;
        cargo.time.hours = time.hours;
        cargo.time.minutes = time.minutes;
        cargo.time.seconds = 59;
        cargo.time.data_start = time.dateStart;
        cargo.scheme.id = schemeID;
        cargo.statusCode = 200;
        cargo.statusMessage = "В пути";
        console.log(cargo);
        this.dbManager.addCargo(cargo);
    }
}
