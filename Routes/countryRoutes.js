import express from "express";
import {
  refreshCountries,
  getAllCountries,
  getCountryByName,
  deleteCountry,
  getStatus,
  getSummaryImage,
} from "../controllers/countryController.js";

const router = express.Router();

router.post("/refresh", refreshCountries);
router.get("/", getAllCountries);
router.get("/:name", getCountryByName);
router.delete("/:name", deleteCountry);
router.get("/image", getSummaryImage);
router.get("/status", getStatus);

export default router;
