import express from "express";
import {
    Manager,
} from "./Manager.js";
import { DBManager } from "./DBManager.js";
import { CargoManager } from "./CargoManager.js";
import fetch from 'node-fetch';

const app = express();
const RUN_URL = "http://127.0.0.1:3000/login"
// const GLOBAL_URL = "http://192.168.0.48:3000/client/";
const GLOBAL_URL = "http://172.20.10.2:3001/client/";
console.log(RUN_URL);
console.log( Date.now());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());

const schemes = {
    schemes: [
        {
            name: "something",
            points: []
        },
        {
            name: "something1",
            points: []
        },
        {
            name: "something2",
            points: []
        },
        {
            name: "something3",
            points: []
        },
        {
            name: "something4",
            points: []
        },
        {
            name: "something5",
            points: []
        },
        {
            name: "something6",
            points: []
        },
        {
            name: "something7",
            points: []
        },
        {
            name: "something8",
            points: []
        },
        {
            name: "something9",
            points: []
        },
        {
            name: "something10",
            points: []
        },
        {
            name: "something11",
            points: []
        }
    ]
}
const cargoManager = new CargoManager();
const dbManager = new DBManager();
const manager = new Manager(dbManager, cargoManager);

app.post("/sendMessage", (req, res) => {
    const message = req.body
    dbManager.setMessage(message);
});

app.post("/updateUser", (req, res) => {
    const user = req.body
    dbManager.updateUser(user);
});

app.use('/login/:password', async (req, res) => {
    const password = req.params["password"];
    const user = await dbManager.authorization(password);
    if (user.role === "") {
        res.json({error: "Неверный личный номер"});
    } else {
        console.log(user);
        res.json(user);
    }
});

app.use('/images', express.static('./images'));

app.get("/getProfileByID/:id", (req, res) => {
    const id = req.params["id"];
    res.json(profile);
})

app.get("/removeCargoByID", (req, res) => {
    const id = req.params["id"];
    dbManager.removeCargoByID(id);
    console.log("id");
})

app.get("/getCargoByID/:id", async (req, res) => {
    const id = req.params["id"];
    const cargo = await manager.getCargoForEmployeeByID(id);
    console.log(cargo);
    res.json(cargo);
})

app.get("/getCargoListID", async (req, res) => {
    const list = await dbManager.getCargoListID();
    res.json(list);
})

app.get("/getNotificationsByID/:id", async (req, res) => {
    const id = req.params["id"];
    const notifications = await dbManager.getNotificationsByID(id)
    res.json(notifications);
})

app.get("/removeScheme", (req, res) => {
    const scheme = req.params["scheme"];
    dbManager.removeScheme(scheme);
})

app.get("/getSchemes", async (req, res) => {
    const schemes = await dbManager.getSchemes();
    res.json(schemes);
})

app.get("/getStateBaggageByID/:id", (req, res) => {
    const id = req.params["id"];
    const result = manager.getCargoForClientByID(id);
    res.json(result);
})

app.get("/getCities", async (req, res) => {
    const cities = await dbManager.getCites();
    res.json(cities);
})

app.get("/addCity/:city", (req, res) => {
    const city = req.params["city"];
    manager.addCity(city);
})

app.get("/removeCity/:city", (req, res) => {
    const city = req.params["city"];
    manager.removeCity(city);
})

app.post("/getURL", (req, res) => {
    const json = req.body
    const id = manager.createID();
    manager.saveBaggage(json, id);
    res.json({res: GLOBAL_URL + id});
})

// app.use(express.static(path.join(__dirname, 'build')));
//

// app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'build', 'index.html')));
app.listen(3001);