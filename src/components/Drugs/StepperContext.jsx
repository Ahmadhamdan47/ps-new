/* eslint-disable no-unused-vars */

import PropTypes from "prop-types";
/* eslint-disable react/prop-types */
import { v4 as uuidv4 } from "uuid";
import "flatpickr/dist/flatpickr.min.css";
import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

import AddModal from "../Modals/AddModal";
import EditModal from "../Modals/EditModal";



const dosageOptions = {
  "%": "%",
  billions: "billions",
  "billions/g": "billions/g",
  CCID50: "CCID50",
  "ELISA units/ml": "ELISA units/ml",
  g: "g",
  "g/g": "g/g",
  "g/L": "g/L",
  "mg/g": "mg/g",
  "g/ml": "g/ml",
  "IR or IC/ml": "IR or IC/ml",
  IU: "IU",
  "IU/actuation": "IU/actuation",
  "IU/drop": "IU/drop",
  "IU/g": "IU/g",
  "IU/ml": "IU/ml",
  LRU: "LRU",
  LSU: "LSU",
  mcg: "mcg",
  "mcg/dose": "mcg/dose",
  "mcg/g": "mcg/g",
  "mcg/mcg": "mcg/mcg",
  "mcg/mg": "mcg/mg",
  "mcg/ml": "mcg/ml",
  "mcl/ml": "mcl/ml",
  mg: "mg",
  MIU: "MIU",
  "MIU/ml": "MIU/ml",
  ml: "ml",
  "ml/l": "ml/l",
  "ml/ml": "ml/ml",
  PFU: "PFU",
  "U.CEIP": "U.CEIP",
  "U.CEIP/ml": "U.CEIP/ml",
  "U/ml": "U/ml",
  "units LD50": "units LD50",
};

const dosageFormOptions = {
  "Adhesive plaster": "Adhesive plaster",
  "Caplet": "Caplet",
  "Caplet, coated": "Caplet, coated",
  "Caplet, film coated": "Caplet, film coated",
  "Capsule": "Capsule",
  "Capsule, coated": "Capsule, coated",
  "Capsule, controlled release / extended release / modified release / prolonged release / slow release / sustained release": "Capsule, controlled release / extended release / modified release / prolonged release / slow release / sustained release",
  "Capsule, delayed release / enteric coated / gastro-resistant": "Capsule, delayed release / enteric coated / gastro-resistant",
  "Capsule, dual release": "Capsule, dual release",
  "Capsule, hard": "Capsule, hard",
  "Capsule, inhalation": "Capsule, inhalation",
  "Capsule, microionized": "Capsule, microionized",
  "Capsule, soft / liquid gel / liquid filled / soft gelatin": "Capsule, soft / liquid gel / liquid filled / soft gelatin",
  "Cream": "Cream",
  "Creamgel": "Creamgel",
  "Drops, concentrated": "Drops, concentrated",
  "Drops, solution": "Drops, solution",
  "Drops, suspension": "Drops, suspension",
  "Elixir": "Elixir",
  "Emulsion": "Emulsion",
  "Emulsion Gel": "Emulsion Gel",
  "Enema": "Enema",
  "Film forming solution": "Film forming solution",
  "Film, orally soluble": "Film, orally soluble",
  "Film, orodispersible": "Film, orodispersible",
  "Foam": "Foam",
  "Gargle / Mouthwash": "Gargle / Mouthwash",
  "Gauze": "Gauze",
  "Gel": "Gel",
  "Granules": "Granules",
  "Granules for solution": "Granules for solution",
  "Granules for suspension": "Granules for suspension",
  "Granules, effervescent": "Granules, effervescent",
  "Granules, gastro-resistant / delayed release": "Granules, gastro-resistant / delayed release",
  "Granules, prolonged release": "Granules, prolonged release",
  "Implant": "Implant",
  "Injectable concentrate for solution": "Injectable concentrate for solution",
  "Injectable lyophilized / freeze-dried / dry powder": "Injectable lyophilized / freeze-dried / dry powder",
  "Injectable solution": "Injectable solution",
  "Injectable, lyophilized / freeze-dried / dry powder, prolonged release": "Injectable, lyophilized / freeze-dried / dry powder, prolonged release",
  "Injectable, powder, for liposomal dispersion": "Injectable, powder, for liposomal dispersion",
  "Injectable, powder, for solution": "Injectable, powder, for solution",
  "Injectable, powder, for suspension, prolonged release": "Injectable, powder, for suspension, prolonged release",
  "Injectable, solution": "Injectable, solution",
  "Jelly": "Jelly",
  "Lipocream": "Lipocream",
  "Lotion": "Lotion",
  "Lozenge": "Lozenge",
  "Metered dose spray": "Metered dose spray",
  "Ointment": "Ointment",
  "Patch": "Patch",
  "Pessary": "Pessary",
  "Powder": "Powder",
  "Powder, effervescent": "Powder, effervescent",
  "Powder, for solution": "Powder, for solution",
  "Powder, for suspension": "Powder, for suspension",
  "Powder, inhalation": "Powder, inhalation",
  "Pulvule": "Pulvule",
  "Respule": "Respule",
  "Ring": "Ring",
  "Rotacaps": "Rotacaps",
  "Shampoo": "Shampoo",
  "Solution": "Solution",
  "Solution, film forming": "Solution, film forming",
  "Solution, inhalation": "Solution, inhalation",
  "Spray": "Spray",
  "Suppository": "Suppository",
  "Suspension, inhalation": "Suspension, inhalation",
  "Syrup": "Syrup",
  "Tablet": "Tablet",
  "Tablet, chewable": "Tablet, chewable",
  "Tablet, coated": "Tablet, coated",
  "Tablet, controlled release / extended release / modified release / prolonged release / slow release / sustained release": "Tablet, controlled release / extended release / modified release / prolonged release / slow release / sustained release",
  "Tablet, delayed release / enteric coated / gastro-resistant": "Tablet, delayed release / enteric coated / gastro-resistant",
  "Tablet, dispersible": "Tablet, dispersible",
  "Tablet, effervescent": "Tablet, effervescent",
  "Tablet, film coated": "Tablet, film coated",
  "Tablet, lyophilised / freeze-dried": "Tablet, lyophilised / freeze-dried",
  "Tablet, microgranules": "Tablet, microgranules",
  "Tablet, orally disintegrating / mouth dissolving / orodispersible": "Tablet, orally disintegrating / mouth dissolving / orodispersible",
  "Tablet, repetab": "Tablet, repetab",
  "Tablet, sugar coated": "Tablet, sugar coated",
  "Vaginal delivery system": "Vaginal delivery system",
  "Volatile liquid": "Volatile liquid",
  "Water, for injection / for irrigation": "Water, for injection / for irrigation",
};

const routeOptions = {
  Epidural: "Epidural",
  Epilesional: "Epilesional",
  Haemodialysis: "Haemodialysis",
  Infusion: "Infusion",
  Inhalation: "Inhalation",
  Injection: "Injection",
  Intraarteriel: "Intraarteriel",
  Intraarticular: "Intraarticular",
  Intrabursal: "Intrabursal",
  Intracavitary: "Intracavitary",
  Intradermal: "Intradermal",
  Intralesional: "Intralesional",
  Intramuscular: "Intramuscular",
  Intraocular: "Intraocular",
  Intraoral: "Intraoral",
  Intraperitoneal: "Intraperitoneal",
  Intrarectal: "Intrarectal",
  Intrathecal: "Intrathecal",
  Intratracheal: "Intratracheal",
  Intrauterin: "Intrauterin",
  Intravascular: "Intravascular",
  Intravesical: "Intravesical",
  Intravitreal: "Intravitreal",
  Nasal: "Nasal",
  Ophtalmic: "Ophtalmic",
  "Ophtalmic/Otic": "Ophtalmic/Otic",
  Oral: "Oral",
  "Oral gingival": "Oral gingival",
  Otic: "Otic",
  Parenteral: "Parenteral",
  Periarticular: "Periarticular",
  "Peritoneal Dialysis": "Peritoneal Dialysis",
  Rectal: "Rectal",
  Respiratory: "Respiratory",
  "soft tissue injection": "soft tissue injection",
  Subcutanous: "Subcutanous",
  Sublingual: "Sublingual",
  Topical: "Topical",
  "Topical scalp": "Topical scalp",
  Transdermal: "Transdermal",
  Vaginal: "Vaginal",
  "Varicose vein": "Varicose vein",
};

const presentationContainerOptions = {
  Ampule: "Ampule",
  Applicator: "Applicator",
  Bottle: "Bottle",
  Box: "Box",
  Canister: "Canister",
  Cartridge: "Cartridge",
  Inhaler: "Inhaler",
  "Inhaler refill": "Inhaler refill",
  Kit: "Kit",
  "Not stated": "Not stated",
  "Packet/Sachet": "Packet/Sachet",
  Pack: "Pack",
  Pen: "Pen",
  "Pre-filled pen": "Pre-filled pen",
  Penfill: "Penfill",
  "Pre-filled syringe": "Pre-filled syringe",
  Syringe: "Syringe",
  Tube: "Tube",
  Vial: "Vial",
  New: "New",
};

const prescriptionAndDispensingConditionOptions = {
  Narcotics: "Narcotics",
  "Biological drugs": "Biological drugs",
  "Dispensed multiple times from one prescription":
    "Dispensed multiple times from one prescription",
  "Dispensed for the prescription duration":
    "Dispensed for the prescription duration",
  "OTC drugs": "OTC drugs",
};

// Create a new context for the stepper
const StepperContext = createContext();

// Custom hook to use the stepper context
export const useStepperContext = () => useContext(StepperContext);

// Function to generate GUID
const generateGUID = () => uuidv4();

// Function to generate initial form data
const generateInitialFormData = () => ({
  Guid: generateGUID(),
  ATCGuid: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  DosageGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA6",
  PresentationGuid: "91C44FF9-D234-4306-BF87-AE8894D0CF0C",
  FormGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA6",
  RouteGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA7",
  StratumGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA7",
  StratumTypeGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA6",
  AgentGuid: "Benta Trading",
  BrandGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA7",
  CountryGuid: "5920751D-3EDB-44B9-AA13-BD6B30AB8B65",
  ResponsiblePartyGuid: "5920751D-3EDB-44B9-AA13-BD6B30AB8B66",
  DrugLabelGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA2",
  LASTCurrencyGuid: "3FA85F64-5717-4562-B3FC-2C963F66AFA1",

  DrugName: "Advil",
  Form: "Tablet",
  ManufacturerID: 1,
  Manufacturer: "",
  ManufacturerCountry: "",
  RegistrationNumber: "111",
  GTIN: "11111111111111",
  Notes: "string",
  Description: "string",
  IngredientAndStrength: "string",
  PrimaryContainerPackage: "string",
  Indication: "string",
  Posology: "string",
  MethodOfAdministration: "string",
  Contraindications: "string",
  PrecautionForUse: "string",
  EffectOnFGN: "string",
  SideEffect: "string",
  Toxicity: "string",
  StorageCondition: "string",
  ShelfLife: "string",
  IngredientLabel: "string",
  ImagesPath: "string",

  InteractionIngredientName: "string",
  
  RegistrationDate: "2024-03-20",
  SubsidyLabel: "string",
  SubsidyPercentage: 0,

  CreatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  CreatedDate: "2024-03-20T12:09:32.237Z",
  UpdatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  UpdatedDate: "2024-03-20T12:09:32.237Z",
  OtherIngredients: "string",
  AtcCode: "string",
  ATCRelatedIngredient: "string",
  ReviewDate: "2024-03-20",
  MoPHCode: "string",
  CargoShippingTerms: "string",
  ProductType: "string",
  NotMarketed: false,
  HospPricing: false,
  IsSubstitutable: false,
  IsDouane: false,
  IsScore: false,
  IsAccute: false,
  IsChronic: false,
  IsParentaral: false,
  IsEssential: false,
  IsMentalHealth: false,
  ImageDefault: false,
  DFSequence: "string",
  PriceForeign: 0,
  CurrencyForeign: "USD",
});

// Stepper provider component
export const StepperProvider = ({ children, initialValue }) => {
  const [formData, setFormData] = useState(generateInitialFormData());
  const [isEditMode, setIsEditMode] = useState(false);
  const [onEdit, setOnEdit] = useState(() => {});
  const [drugNames, setDrugNames] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const [selectedInput, setSelectedInput] = useState("");
  const [isAddModalOpen, setAddModalOpen, setAddModal] = useState(false);
  const [isEditModalOpen, setEditModalOpen, setEditModal] = useState(false);
  const [editInputValue, setEditInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [CurrencyForeign, setCurrencyForeign] = useState("");
  const forms = [
    "DrugRegistryForm",
    "DrugRegistryFormAddons",
    "PricesComparison",
    "DrugDocuments",
    "DrugSubstanceInformationsForm",
    "UnifiedDrugInformations",
    "PricingInformations",
    "ManufacturingAndImportingInfo",
  ];
  useEffect(() => {
    const fetchResponsibleParties = async () => {
      try {
        const response = await axios.get("/api/responsibleParty/");
        const data = response.data;
  
        const responsiblePartyList = data.map((party) => ({
          id: party.ResponsiblePartyId,
          name: party.ResponsiblePartyName,
          country: party.Country,
        }));
  
        setResponsibleParty(responsiblePartyList);
        setInputOptions((prevOptions) => ({
          ...prevOptions,
          ResponsibleParty: responsiblePartyList,
        }));
      } catch (error) {
        console.error("Failed to fetch Responsible Parties:", error);
      }
    };
  
    const fetchManufacturers = async () => {
      try {
        const response = await axios.get("/api/manufacturer/");
        const data = response.data;
  
        const manufacturerList = data.map((manufacturer) => ({
          id: manufacturer.ManufacturerId,
          name: manufacturer.ManufacturerName,
          country: manufacturer.Country,
        }));
  
        setManufacturers(manufacturerList);
        setInputOptions((prevOptions) => ({
          ...prevOptions,
          Manufacturer: manufacturerList,
        }));
      } catch (error) {
        console.error("Failed to fetch Manufacturers:", error);
      }
    };
  
    fetchResponsibleParties();
    fetchManufacturers();
  }, []);
  // Calculate step indicators
  const stepIndicators = forms.map((form, index) => (
    <div
      key={index}
      className={`step-indicator ${currentStep === index ? "active" : ""}`}
    ></div>
  ));

  useEffect(() => {
    async function fetchDrugNames() {
      try {
        const response = await fetch("http://localhost:5000/drugs/all");
        const data = await response.json();

        // Extract DrugNames from the response
        const drugNames = data.map((drug) => drug.DrugName);

        setDrugNames(drugNames);
      } catch (error) {
        console.error("Error fetching drug names:", error);
      }
    }

    fetchDrugNames();
  }, []);

  const openAddModal = (inputName) => {
    setSelectedInput(inputName);
    setAddModalOpen(true);
  };

  const openEditModal = (inputName, initialValue) => {
    setSelectedInput(inputName);
    setEditInputValue(initialValue);
    setEditModalOpen(true);
  };

  const openModal = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAdd = (value) => {
    console.log("Adding value:", value);
  };

  const handleEdit = () => {
    console.log("Inside handleEdit");
    console.log("onEdit:", onEdit);
    onEdit({ originalValue: initialValue, updatedValue: inputValue });
    closeModal();
  };

  const handleCancel = () => {
    console.log("Modal cancelled");
  };

  const currencySymbols = {
    USD: "$",
    CAD: "C$",
    EUR: "€",
    CHF: "CHF",
    DKK: "kr",
    GBP: "£",
    SAR: "SAR",
    JOD: "JD",
    LBP: "LBP",
  };

  const exchangeRates = {
    USD: 1,
    CAD: 0.72,
    EUR: 1.08,
    CHF: 1.11,
    DKK: 0.72,
    GBP: 1.21,
    SAR: 0.27,
    JOD: 1.41,
    LBP: 90000,
  };

  const datePickerOptions = {
    dateFormat: "Y-m-d",
    minDate: "today",
    maxDate: new Date(),
  };

  const getTitle = (inputName) => `Add new ${addSpacesToInputName(inputName)}`;

  const [inputOptions, setInputOptions] = useState({
  ProductType: [
    "Brand",
    "Generic",
  ],
  ResponsibleParty: [],
  ResponsiblePartyCountry: ["France", "Spain", "USA", "Sweden", "Lebanon"],
  Manufacturer: [], // Will now store { id, name } objects
  CargoShippingTerms: ["CIF", "FOB"],
});


const [responsibleParty, setResponsibleParty] = useState([]);
const [manufacturers, setManufacturers] = useState([]);  
const [selectedManufacturerId, setSelectedManufacturerId] = useState("");
const [selectedManufacturerName, setSelectedManufacturerName] = useState("");
const [selectedManufacturingCountry, setSelectedManufacturingCountry] = useState("");



useEffect(() => {
  const fetchManufacturers = async () => {
    try {
      const response = await fetch("/api/manufacturer/");
      const data = await response.json();

      console.log("API Response:", data); // Debugging step

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: Expected an array");
      }

      // Extract Manufacturer IDs, Names, and Countries
      const manufacturerList = data.map((m) => ({
        id: m.ManufacturerId, // Assuming your API returns an "id" field
        name: m.ManufacturerName,
        country: m.Country,
      }));

      // Update state with manufacturers as objects
      setManufacturers(manufacturerList);
      setInputOptions((prevOptions) => ({
        ...prevOptions,
        Manufacturer: manufacturerList, // Store objects instead of names
      }));
    } catch (error) {
      console.error("Failed to fetch manufacturers:", error);
    }
  };

  const fetchResponsibleParties = async () => {
    try {
      const response = await fetch("/api/responsibleParty/");
      const data = await response.json();

      console.log("API Response:", data); // Debugging step

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: Expected an array");
      }

      // Extract Manufacturer IDs, Names, and Countries
      const responsiblePartyList = data.map((m) => ({
        id: m.ResponsiblePartyId, // Assuming your API returns an "id" field
        name: m.ResponsiblePartyName,
        country: m.Country,
      }));
      console.log('reslist',responsiblePartyList );

      // Update state with manufacturers as objects
      setResponsibleParty(responsiblePartyList);
      setInputOptions((prevOptions) => ({
        ...prevOptions,
        ResponsibleParty: responsiblePartyList, // Store objects instead of names
      }));
    } catch (error) {
      console.error("Failed to fetch Responsible Parties:", error);
    }
  };

  fetchResponsibleParties();
  fetchManufacturers();
}, []);




const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "Manufacturer") {
    const selectedManufacturer = inputOptions.Manufacturer.find((m) => m.id == value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      Manufacturer: selectedManufacturer ? selectedManufacturer.name : "",
      ManufacturerId: selectedManufacturer ? selectedManufacturer.id : "",
      ManufacturerCountry: selectedManufacturer ? selectedManufacturer.country : "", // Auto-populate country
    }));
  } else if (name === "ResponsibleParty") {
    const selectedResponsibleParty = inputOptions.ResponsibleParty.find((m) => m.id == value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      ResponsibleParty: selectedResponsibleParty ? selectedResponsibleParty.name : "",
      ResponsiblePartyId: selectedResponsibleParty ? selectedResponsibleParty.id : "",
      ResponsiblePartyCountry: selectedResponsibleParty ? selectedResponsibleParty.country : "", // Auto-populate country
    }));
  } else {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
};




  function addSpacesToInputName(inputName) {
    // Convert camelCase or PascalCase to readable format
    const spacedName = inputName.replace(/([a-z])([A-Z])/g, "$1 $2");
    // Capitalize the first letter
    return spacedName.charAt(0).toUpperCase() + spacedName.slice(1);
  }

  function convertToUSD() {
    if (formData && formData.PriceForeign && formData.CurrencyForeign) {
      const convertedPrice =
        formData.PriceForeign / exchangeRates[formData.CurrencyForeign];
      return convertedPrice.toFixed(2); // Display with 2 decimal places
    }
    return "";
  }

  function convertToLBP() {
    if (formData && formData.PriceForeign && formData.CurrencyForeign) {
      const priceInUSD = convertToUSD();
      const convertedPrice =
        (priceInUSD / exchangeRates.USD) * exchangeRates.LBP;
      return convertedPrice.toFixed(2);
    }
    return "";
  }

  

  // Function to handle input change in forms
  const handleCheckBoxChange = (inputName, checked) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [inputName]: checked,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, forms.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  // Function to handle next step or submit
  const handleNextOrSubmit = () => {
      console.log("Final Form Data Before Submission:", JSON.stringify(formData, null, 2));
      fetch("/api/drugs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      .then((response) => {
        console.log("Response Status:", response.status);
        return response.json().then((data) => {
          console.log("Server Response:", data);
        });
      })
      .catch((error) => console.error("Error submitting form data:", error));
  };

  const stepperContextValue = {
    formData,
    setFormData,
    handleInputChange,
    handleCheckBoxChange,
    stepIndicators,
    currentStep,
    nextStep,
    prevStep,
    currencySymbols,
    exchangeRates,
    convertToUSD,
    convertToLBP,
    CurrencyForeign,
    handleNextOrSubmit,
    datePickerOptions,
    getTitle,
    inputOptions,
    addSpacesToInputName,
    AddModal,
    openModal,
    setAddModal,
    setEditModal,
    EditModal,
    closeModal,
    openAddModal,
    openEditModal,
    handleAdd,
    handleEdit,
    handleCancel,
    selectedInput,
    setSelectedInput,
    isEditMode,
    onEdit,
    setIsEditMode,
    editInputValue,
    setEditInputValue,
    isModalOpen,
    isAddModalOpen,
    isEditModalOpen,
    setAddModalOpen,
    setEditModalOpen,
    routeOptions,
    dosageOptions,
    dosageFormOptions,
    presentationContainerOptions,
    prescriptionAndDispensingConditionOptions,
    drugNames,
  };

  return (
    <StepperContext.Provider value={stepperContextValue}>
      {children}
    </StepperContext.Provider>
  );
};

StepperProvider.propTypes = {
  children: PropTypes.node.isRequired,
  prevStep: PropTypes.func,
};

export default StepperProvider;
