import axios from "axios";
import Country from "../models/Country.js";
import fs from "fs";
import path from "path";
import { createCanvas } from "canvas";

let lastRefreshTimestamp = null;

const randomMultiplier = () => Math.floor(Math.random() * 1001) + 1000; // 1000-2000

export const refreshCountries = async (req, res) => {
  try {
    // Fetch countries
    const countriesRes = await axios.get(
      "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies"
    );
    const countriesData = countriesRes.data;

    // Fetch exchange rates
    const exchangeRes = await axios.get("https://open.er-api.com/v6/latest/USD");
    const exchangeRates = exchangeRes.data.rates || {};

    const processed = countriesData.map((c) => {
      const name = c.name || null;
      const capital = c.capital || null;
      const region = c.region || null;
      const population = c.population || 0;

      let currency_code = null;
      let exchange_rate = null;
      let estimated_gdp = 0;

      if (Array.isArray(c.currencies) && c.currencies.length > 0) {
        currency_code = c.currencies[0].code || null;
        exchange_rate = currency_code ? exchangeRates[currency_code] || null : null;
        estimated_gdp = exchange_rate ? (population * randomMultiplier()) / exchange_rate : 0;
      }

      return {
        name,
        capital,
        region,
        population,
        currency_code,
        exchange_rate,
        estimated_gdp,
        flag_url: c.flag || null,
        last_refreshed_at: new Date(),
      };
    });

    // Upsert with bulkCreate (updateOnDuplicate for SQLite)
    await Country.bulkCreate(processed, {
      updateOnDuplicate: [
        "capital",
        "region",
        "population",
        "currency_code",
        "exchange_rate",
        "estimated_gdp",
        "flag_url",
        "last_refreshed_at",
      ],
    });

    lastRefreshTimestamp = new Date();

    // Generate summary image
    const top5 = processed
      .filter((c) => c.estimated_gdp)
      .sort((a, b) => b.estimated_gdp - a.estimated_gdp)
      .slice(0, 5);

    const imagePath = path.join(process.cwd(), "cache/summary.png");
    fs.mkdirSync(path.dirname(imagePath), { recursive: true });

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = "#000";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Total Countries: ${processed.length}`, 20, 50);
    ctx.fillText(`Last Refreshed: ${lastRefreshTimestamp.toISOString()}`, 20, 90);

    ctx.font = "bold 24px Arial";
    ctx.fillText("Top 5 Countries by Estimated GDP:", 20, 140);

    top5.forEach((c, i) => {
      ctx.font = "20px Arial";
      ctx.fillText(
        `${i + 1}. ${c.name} - ${c.estimated_gdp.toFixed(2)}`,
        40,
        180 + i * 40
      );
    });

    fs.writeFileSync(imagePath, canvas.toBuffer("image/png"));

    res.status(201).json({
      message: "Countries refreshed successfully.",
      totalCountries: processed.length,
    });
  } catch (err) {
    console.error("Refresh Error:", err.message);
    res.status(500).json({ error: "Failed to refresh countries data." });
  }
};

export const getAllCountries = async (req, res) => {
  try {
    const { region, currency, sort } = req.query;
    const where = {};
    if (region) where.region = region;
    if (currency) where.currency_code = currency;

    let order = [];
    if (sort === "gdp_desc") order = [["estimated_gdp", "DESC"]];
    if (sort === "gdp_asc") order = [["estimated_gdp", "ASC"]];

    const countries = await Country.findAll({ where, order });
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch countries." });
  }
};

export const getCountryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const country = await Country.findOne({ where: { name } });
    if (!country) return res.status(404).json({ error: "Country not found" });
    res.json(country);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch country." });
  }
};

export const deleteCountry = async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await Country.destroy({ where: { name } });
    if (!deleted) return res.status(404).json({ error: "Country not found" });
    res.json({ message: "Country deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete country." });
  }
};

export const getStatus = async (req, res) => {
  try {
    const totalCountries = await Country.count();
    res.json({
      total_countries: totalCountries,
      last_refreshed_at: lastRefreshTimestamp,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get status." });
  }
};

export const getSummaryImage = async (req, res) => {
  try {
    const imagePath = path.join(process.cwd(), "cache/summary.png");
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Summary image not found." });
    }
    res.setHeader("Content-Type", "image/png");
    res.sendFile(imagePath);
  } catch (err) {
    res.status(500).json({ error: "Failed to serve image." });
  }
};
