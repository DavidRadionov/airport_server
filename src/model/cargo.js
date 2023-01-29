import { Client } from "./client.js";
import { Time } from "./time.js";
import { Route } from "./route.js";
import { Scheme } from "./scheme.js";

export class Cargo {
    client = new Client();
    time = new Time();
    route = new Route();
    scheme = new Scheme();
}