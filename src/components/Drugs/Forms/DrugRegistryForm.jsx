"use client"

import "./styles.css"
import { useStepperContext } from "../../Drugs/StepperContext"
import { useState, useEffect } from "react"
import axios from "axios"

// Hardcoded conversion rates from CSV files
const CIF_RATES = [
  {
    Currency: "US Dollar",
    "(E2)": "103548.7",
    "(E1)": "113145.9",
    "(D)": "125851.32",
    "(C)": "130089.59",
    "(B)": "134384.25",
    "(A2)": "134384.25",
    "(A1)": "134384.25",
    Rate: "89500.0",
    LBP_Equivalent: 1.0,
  },
  {
    Currency: "British Pound",
    "(E2)": "127735.29",
    "(E1)": "139574.17",
    "(D)": "155247.29",
    "(C)": "160475.52",
    "(B)": "165773.31",
    "(A2)": "165773.31",
    "(A1)": "165773.31",
    Rate: "110405.14",
    LBP_Equivalent: 1.2336,
  },
  {
    Currency: "Euro",
    "(E2)": "110151.98",
    "(E1)": "120361.19",
    "(D)": "133876.83",
    "(C)": "138385.38",
    "(B)": "142953.91",
    "(A2)": "142953.91",
    "(A1)": "142953.91",
    Rate: "95207.4",
    LBP_Equivalent: 1.0638,
  },
  {
    Currency: "Swiss Franc",
    "(E2)": "113860.48",
    "(E1)": "124413.41",
    "(D)": "138384.08",
    "(C)": "143044.42",
    "(B)": "147766.75",
    "(A2)": "147766.75",
    "(A1)": "147766.75",
    Rate: "98412.76",
    LBP_Equivalent: 1.0996,
  },
  {
    Currency: "Canadian Dollar",
    "(E2)": "74100.37",
    "(E1)": "80968.21",
    "(D)": "90060.32",
    "(C)": "93093.27",
    "(B)": "96166.57",
    "(A2)": "96166.57",
    "(A1)": "96166.57",
    Rate: "64047.0",
    LBP_Equivalent: 0.7156,
  },
  {
    Currency: "Japanese Yen",
    "(E2)": "674.26",
    "(E1)": "736.76",
    "(D)": "819.49",
    "(C)": "847.09",
    "(B)": "875.05",
    "(A2)": "875.05",
    "(A1)": "875.05",
    Rate: "582.79",
    LBP_Equivalent: 0.0065,
  },
  {
    Currency: "Danish Krone",
    "(E2)": "14768.41",
    "(E1)": "16137.19",
    "(D)": "17949.28",
    "(C)": "18553.75",
    "(B)": "19166.27",
    "(A2)": "19166.27",
    "(A1)": "19166.27",
    Rate: "12764.75",
    LBP_Equivalent: 0.1426,
  },
  {
    Currency: "Norwegian Krone",
    "(E2)": "9370.55",
    "(E1)": "10239.04",
    "(D)": "11388.81",
    "(C)": "11772.35",
    "(B)": "12160.99",
    "(A2)": "12160.99",
    "(A1)": "12160.99",
    Rate: "8099.23",
    LBP_Equivalent: 0.0905,
  },
  {
    Currency: "Swedish Krona",
    "(E2)": "9507.47",
    "(E1)": "10388.65",
    "(D)": "11555.21",
    "(C)": "11944.36",
    "(B)": "12338.68",
    "(A2)": "12338.68",
    "(A1)": "12338.68",
    Rate: "8217.57",
    LBP_Equivalent: 0.0918,
  },
  {
    Currency: "Jordanian Dinar",
    "(E2)": "145950.1",
    "(E1)": "159477.18",
    "(D)": "177385.25",
    "(C)": "183359.02",
    "(B)": "189412.27",
    "(A2)": "189412.27",
    "(A1)": "189412.27",
    Rate: "126148.7",
    LBP_Equivalent: 1.4095,
  },
  {
    Currency: "Egyptian Pound",
    "(E2)": "2096.24",
    "(E1)": "2290.52",
    "(D)": "2547.73",
    "(C)": "2633.53",
    "(B)": "2720.47",
    "(A2)": "2720.47",
    "(A1)": "2720.47",
    Rate: "1811.84",
    LBP_Equivalent: 0.0202,
  },
  {
    Currency: "Australian Dollar",
    "(E2)": "64480.88",
    "(E1)": "70457.16",
    "(D)": "78368.96",
    "(C)": "81008.18",
    "(B)": "83682.51",
    "(A2)": "83682.51",
    "(A1)": "83682.51",
    Rate: "55732.61",
    LBP_Equivalent: 0.6227,
  },
  {
    Currency: "UAE Dirham",
    "(E2)": "28191.51",
    "(E1)": "30804.38",
    "(D)": "34263.47",
    "(C)": "35417.36",
    "(B)": "36586.6",
    "(A2)": "36586.6",
    "(A1)": "36586.6",
    Rate: "24366.7",
    LBP_Equivalent: 0.2723,
  },
]

const FOB_RATES = [
  {
    Currency: "US Dollar",
    "(E2)": "106137.42",
    "(E1)": "115974.54",
    "(D)": "129626.85",
    "(C)": "135293.17",
    "(B)": "141103.46",
    "(A2)": "143791.14",
    "(A1)": "143791.14",
    Rate: "89500.0",
  },
  {
    Currency: "British Pound",
    "(E2)": "130926.67",
    "(E1)": "1433.53",
    "(D)": "15990471.0",
    "(C)": "166894.54",
    "(B)": "74.98",
    "(A2)": "177377.44",
    "(A1)": "177377.44",
    Rate: "110405.14",
  },
  {
    Currency: "Euro",
    "(E2)": "112905.78",
    "(E1)": "123370.22",
    "(D)": "137893.14",
    "(C)": "143920.79",
    "(B)": "150101.6",
    "(A2)": "152101.68",
    "(A1)": "152960.68",
    Rate: "95207.4",
  },
  {
    Currency: "Swiss Franc",
    "(E2)": "116707.0",
    "(E1)": "127523.74",
    "(D)": "142535.6",
    "(C)": "1487.19",
    "(B)": "155155.09",
    "(A2)": "158110.43",
    "(A1)": "158110.43",
    Rate: "98412.76",
  },
  {
    Currency: "Canadian Dollar",
    "(E2)": "75952.88",
    "(E1)": "82992.42",
    "(D)": "92762.13",
    "(C)": "96817.0",
    "(B)": "100974.89",
    "(A2)": "102898.23",
    "(A1)": "102898.23",
    Rate: "64047.0",
  },
  {
    Currency: "Japanese Yen",
    "(E2)": "691.12",
    "(E1)": "755.18",
    "(D)": "844.08",
    "(C)": "880.97",
    "(B)": "918.81",
    "(A2)": "131.0",
    "(A1)": "936.31",
    Rate: "582.79",
  },
  {
    Currency: "Danish Krone",
    "(E2)": "15137.62",
    "(E1)": "16540.62",
    "(D)": "18487.75",
    "(C)": "19295.9",
    "(B)": "20124.58",
    "(A2)": "20507.91",
    "(A1)": "20507.91",
    Rate: "12764.75",
  },
  {
    Currency: "Norwegian Krone",
    "(E2)": "9604.81",
    "(E1)": "10495.02",
    "(D)": "11730.47",
    "(C)": "12243.24",
    "(B)": "12769.04",
    "(A2)": "13012.26",
    "(A1)": "13012.26",
    Rate: "8.09923",
  },
  {
    Currency: "Swedish Krona",
    "(E2)": "9745.15",
    "(E1)": "10648.36",
    "(D)": "11901.87",
    "(C)": "12422.13",
    "(B)": "12955.61",
    "(A2)": "13202.38",
    "(A1)": "13202.38",
    Rate: "8217.57",
  },
  {
    Currency: "Jordanian Dinar",
    "(E2)": "149598.85",
    "(E1)": "163464.11",
    "(D)": "1827.81",
    "(C)": "190693.38",
    "(B)": "198882.88",
    "(A2)": "202671.13",
    "(A1)": "202671.13",
    Rate: "126148.7",
  },
  {
    Currency: "Egyptian Pound",
    "(E2)": "2148.64",
    "(E1)": "2347.79",
    "(D)": "2624.16",
    "(C)": "2738.87",
    "(B)": "2856.5",
    "(A2)": "2910.91",
    "(A1)": "2910.91",
    Rate: "1811.84",
  },
  {
    Currency: "Australian Dollar",
    "(E2)": "92.91",
    "(E1)": "72218.59",
    "(D)": "80720.03",
    "(C)": "84248.51",
    "(B)": "87866.63",
    "(A2)": "89540.28",
    "(A1)": "89540.28",
    Rate: "55732.61",
  },
  {
    Currency: "UAE Dirham",
    "(E2)": "28896.29",
    "(E1)": "31.57449",
    "(D)": "35291.38",
    "(C)": "834.05",
    "(B)": "38415.93",
    "(A2)": "39147.66",
    "(A1)": "39147.66",
    Rate: "24366.7",
  },
  {
    Currency: "Argentine Peso",
    "(E2)": "101.86",
    "(E1)": "111.3",
    "(D)": "124.41",
    "(C)": "129.85",
    "(B)": "135.42",
    "(A2)": "138.0",
    "(A1)": "138.0",
    Rate: "85.0",
  },
  {
    Currency: "Saudi Riyal",
    "(E2)": "28258.52",
    "(E1)": "30877.6",
    "(D)": "34512.46",
    "(C)": "36021.09",
    "(B)": "378.04",
    "(A2)": "38283.62",
    "(A1)": "283.62",
    Rate: "23828.0",
    Currency: "Saudi Riyal",
  },
  {
    Currency: "Syrian Pound",
    "(E2)": "8.15",
    "(E1)": "8.91",
    "(D)": "9.96",
    "(C)": "10.4",
    "(B)": "1084.0",
    "(A2)": "11.05",
    "(A1)": "11.05",
    Rate: "6.88",
  },
  {
    Currency: "Czech Koruna",
    "(E2)": "4461.98",
    "(E1)": "4875.53",
    "(D)": "5449.46",
    "(C)": "5687.67",
    "(B)": "5931.94",
    "(A2)": "6044.93",
    "(A1)": "6044.93",
    Rate: "3762.55",
  },
  {
    Currency: "Indian Rupee",
    "(E2)": "1219.27",
    "(E1)": "1.33228",
    "(D)": "1489.11",
    "(C)": "1554.2",
    "(B)": "1620.95",
    "(A2)": "1651.83",
    "(A1)": "1651.83",
    Rate: "1028.15",
  },
  {
    Currency: "Iranian Rial",
    "(E2)": "2527.07",
    "(E1)": "2761.29",
    "(D)": "3086.35",
    "(C)": "3221.26",
    "(B)": "3359.6025",
    "(A2)": "3423.59492",
    "(A1)": "3423.59492",
    Rate: "2130.95",
  },
  {
    Currency: "Tunisian Dinar",
    "(E2)": "33821.25",
    "(E1)": "36955.9",
    "(D)": "41306.28",
    "(C)": "43111.88",
    "(B)": "44963.36",
    "(A2)": "45819.81",
    "(A1)": "45819.81",
    Rate: "28519.65",
  },
  {
    Currency: "Turkish Lira",
    "(E2)": "2984.61",
    "(E1)": "3261.24",
    "(D)": "35.15",
    "(C)": "3804.48",
    "(B)": "3967.87",
    "(A2)": "4043.45",
    "(A1)": "4043.45",
    Rate: "2516.77",
  },
  {
    Currency: "Qatari Riyal",
    "(E2)": "29113.37",
    "(E1)": "31811.68",
    "(D)": "35556.5",
    "(C)": "37110.76",
    "(B)": "38704.52",
    "(A2)": "39441.75",
    "(A1)": "39441.75",
    Rate: "24549.75",
  },
  {
    Currency: "Omani Rial",
    "(E2)": "275682.16",
    "(E1)": "301233.19",
    "(D)": "336693.81",
    "(C)": "351411.55",
    "(B)": "366.50323",
    "(A2)": "373484.25",
    "(A1)": "373484.25",
    Rate: "232468.0",
  },
  {
    Currency: "South Korean Won",
    "(E2)": "73.82",
    "(E1)": "80.66",
    "(D)": "90.15",
    "(C)": "94.1",
    "(B)": "98.14",
    "(A2)": "100.01",
    "(A1)": "100.01",
    Rate: "62.25",
  },
  {
    Currency: "Russian Ruble",
    "(E2)": "1155.97",
    "(E1)": "1263.11",
    "(D)": "1411.8",
    "(C)": "1473.51",
    "(B)": "1536.79",
    "(A2)": "1566.07",
    "(A1)": "1566.07",
    Rate: "974.77",
  },
  {
    Currency: "Chinese Yuan",
    "(E2)": "14728.73",
    "(E1)": "63.83",
    "(D)": "17988.36",
    "(C)": "18774.68",
    "(B)": "19953.94",
    "(A2)": "19953.95",
    "(A1)": "19953.95",
    Rate: "12419.95",
  },
]

const LOCAL_RATES = [
  {
    Currency: "USD",
    "(E2)": "106617.1",
    "(E1)": "107758.1",
    "(D)": "119858.4",
    "(C)": "123894.65",
    "(B)": "127985.7",
    "(A2)": "127985.7",
    "(A1)": "127985.7",
    Rate: "89500.0",
    LBP_Equivalent: 1.0,
  },
  {
    Currency: "GBP",
    "(E2)": "121652.0",
    "(E1)": "132927.78",
    "(D)": "147854.0",
    "(C)": "152833.83",
    "(B)": "157879.35",
    "(A2)": "157879.35",
    "(A1)": "157879.35",
    Rate: "110405.14",
    LBP_Equivalent: 1.2336,
  },
  {
    Currency: "EUR",
    "(E2)": "104165.0",
    "(E1)": "114629.7",
    "(D)": "127171.75",
    "(C)": "131795.0",
    "(B)": "136146.58",
    "(A2)": "136146.58",
    "(A1)": "136146.58",
    Rate: "95207.4",
    LBP_Equivalent: 1.0638,
  },
  {
    Currency: "CHF",
    "(E2)": "118436.58",
    "(E1)": "118488.6",
    "(D)": "131794.36",
    "(C)": "134232.78",
    "(B)": "140730.24",
    "(A2)": "140730.24",
    "(A1)": "140730.24",
    Rate: "93412.76",
    LBP_Equivalent: 1.0437,
  },
  {
    Currency: "CAD",
    "(E2)": "70571.76",
    "(E1)": "77112.58",
    "(D)": "85771.74",
    "(C)": "88660.26",
    "(B)": "91587.21",
    "(A2)": "91587.21",
    "(A1)": "91587.21",
    Rate: "64047.0",
    LBP_Equivalent: 0.7156,
  },
  {
    Currency: "JPY",
    "(E2)": "742.16",
    "(E1)": "701.67",
    "(D)": "789.47",
    "(C)": "820.75",
    "(B)": "833.38",
    "(A2)": "833.38",
    "(A1)": "833.38",
    Rate: "582.79",
    LBP_Equivalent: 0.0065,
  },
  {
    Currency: "DKK",
    "(E2)": "14405.15",
    "(E1)": "15408.75",
    "(D)": "17174.55",
    "(C)": "17670.24",
    "(B)": "18253.59",
    "(A2)": "18253.59",
    "(A1)": "18253.59",
    Rate: "12764.75",
    LBP_Equivalent: 0.1426,
  },
  {
    Currency: "NOK",
    "(E2)": "8943.3",
    "(E1)": "9751.47",
    "(D)": "10846.48",
    "(C)": "11211.76",
    "(B)": "11581.89",
    "(A2)": "11581.89",
    "(A1)": "11581.89",
    Rate: "8099.23",
    LBP_Equivalent: 0.0905,
  },
  {
    Currency: "SEK",
    "(E2)": "9470.7",
    "(E1)": "9893.95",
    "(D)": "11344.0",
    "(C)": "11375.58",
    "(B)": "11751.12",
    "(A2)": "11751.12",
    "(A1)": "11751.12",
    Rate: "8217.57",
    LBP_Equivalent: 0.0918,
  },
  {
    Currency: "JOD",
    "(E2)": "139000.09",
    "(E1)": "151883.03",
    "(D)": "168938.33",
    "(C)": "174627.64",
    "(B)": "180392.64",
    "(A2)": "180392.64",
    "(A1)": "180392.64",
    Rate: "126148.7",
    LBP_Equivalent: 1.4095,
  },
  {
    Currency: "EGP",
    "(E2)": "1996.42",
    "(E1)": "2181.45",
    "(D)": "2426.41",
    "(C)": "2513.0",
    "(B)": "2560.93",
    "(A2)": "2560.93",
    "(A1)": "2560.93",
    Rate: "1811.84",
    LBP_Equivalent: 0.0202,
  },
  {
    Currency: "AUD",
    "(E2)": "61410.36",
    "(E1)": "67102.0",
    "(D)": "74637.11",
    "(C)": "77150.65",
    "(B)": "79697.63",
    "(A2)": "79697.63",
    "(A1)": "79697.63",
    Rate: "55732.61",
    LBP_Equivalent: 0.6227,
  },
  {
    Currency: "AED",
    "(E2)": "26849.05",
    "(E1)": "29337.0",
    "(D)": "32631.0",
    "(C)": "33730.82",
    "(B)": "34844.38",
    "(A2)": "34844.38",
    "(A1)": "34844.38",
    Rate: "24366.7",
    LBP_Equivalent: 0.2723,
  },
]

// Currency code mapping for standardization
const CURRENCY_CODE_MAP = {
  "US Dollar": "USD",
  "British Pound": "GBP",
  Euro: "EUR",
  "Swiss Franc": "CHF",
  "Canadian Dollar": "CAD",
  "Japanese Yen": "JPY",
  "Danish Krone": "DKK",
  "Norwegian Krone": "NOK",
  "Swedish Krona": "SEK",
  "Jordanian Dinar": "JOD",
  "Egyptian Pound": "EGP",
  "Australian Dollar": "AUD",
  "UAE Dirham": "AED",
  // Add other mappings as needed based on your CSV currencies
}

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
  } = useStepperContext()

  // State for calculated price and stratum
  const [publicPrice, setPublicPrice] = useState("")
  const [publicPriceOriginalCurrency, setPublicPriceOriginalCurrency] = useState("")
  const [stratumCode, setStratumCode] = useState("")
  const [isRegularRate, setIsRegularRate] = useState(true) // Checkbox for rate type

  const calculatePrice = async () => {
    // Clear calculated fields if key data is missing
    if (!formData.PriceForeign || !formData.CargoShippingTerms || !formData.CurrencyForeign) {
      setPublicPrice("")
      setPublicPriceOriginalCurrency("")
      setStratumCode("")
      return
    }

    const requestBody = {
      price: Number.parseFloat(formData.PriceForeign),
      isFOB: formData.CargoShippingTerms === "FOB",
      rateType: isRegularRate ? "regular" : "special",
    }

    try {
      const response = await axios.post("/api/stratum/calculatePrice", requestBody, {
        headers: { "Content-Type": "application/json" },
      })

      const { publicPrice, stratumCode } = response.data
      setPublicPrice(publicPrice)
      setStratumCode(stratumCode)

      // Select the appropriate rate table
      const rateTable = getRateTable()

      // Standardize currency code
      const currencyCode = CURRENCY_CODE_MAP[formData.CurrencyForeign] || formData.CurrencyForeign

      // Find the corresponding rate in the selected table
      const currencyData = rateTable.find(
        (rate) => rate.Currency === currencyCode || rate.Currency === formData.CurrencyForeign,
      )

      if (currencyData && stratumCode) {
        const stratumRate = Number.parseFloat(currencyData[`(${stratumCode})`])
        const baseRate = Number.parseFloat(currencyData.Rate)

        if (stratumRate && publicPrice && baseRate) {
          // Calculate the multiplier based on the shipping terms and stratum
          const multiplier = stratumRate
          
          console.log("Multiplier:", multiplier)
          // Apply the multiplier to the public price
          const priceInOriginalCurrency = publicPrice * multiplier

          setPublicPriceOriginalCurrency(
            priceInOriginalCurrency.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          )
        } else {
          console.warn(`No valid rates found for stratum code: ${stratumCode}`)
          setPublicPriceOriginalCurrency("")
        }
      } else {
        console.warn(`No matching currency data found for: ${currencyCode}`)
        setPublicPriceOriginalCurrency("")
      }
    } catch (error) {
      console.error("Error calculating price:", error)
      setPublicPrice("")
      setPublicPriceOriginalCurrency("")
      setStratumCode("")
    }
  }

  // Auto-trigger price calculation when PriceForeign, CargoShippingTerms, or rate type changes
  useEffect(() => {
    calculatePrice()
  }, [
    formData.PriceForeign,
    formData.CargoShippingTerms,
    formData.CurrencyForeign,
    formData.ManufacturerCountry,
    isRegularRate,
  ])

  // Debug logging to see what's happening with the form data
  useEffect(() => {
    console.log("Current form data:", {
      ManufacturerId: formData.ManufacturerId,
      Manufacturer: formData.Manufacturer,
      ResponsiblePartyId: formData.ResponsiblePartyId,
      ResponsibleParty: formData.ResponsibleParty,
      ManufacturerCountry: formData.ManufacturerCountry,
    })
  }, [
    formData.ManufacturerId,
    formData.Manufacturer,
    formData.ResponsiblePartyId,
    formData.ResponsibleParty,
    formData.ManufacturerCountry,
  ])

  // Custom render function for each field
  const renderField = (inputName) => {
    return (
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
        {/* For Manufacturer and ResponsibleParty, we need to handle them differently */}
        {inputName === "Manufacturer" || inputName === "ResponsibleParty" ? (
          <select
            name={inputName}
            value={inputName === "Manufacturer" ? formData.ManufacturerId || "" : formData.ResponsiblePartyId || ""}
            onChange={handleInputChange}
            className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          >
            <option disabled value="">
              Select an option
            </option>
            {inputOptions[inputName].map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        ) : (
          <select
            name={inputName}
            value={formData[inputName] || ""}
            onChange={handleInputChange}
            className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          >
            <option disabled value="">
              Select an option
            </option>
            {inputOptions[inputName].map((option) => (
              <option
                key={typeof option === "object" ? option.id : option}
                value={typeof option === "object" ? option.id : option}
              >
                {typeof option === "object" ? option.name : option}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }

  // Helper function to get the appropriate rate table based on shipping terms and manufacturer country
  const getRateTable = () => {
    if (formData.ManufacturerCountry === "LEBANON") {
      return LOCAL_RATES
    } else if (formData.CargoShippingTerms === "FOB") {
      return FOB_RATES
    } else {
      return CIF_RATES
    }
  }

  return (
    <div className="col-span-1 flex flex-col w-full h-full sm:col-span-1 text-black-text dark:text-white-text justify-center p-6">
      <h1 className="text-center text-[1.375rem] xs:text-xl font-medium">1 - Drug Registry Informations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 pt-6">
        {/* First row */}
        <div className="input-container relative">
          <div className="label-btn-container flex justify-between items-center">
            <label htmlFor="ProductType" className="labels text-md block text-left">
              {addSpacesToInputName("ProductType")}
            </label>
            <div className="btns-cont flex">
              <button
                onClick={() => openAddModal("ProductType")}
                type="button"
                className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
              >
                Add
              </button>
              {formData["ProductType"] && (
                <button
                  onClick={() => openEditModal("ProductType", formData["ProductType"])}
                  type="button"
                  className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <select
            name="ProductType"
            value={formData["ProductType"] || ""}
            onChange={handleInputChange}
            className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          >
            <option disabled value="">
              Select an option
            </option>
            {inputOptions["ProductType"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container relative">
          <div className="label-btn-container flex justify-between items-center">
            <label htmlFor="ResponsibleParty" className="labels text-md block text-left">
              {addSpacesToInputName("ResponsibleParty")}
            </label>
            <div className="btns-cont flex">
              <button
                onClick={() => openAddModal("ResponsibleParty")}
                type="button"
                className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
              >
                Add
              </button>
              {formData["ResponsibleParty"] && (
                <button
                  onClick={() => openEditModal("ResponsibleParty", formData["ResponsibleParty"])}
                  type="button"
                  className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <select
            name="ResponsibleParty"
            value={formData.ResponsiblePartyId || ""}
            onChange={handleInputChange}
            className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          >
            <option disabled value="">
              Select an option
            </option>
            {inputOptions["ResponsibleParty"].map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container relative">
          <label htmlFor="ResponsiblePartyCountry" className="labels text-md block text-left">
            Responsible Party Country
          </label>
          <input
            name="ResponsiblePartyCountry"
            value={formData.ResponsiblePartyCountry || ""}
            readOnly
            className="mt-1 w-full rounded-full text-lg border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none"
            placeholder="Country"
          />
        </div>

        {/* Second row */}
        <div className="input-container relative">
          <div className="label-btn-container flex justify-between items-center">
            <label htmlFor="CargoShippingTerms" className="labels text-md block text-left">
              {addSpacesToInputName("CargoShippingTerms")}
            </label>
            <div className="btns-cont flex">
              <button
                onClick={() => openAddModal("CargoShippingTerms")}
                type="button"
                className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
              >
                Add
              </button>
              {formData["CargoShippingTerms"] && (
                <button
                  onClick={() => openEditModal("CargoShippingTerms", formData["CargoShippingTerms"])}
                  type="button"
                  className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <select
            name="CargoShippingTerms"
            value={formData.CargoShippingTerms || ""}
            onChange={handleInputChange}
            className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          >
            <option disabled value="">
              Select an option
            </option>
            {inputOptions["CargoShippingTerms"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container relative">
          <div className="label-btn-container flex justify-between items-center">
            <label htmlFor="Manufacturer" className="labels text-md block text-left">
              {addSpacesToInputName("Manufacturer")}
            </label>
            <div className="btns-cont flex">
              <button
                onClick={() => openAddModal("Manufacturer")}
                type="button"
                className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
              >
                Add
              </button>
              {formData["Manufacturer"] && (
                <button
                  onClick={() => openEditModal("Manufacturer", formData["Manufacturer"])}
                  type="button"
                  className="rounded-xl bg-transparent p-2 text-green-pri focus:border-[#00a651] focus:outline-none focus:ring-1"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <select
            name="Manufacturer"
            value={formData.ManufacturerId || ""}
            onChange={handleInputChange}
            className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          >
            <option disabled value="">
              Select an option
            </option>
            {inputOptions["Manufacturer"].map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

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

          {Object.keys(inputOptions)
            .filter(
              (key) =>
                key !== "ProductType" &&
                key !== "Manufacturer" &&
                key !== "ResponsibleParty" &&
                key !== "CargoShippingTerms" &&
                key !== "ResponsiblePartyCountry",
            )
            .map((inputName) => renderField(inputName))}

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
                <span className="text-green-pri">{currencySymbols[formData.CurrencyForeign]}</span>
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

        {publicPrice && (
          <div className="input-container relative">
            <label className="labels text-md block text-left">Public Price (LBP)</label>
            <input
              name="publicPrice"
              readOnly
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-semibold"
              value={publicPrice * 89500}
              placeholder="Calculated Public Price"
            />
          </div>
        )}

        {publicPriceOriginalCurrency && formData.CurrencyForeign && (
          <div className="input-container relative">
            <label className="labels text-md block text-left">Public Price ({formData.CurrencyForeign})</label>
            <input
              name="publicPriceOriginalCurrency"
              readOnly
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-input dark:bg-black-shadow px-4 py-2 font-semibold"
              value={`${publicPriceOriginalCurrency} ${formData.CurrencyForeign}`}
              placeholder={`Calculated Public Price in ${formData.CurrencyForeign}`}
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
                console.log("Closing EditModal")
                setEditModalOpen(false)
              }}
              title={getTitle(addSpacesToInputName(selectedInput))}
              onEdit={handleEdit}
              onCancel={() => {
                console.log("Canceling EditModal")
                handleCancel()
              }}
              initialValue={editInputValue}
            />
            {console.log("isEditModalOpen:", isEditModalOpen)}
          </>
        )}
      </div>
    </div>
  )
}

export default DrugRegistryForm

