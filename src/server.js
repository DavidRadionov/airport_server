import express from "express";
import {
    Manager,
} from "./Manager.js";
import { DBManager } from "./DBManager.js";
import { CargoManager } from "./CargoManager.js";

const app = express();
const GLOBAL_URL = "http://192.168.0.47:3000/client/";
// const GLOBAL_URL = "http://172.20.10.2:3001/client/";
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());

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

app.get("/removeCargoByID/:id", (req, res) => {
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

app.get("/addScheme/:scheme", (req, res) => {
    const scheme = req.params["scheme"];
    dbManager.addScheme(scheme);
})

app.get("/removeScheme/:scheme", (req, res) => {
    const scheme = req.params["scheme"];
    dbManager.removeSchemeByName(scheme);
})

app.get("/getSchemes", async (req, res) => {
    const schemes = await dbManager.getSchemesName();
    res.json(schemes);
})

app.get("/getStateBaggageByID/:id", async (req, res) => {
    const id = req.params["id"];
    const result = await manager.getCargoForClientByID(id);
    res.json(result);
})

app.get("/getCities", async (req, res) => {
    const cities = await dbManager.getCites();
    res.json(cities);
})

app.get("/getUsers", async (req, res) => {
    const users = await dbManager.getUsers();
    res.json(users);
})

app.get("/addCity/:city", (req, res) => {
    const city = req.params["city"];
    dbManager.addCity(city);
})

app.get("/removeCity/:city", (req, res) => {
    const city = req.params["city"];
    dbManager.removeCity(city);
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