import fetch from "node-fetch";

export class CargoManager {


    getTimeByPoints = async (start, end) => {
        const result = await fetch('https://sekundomer.net/calcs/vremya-poleta-na-samolete/api.php?from=' + start + '&to=' + end)
            .then(res => res.json()).then(obj => obj.content).catch((error) => console.log(error));
        const time = result.match(/(-?\d+(\.\d+)?)/g).map(v => +v);
        return {
            hours: time[0],
            minutes: time[1],
            dateStart: Date.now()
        };
    }


    getScheme = (start, end) => {
        return Math.floor(Math.random() * 4 + 1);
    }

    getPositionOnScheme = (points) => {
        console.log(points.length);
        const res = Math.floor(Math.random() * points.length);
        console.log(res)
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


