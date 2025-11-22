import React, { useState, useEffect } from "react";
import "./ToggleSwitch.css";
import { use } from "react";

function ToggleSwitch({ tempUnit, setTempUnit }) {
  function handleChange() {
    setTempUnit(tempUnit === "F" ? "C" : "F");
  }

  return (
    <label htmlFor="toggle-switch" className="toggle-switch">
      <input
        id="toggle-switch"
        type="checkbox"
        className="toggle-switch__checkbox"
        checked={tempUnit === "C"}
        onChange={handleChange}
      />
      <span className="toggle-switch__circle"></span>
      <span className="toggle-switch__value toggle-switch__value_left">F</span>
      <span className="toggle-switch__value toggle-switch__value_right">C</span>
    </label>
  );
}

export default ToggleSwitch;
