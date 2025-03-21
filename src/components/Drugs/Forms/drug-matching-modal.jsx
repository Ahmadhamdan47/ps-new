"use client"

import { useEffect, useState } from "react"
import { X, Plus, Edit, Download, Save, Trash, Search } from "lucide-react"

const DrugMatchingModal = ({
  isOpen,
  onClose,
  atcCode,
  route,
  dosageValueN,
  dosageUnitN,
  dosageValueD,
  dosageUnitD,
}) => {
  const [matchingDrugs, setMatchingDrugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingDrug, setEditingDrug] = useState(null)
  const [isAddingDrug, setIsAddingDrug] = useState(false)
  const [newDrug, setNewDrug] = useState({
    DrugName: "",
    DFSequence: "",
    ATC_Code: atcCode || "",
    OtherIngredients: "",
    Form: "",
    Dosage: "",
    Route: route || "",
    Manufacturer: "",
    RegistrationNumber: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isOpen) return

    const fetchMatchingDrugs = async () => {
      try {
        setLoading(true)
        const response = await get("/api/drugs/all")
        if (!response.ok) {
          throw new Error("Failed to fetch drugs data")
        }

        const data = await response.json()

        // Convert dosage values to numbers for comparison
        const numDosageValueN = dosageValueN ? Number(dosageValueN) : 0
        const numDosageValueD = dosageValueD ? Number(dosageValueD) : 0

        // Filter logic
        const filtered = data.drugs.filter((drug) => {
          const essentialMatch = drug.ATC_Code === atcCode
          if (!essentialMatch) return false

          // Optional route check
          if (route && drug.Route !== route) {
            // If you want strict route matching, return false here instead
          }

          // If the drug has no dosage info, we still include it if ATC matches
          if (!drug.Dosages || drug.Dosages.length === 0) {
            return true
          }

          // If user provided dosage details, try to match them
          if (numDosageValueN || dosageUnitN) {
            const dosageMatch = drug.Dosages.some((dosage) => {
              const numeratorMatch =
                !numDosageValueN ||
                (dosage.Numerator1 === numDosageValueN && (!dosageUnitN || dosage.Numerator1Unit.includes(dosageUnitN)))

              const denominatorMatch =
                !numDosageValueD ||
                (dosage.Denominator1 === numDosageValueD &&
                  (!dosageUnitD ||
                    dosage.Denominator1Unit.includes(dosageUnitD) ||
                    (!dosage.Denominator1Unit && !dosageUnitD)))

              return numeratorMatch || denominatorMatch
            })
            // Return `dosageMatch` if you need strict dosage matching:
            return true
          }
          return true
        })

        setMatchingDrugs(filtered)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching drugs:", err)
        setError("Failed to fetch matching drugs. Please try again.")
        setLoading(false)
      }
    }
    fetchMatchingDrugs()
  }, [isOpen, atcCode, route, dosageValueN, dosageUnitN, dosageValueD, dosageUnitD])

  // Editing, deleting, adding, exporting logic
  const handleEdit = (drug) => {
    setEditingDrug({ ...drug })
  }

  const handleSaveEdit = () => {
    const updatedDrugs = matchingDrugs.map((drug) => (drug.DrugID === editingDrug.DrugID ? editingDrug : drug))
    setMatchingDrugs(updatedDrugs)
    setEditingDrug(null)
  }

  const handleCancelEdit = () => {
    setEditingDrug(null)
  }

  const handleDelete = (drugId) => {
    const updatedDrugs = matchingDrugs.filter((drug) => drug.DrugID !== drugId)
    setMatchingDrugs(updatedDrugs)
  }

  const handleAddDrug = () => {
    setIsAddingDrug(true)
  }

  const handleSaveNewDrug = () => {
    const newDrugWithId = {
      ...newDrug,
      DrugID: Date.now(),
      // Add any default values needed for the drugs array
      Dosages: [
        {
          Numerator1: Number.parseFloat(newDrug.Dosage.split(" ")[0]) || 0,
          Numerator1Unit: newDrug.Dosage.split(" ").slice(1).join(" ") || "",
          Denominator1: 0,
          Denominator1Unit: "",
        },
      ],
      DrugPresentations: [],
    }
    setMatchingDrugs([...matchingDrugs, newDrugWithId])
    setIsAddingDrug(false)
    setNewDrug({
      DrugName: "",
      DFSequence: "",
      ATC_Code: atcCode || "",
      OtherIngredients: "",
      Form: "",
      Dosage: "",
      Route: route || "",
      Manufacturer: "",
      RegistrationNumber: "",
    })
  }

  const handleCancelAdd = () => {
    setIsAddingDrug(false)
    setNewDrug({
      DrugName: "",
      DFSequence: "",
      ATC_Code: atcCode || "",
      OtherIngredients: "",
      Form: "",
      Dosage: "",
      Route: route || "",
      Manufacturer: "",
      RegistrationNumber: "",
    })
  }

  const handleExport = () => {
    const headers = [
      "Drug Name",
      "DFSequence",
      "ATC Code",
      "Ingredient",
      "Form",
      "Dosage",
      "Route",
      "Manufacturer",
      "Registration Number",
    ]
    const csvContent = [
      headers.join(","),
      ...matchingDrugs.map((drug) =>
        [
          `"${drug.DrugName || ""}"`,
          `"${drug.DFSequence || ""}"`,
          `"${drug.ATC_Code || ""}"`,
          `"${drug.OtherIngredients || ""}"`,
          `"${drug.Form || ""}"`,
          `"${drug.Dosage || ""}"`,
          `"${drug.Route || ""}"`,
          `"${drug.Manufacturer || ""}"`,
          `"${drug.RegistrationNumber || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "matching_drugs.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Simple search
  const filteredDrugs = searchTerm
    ? matchingDrugs.filter(
        (drug) =>
          (drug.DrugName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (drug.DFSequence?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (drug.OtherIngredients?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (drug.ATC_Code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (drug.Manufacturer?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
      )
    : matchingDrugs

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-30">
      {/* Container for all content - using a max-width to ensure it stays readable */}
      <div className="max-w-7xl w-full max-h-[90vh] flex flex-col bg-white rounded-lg shadow-xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Matching Drugs</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddDrug}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Drug
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 flex items-center gap-2 border-b bg-white">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search drugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Main Table - Using overflow for the table section only */}
        <div className="p-4 flex-1 overflow-auto bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : filteredDrugs.length === 0 ? (
            <div className="text-center p-4">No matching drugs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border border-gray-300">Name</th>
                    <th className="p-3 text-left border border-gray-300">DFSequence</th>
                    <th className="p-3 text-left border border-gray-300">Ingredient</th>
                    <th className="p-3 text-left border border-gray-300">Form</th>
                    <th className="p-3 text-left border border-gray-300">Dosage</th>
                    <th className="p-3 text-left border border-gray-300">Route</th>
                    <th className="p-3 text-left border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* New drug row */}
                  {isAddingDrug && (
                    <tr className="bg-white">
                      <td className="p-3 border border-gray-300">
                        <input
                          type="text"
                          value={newDrug.DrugName}
                          onChange={(e) => setNewDrug({ ...newDrug, DrugName: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="Drug name"
                        />
                      </td>
                      <td className="p-3 border border-gray-300">
                        <input
                          type="text"
                          value={newDrug.DFSequence}
                          onChange={(e) => setNewDrug({ ...newDrug, DFSequence: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="e.g. C22C24C23C21"
                        />
                      </td>
                      <td className="p-3 border border-gray-300">
                        <input
                          type="text"
                          value={newDrug.OtherIngredients}
                          onChange={(e) => setNewDrug({ ...newDrug, OtherIngredients: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="Main ingredient"
                        />
                      </td>
                      <td className="p-3 border border-gray-300">
                        <input
                          type="text"
                          value={newDrug.Form}
                          onChange={(e) => setNewDrug({ ...newDrug, Form: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="e.g. Injectable"
                        />
                      </td>
                      <td className="p-3 border border-gray-300">
                        <input
                          type="text"
                          value={newDrug.Dosage}
                          onChange={(e) => setNewDrug({ ...newDrug, Dosage: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="e.g. 1440 ELISA units/ml"
                        />
                      </td>
                      <td className="p-3 border border-gray-300">
                        <input
                          type="text"
                          value={newDrug.Route}
                          onChange={(e) => setNewDrug({ ...newDrug, Route: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="e.g. IM"
                        />
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={handleSaveNewDrug}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Save"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleCancelAdd}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* Existing drugs */}
                  {filteredDrugs.map((drug) => (
                    <tr key={drug.DrugID} className="bg-white hover:bg-gray-50">
                      {editingDrug && editingDrug.DrugID === drug.DrugID ? (
                        <>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="text"
                              value={editingDrug.DrugName || ""}
                              onChange={(e) => setEditingDrug({ ...editingDrug, DrugName: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="text"
                              value={editingDrug.DFSequence || ""}
                              onChange={(e) => setEditingDrug({ ...editingDrug, DFSequence: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="text"
                              value={editingDrug.OtherIngredients || ""}
                              onChange={(e) => setEditingDrug({ ...editingDrug, OtherIngredients: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="text"
                              value={editingDrug.Form || ""}
                              onChange={(e) => setEditingDrug({ ...editingDrug, Form: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="text"
                              value={editingDrug.Dosage || ""}
                              onChange={(e) => setEditingDrug({ ...editingDrug, Dosage: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="text"
                              value={editingDrug.Route || ""}
                              onChange={(e) => setEditingDrug({ ...editingDrug, Route: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={handleSaveEdit}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <Save className="h-5 w-5" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Cancel"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 border border-gray-300">{drug.DrugName}</td>
                          <td className="p-3 border border-gray-300">{drug.DFSequence}</td>
                          <td className="p-3 border border-gray-300">{drug.OtherIngredients}</td>
                          <td className="p-3 border border-gray-300">{drug.Form}</td>
                          <td className="p-3 border border-gray-300">{drug.Dosage}</td>
                          <td className="p-3 border border-gray-300">{drug.Route}</td>
                          <td className="p-3 border border-gray-300">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEdit(drug)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(drug.DrugID)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-600">{filteredDrugs.length} drugs found</div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DrugMatchingModal

