import "./styles.css";
import DatePicker from "../../../components/DatePicker";
import { useStepperContext } from "../../Drugs/StepperContext";
import React, { useState, useEffect } from "react";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const DrugRegistryForm = () => {
  const {
    formData,
    handleInputChange,
    currencySymbols,
    exchangeRates,
    convertToUSD,
    convertToLBP,
    datePickerOptions,
    getTitle,
    inputOptions,
    addSpacesToInputName,
    AddModal,
    handleEdit,
    EditModal,
    openAddModal,
    openEditModal,
    handleAdd,
    handleCancel,
    selectedInput,
    editInputValue,
    isAddModalOpen,
    isEditModalOpen,
    setAddModalOpen,
    setEditModalOpen,
    drugNames,
  } = useStepperContext();

  // State for calculated price and stratum
  const [publicPrice, setPublicPrice] = useState("");
  const [stratumCode, setStratumCode] = useState("");
  const [isRegularRate, setIsRegularRate] = useState(true); // Checkbox for rate type

  // Function to calculate price using the API
  const calculatePrice = async () => {
    // If PriceForeign or CargoShippingTerms are missing, clear calculated fields
    if (!formData.PriceForeign || !formData.CargoShippingTerms) {
      setPublicPrice("");
      setStratumCode("");
      return;
    }
  
    const requestBody = {
      price: parseFloat(formData.PriceForeign),
      isFOB: formData.CargoShippingTerms === "FOB",
      rateType: isRegularRate ? "regular" : "special",
    };
  
    try {
      const response = await axios.post("/api/stratum/calculatePrice", requestBody, {
        headers: { "Content-Type": "application/json" },
      });
  
      const { publicPrice, stratumCode } = response.data;
      setPublicPrice(publicPrice);
      setStratumCode(stratumCode);
    } catch (error) {
      console.error("Error calculating price:", error);
      setPublicPrice("");
      setStratumCode("");
    }
  };

  // Auto-trigger price calculation when PriceForeign, CargoShippingTerms, or rate type changes
  useEffect(() => {
    calculatePrice();
  }, [formData.PriceForeign, formData.CargoShippingTerms, isRegularRate]);

  // Updated function to handle select changes for Manufacturer and ResponsibleParty
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "Manufacturer") {
      const selectedManufacturer = inputOptions.Manufacturer.find((m) => m.id == value);
      handleInputChange({
        target: {
          name: "ManufacturerId",
          value: selectedManufacturer ? selectedManufacturer.id : "",
        },
      });
      handleInputChange({
        target: {
          name: "Manufacturer",
          value: selectedManufacturer ? selectedManufacturer.name : "",
        },
      });
    } else if (name === "ResponsibleParty") {
      const selectedResponsibleParty = inputOptions.ResponsibleParty.find((m) => m.id == value);
      handleInputChange({
        target: {
          name: "ResponsiblePartyId",
          value: selectedResponsibleParty ? selectedResponsibleParty.id : "",
        },
      });
      handleInputChange({
        target: {
          name: "ResponsibleParty",
          value: selectedResponsibleParty ? selectedResponsibleParty.name : "",
        },
      });
    } else {
      handleInputChange(e);
    }
  };

  return (
    <div className="col-span-1 flex flex-col w-full h-full sm:col-span-1 text-black-text dark:text-white-text justify-center p-6">
      <h1 className="text-center text-[1.375rem] xs:text-xl font-medium">
        1 - Drug Registry Informations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 pt-6">
        {Object.keys(inputOptions).map((inputName) => (
          <div key={inputName} className="input-container relative">
            <div className="label-btn-container flex justify-between items-center">
              <label htmlFor={inputName} className="labels text-md block text-left">
                {addSpacesToInputName(inputName)}
              </label>
              <div className="btns-cont flex">
                <button
                  onClick={() => openAddModal(inputName)}
                  type="button"
                  className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
                >
                  Add
                </button>
                {formData[inputName] && (
                  <button
                    onClick={() => openEditModal(inputName, formData[inputName])}
                    type="button"
                    className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            <select
              name={inputName}
              value={
                inputName === "Manufacturer"
                  ? formData.ManufacturerId || ""
                  : inputName === "ResponsibleParty"
                  ? formData.ResponsiblePartyId || ""
                  : formData[inputName] || ""
              }
              onChange={
                inputName === "Manufacturer" || inputName === "ResponsibleParty"
                  ? handleSelectChange
                  : handleInputChange
              }
              className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            >
              <option disabled value="">
                Select an option
              </option>
              {inputName === "Manufacturer" || inputName === "ResponsibleParty"
                ? inputOptions[inputName].map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))
                : inputOptions[inputName].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
            </select>
          </div>
        ))}

        <div className="input-container relative">
          <label htmlFor="ManufacturerCountry" className="labels text-md block text-left">
            Manufacturer Country
          </label>
          <input
            name="ManufacturerCountry"
            value={formData.ManufacturerCountry || ""}
            readOnly
            className="mt-1 w-full rounded-full text-lg border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none"
            placeholder="Country"
          />
        </div>

        <div className="input-container relative">
          <label htmlFor="DrugName" className="labels text-md block text-left">
            Drug Name
          </label>
          <input
            name="DrugName"
            value={formData.DrugName}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-full text-lg border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            autoComplete="off"
            placeholder="name"
          />
        </div>

        <div className="input-container relative">
  <label htmlFor="PriceForeign" className="labels text-md mb-2 block text-left">
    Foreign Price
  </label>
  <div className="flex items-center space-x-4">
    <div className="relative flex-grow" style={{ borderColor: "transparent" }}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-bold">
        <span className="text-green-pri">
          {currencySymbols[formData.CurrencyForeign]}
        </span>
      </div>
      <input
        name="PriceForeign"
        type="number"
        id="price"
        className="w-full rounded-full text-lg border border-green-pri bg-white-bg dark:bg-black-input px-14 py-2 font-semibold shadow-md outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
        placeholder="Enter Foreign Price"
        value={formData.PriceForeign || ""}
        onChange={(e) => handleInputChange(e)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        <select
          id="currency"
          name="CurrencyForeign"
          className="w-20 cursor-pointer appearance-none rounded-r-full border border-green-pri bg-white-fg dark:bg-black-fg pr-2 py-2 font-normal shadow outline-none focus:border-green-pri focus:outline-none focus:ring-1 focus:ring-green-pri dark:focus:ring-1 dark:focus:ring-green-pri"
          onChange={(e) => handleInputChange(e)}
          value={formData.CurrencyForeign || ""}
        >
          {Object.keys(exchangeRates).map((CurrencyForeign) => (
            <option key={CurrencyForeign} value={CurrencyForeign}>
              {CurrencyForeign}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Checkbox Inline with Price Field */}
    <div className="flex items-center space-x-2">
      <label htmlFor="rateType" className="labels text-md block text-left">
        Regular Tariff
      </label>
      <input
        type="checkbox"
        checked={isRegularRate}
        onChange={(e) => setIsRegularRate(e.target.checked)}
        className="w-5 h-5 cursor-pointer"
      />
    </div>
  </div>
</div>


        <div className="input-container relative">
          <label className="labels text-md block text-left">Foreign Price in USD</label>
          <input
            name="priceUSD"
            readOnly
            className="converted-price-usd mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-semibold shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            value={` ${convertToUSD()}`}
          />
        </div>

        {/* Only render calculated fields if they have a value */}
        {publicPrice && (
          <div className="input-container relative">
            <label className="labels text-md block text-left">Public Price</label>
            <input
              name="publicPrice"
              readOnly
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-semibold"
              value={publicPrice}
              placeholder="Calculated Public Price"
            />
          </div>
        )}

        {stratumCode && (
          <div className="input-container relative">
            <label className="labels text-md block text-left">Stratum Code</label>
            <input
              name="stratumCode"
              readOnly
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-semibold"
              value={stratumCode}
              placeholder="Calculated Stratum Code"
            />
          </div>
        )}

        {isAddModalOpen && (
          <AddModal
            closeModal={() => setAddModalOpen(false)}
            title={getTitle(addSpacesToInputName(selectedInput))}
            onAdd={handleAdd}
            onCancel={handleCancel}
          />
        )}

        {isEditModalOpen && (
          <>
            <EditModal
              closeModal={() => {
                console.log("Closing EditModal");
                setEditModalOpen(false);
              }}
              title={getTitle(addSpacesToInputName(selectedInput))}
              onEdit={handleEdit}
              onCancel={() => {
                console.log("Canceling EditModal");
                handleCancel();
              }}
              initialValue={editInputValue}
            />
            {console.log("isEditModalOpen:", isEditModalOpen)}
          </>
        )}
      </div>
    </div>
  );
};

export default DrugRegistryForm;
