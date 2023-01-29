import fs from "fs";
import fetch from "node-fetch";

//TODO: ----------------------------------------

export class CargoManager {
    setStatusBaggage = () => {

    }
    getStatusBaggage = () => {

    }

    setNextPointByBaggage = () => {

    }
//TODO: ----------------------------------------

//TODO: добавить симуляцию запросов на сервер на прохождение опредленной точки или этапа + реализация на сервере
//TODO: добавить информацию о сети аэропорта

    getTimeByPoints = async (start, end) => {
        const result = await fetch('https://sekundomer.net/calcs/vremya-poleta-na-samolete/api.php?from=' + start + '&to=' + end)
            .then(res => res.json()).then(obj => obj.content).catch((error) => console.log(error));
        // 'Из "Минск" в "Ласвегас" лететь в среднем 11 часов 43 минуты'

        let res = {
            hours: 0,
            minutes: 37,
            dateStart: 0
        }

        res.dateStart = Date.now();

        return res;
    }

    getPointsClient = (start, end) => {
        return [
            {
                name: start,
                numb: 0
            },
            {
                name: "Летит",
                numb: 1
            },
            {
                name: end,
                numb: 2
            },
        ]

    }
}


