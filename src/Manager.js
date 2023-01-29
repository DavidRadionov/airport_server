import { Cargo } from "./model/cargo.js";
import { Client } from "./model/client.js";

export class Manager {
    cargo = new Cargo();
    client = new Client();

    constructor(dbManager, cargoManager) {
        this.cargoManager = cargoManager;
        this.dbManager = dbManager;
    }
    clientInfo = {
        name: null,
        id: null,
        hours: null,
        minutes: null,
        seconds: null,
        dateStart: null,
        points: [],
        email: null,
        phone: null,
        status: {
            message: null,
            code: null
        },
        position: {
            name: null,
            numb: null,
        }
    }

    employeeInfo = {
        myName: null,
        id: null,
        hours: null,
        minutes: null,
        seconds: null,
        dateStart: null,
        pointsClient: [],
        pointsScheme: [],
        schemeName: null,
        status: {
            message: null,
            code: null
        },
        positionClient: {
            name: null,
            numb: null,
        },
        positionScheme: {
            name: null,
            numb: null,
        }
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


    getCargoForEmployeeByID = (id) => {
        const result = fs.readFileSync("data/users/forEmployee/" + id + ".json", "utf-8");
        const resultObj = JSON.parse(result);
        console.log(resultObj);
        const timeDifferent = Date.now() - resultObj.dateStart;
        console.log(resultObj.dateStart);
        console.log(Date.now());
        console.log(timeDifferent);

        let hours = resultObj.hours - parseInt((timeDifferent / (1000 * 60 * 60)) % 24);
        let minutes = resultObj.minutes - parseInt((timeDifferent / (1000 * 60)) % 60);
        let seconds = resultObj.seconds - parseInt((timeDifferent / 1000) % 60);
        if (minutes === 0 && hours > 0) {
            hours -= 1;
            minutes = 59;
        }
        if (seconds === 0 && minutes > 0) {
            minutes -= 1;
            seconds = 60;
        }
        resultObj.hours = (hours > 0) ? hours : 0;
        resultObj.minutes = (minutes > 0) ? minutes : 0;
        resultObj.seconds = (seconds > 0) ? seconds : 0;
        return resultObj;
    }

    getCargoForClientByID = (id) => {
        const result = fs.readFileSync("data/users/forClient/" + id + ".json", "utf-8");
        const resultObj = JSON.parse(result);
        const timeDifferent = Date.now() - resultObj.dateStart;
        let hours = resultObj.hours - parseInt((timeDifferent / (1000 * 60 * 60)) % 24);
        let minutes = resultObj.minutes - parseInt((timeDifferent / (1000 * 60)) % 60);
        let seconds = resultObj.seconds - parseInt((timeDifferent / 1000) % 60);
        if (minutes === 0 && hours > 0) {
            hours -= 1;
            minutes = 59;
        }
        if (seconds === 0 && minutes > 0) {
            minutes -= 1;
            seconds = 60;
        }
        resultObj.hours = (hours > 0) ? hours : 0;
        resultObj.minutes = (minutes > 0) ? minutes : 0;
        resultObj.seconds = (seconds > 0) ? seconds : 0;
        return resultObj;
    }

    removeCity = (city) => {
        let citiesObj = JSON.parse(fs.readFileSync("data/airport/cities.json", "utf-8"));
        citiesObj.cities = citiesObj.cities.filter(cityElement => cityElement !== city);
        fs.writeFileSync("data/airport/cities.json", JSON.stringify(citiesObj), "utf-8");
    }

    addCity = (city) => {
        const citiesObj = JSON.parse(fs.readFileSync("data/airport/cities.json", "utf-8"));
        if (!citiesObj.cities.includes(city)) {
            citiesObj.cities.push(city);
            fs.writeFileSync("data/airport/cities.json", JSON.stringify(citiesObj), "utf-8");
        } else {
            console.log("такой город уже существует");
        }
    }

    saveBaggage = (data, id) => {

        let name = data.name;
        let startPoint = data.startPoint;
        let endPoint = data.endPoint;
        let time =   this.cargoManager.getTimeByPoints(startPoint, endPoint);
        console.log("time: " + time.hours + "," + time.minutes);
        let pathClient = "data/users/forClient/" + id + ".json";
        let pathEmployee = "data/users/forEmployee/" + id + ".json";

        let infoEmployee = employeeInfo;
        let info = clientInfo;

        infoEmployee.name = name;
        infoEmployee.id = id;
        infoEmployee.hours = time.hours;
        infoEmployee.minutes = time.minutes;
        infoEmployee.seconds = 60;
        infoEmployee.dateStart = time.dateStart;
        infoEmployee.pointsClient = getPointsClient(startPoint, endPoint);
        // infoEmployee.pointsScheme = []
        // infoEmployee.positionScheme = infoEmployee.points[0];
        infoEmployee.positionClient = infoEmployee.pointsClient[0];

        infoEmployee.status.code = 200;
        infoEmployee.status.message = "В пути";
        infoEmployee.phone = data.phone;
        infoEmployee.email = data.email;

        info.myName = name;
        info.id = id;
        info.hours = time.hours;
        info.minutes = time.minutes;
        info.seconds = 60;
        info.dateStart = time.dateStart;
        info.points = getPointsClient(startPoint, endPoint);
        info.position = info.points[0];
        info.status.code = 200;
        info.status.message = "В пути";
        console.log(infoEmployee);
        console.log(info);
        fs.writeFileSync(pathClient, JSON.stringify(info), function (error) {
            if (error) throw error; // ошибка чтения файла, если есть
            console.log('Данные успешно записаны записать файл');
        });
        fs.writeFileSync(pathEmployee, JSON.stringify(infoEmployee), function (error) {
            if (error) throw error; // ошибка чтения файла, если есть
            console.log('Данные успешно записаны записать файл');
        });

    }
}
