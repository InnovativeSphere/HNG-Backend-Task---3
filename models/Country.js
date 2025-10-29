import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Country = sequelize.define("Country", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capital: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  population: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  currency_code: {
    type: DataTypes.STRING,
    allowNull: true, // allow null for countries with no currency
  },
  exchange_rate: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  estimated_gdp: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  flag_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_refreshed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Country;
