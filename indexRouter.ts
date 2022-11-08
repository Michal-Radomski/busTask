import * as dotenv from "dotenv";
dotenv.config();
import express, { Router, Request, Response } from "express";
import axios from "axios";
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

const url1 = process.env.url1 as string;
const url2 = process.env.url2 as string;
const url3 = process.env.url3 as string;

const fetchData = async (dataURL: string) => {
  let timeArray: number[] = [];
  let newestTime: number;

  try {
    const response = await axios.get(dataURL, {
      responseType: "arraybuffer",
    });

    const feed = await GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(response?.data);
    // console.log({feed});
    feed.entity.forEach(function (entity: { tripUpdate: { stopTimeUpdate: { departure: { time: { low: number } } }[] } }) {
      for (let i = 0; i < entity.tripUpdate.stopTimeUpdate.length; i++) {
        // console.log(entity.tripUpdate.stopTimeUpdate[i].departure?.time.low);
        if (entity.tripUpdate.stopTimeUpdate[i].departure?.time.low !== undefined) {
          timeArray.push(entity.tripUpdate.stopTimeUpdate[i].departure?.time.low);
        }
      }
    });
    // console.log({ timeArray }, timeArray.length);
    if (timeArray.length === 0) {
      return "No Data";
    }
    newestTime = Math.max(...timeArray);
    // console.log({ newestTime });
    const newestTimeString = new Date(newestTime * 1000).toUTCString();
    return newestTimeString;
  } catch (error) {
    console.error({ error });
    return "No Data";
  }
};

const fetchData2 = async (dataURL: string) => {
  let timeArray: number[] = [];
  let newestTime: number;

  try {
    const response = await axios.get(dataURL, {
      responseType: "arraybuffer",
    });
    const fetchedData = response.data.toString();
    // console.log({fetchedData});
    const array = fetchedData.split(" ");
    // console.log({ array });
    const validNumbers = array.filter(Number);
    // console.log({validNumbers});
    const toNumbers = validNumbers.map(Number);
    // console.log({toNumbers});
    timeArray = toNumbers.filter((number: number) => number > 166000000);
    timeArray = timeArray.slice(1); //* Remove first timestamp
    // console.log({ timeArray }, timeArray.length);
    if (timeArray.length === 0) {
      return "No Data";
    }
    newestTime = Math.max(...timeArray);
    // console.log({ newestTime });
    const newestTimeString = new Date(newestTime * 1000).toUTCString();
    return newestTimeString;
  } catch (error) {
    console.error({ error });
    return "No Data";
  }
};

let TC_Swarzedz: string[] = [];
let TC_Sroda: string[] = [];
let GPS_Wroclaw: string[] = [];

const timesObject = {
  TC_Swarzedz: TC_Swarzedz,
  TC_Sroda: TC_Sroda,
  GPS_Wroclaw: GPS_Wroclaw,
};

async function takeIntervalData() {
  console.log("Data fetched at:", new Date().toLocaleTimeString());
  const lastDateUrl1 = await fetchData(url1);
  TC_Swarzedz.push(lastDateUrl1!);
  const lastDateUrl2 = await fetchData(url2);
  TC_Sroda.push(lastDateUrl2!);
  const lastDateUrl3 = await fetchData2(url3);
  GPS_Wroclaw.push(lastDateUrl3!);
}

const indexRouter: Router = express.Router();

let fetchInterval: NodeJS.Timeout;

indexRouter.get("/", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);
  res.render("pages/index", {});

  if (timesObject.TC_Swarzedz.length === 0 || timesObject.TC_Sroda.length === 0 || timesObject.GPS_Wroclaw.length === 0) {
    takeIntervalData();
    fetchInterval = setInterval(takeIntervalData, 60000);
  }
});

indexRouter.get("/api", (_req: Request, res: Response) => {
  res.status(200).json({ timesObject: timesObject });
});

indexRouter.get("/reset", (_req: Request, res: Response) => {
  res.send("<h1 style='text-align:center; margin-top: 3rem'>Arrays have been reset</h1>");
  timesObject.TC_Swarzedz.length = 0;
  timesObject.TC_Sroda.length = 0;
  timesObject.GPS_Wroclaw.length = 0;
  clearInterval(fetchInterval);
});

export default indexRouter;
