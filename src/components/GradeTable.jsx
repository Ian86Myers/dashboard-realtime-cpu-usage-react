import React, { useState } from "react";
// import AdminIcon from "./adminIcon";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { gradeRequirementsTheme as theme } from "../theme.js";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { projectPhaseTemplates as initialProjectPhaseTemplates } from "../data/ProjectPhaseTemplates";
import { ThemeProvider } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// const cellCommonStyle = {
//   textAlign: "center",
// };

/**
 * Dialog component for managing admin phase table.
 *
 * @param {*} props
 * @returns
 */
function DialogAdminPhaseTable(props) {
  // if (props) {
  //   console.log("PROPS IN DIALOG ADMIN PHASE TABLE:", props);
  // }

  // const [hasAdminPrivileges, setHasAdminPrivileges] = React.useState(false);
  const [selectedTests, setSelectedTests] = React.useState([]);
  const [selectedGrade, setSelectedGrade] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [options, setOptions] = React.useState([
    "None",
    ...Object.keys(initialProjectPhaseTemplates),
  ]);
  const [projectPhaseTemplates, setProjectPhaseTemplates] = React.useState(
    initialProjectPhaseTemplates
  );
  const [isAddingPhase, setIsAddingPhase] = React.useState(false);
  const [newPhaseInput, setNewPhaseInput] = React.useState("");
  const [newCommentInput, setNewCommentInput] = React.useState("");
  const [editRow, setEditRow] = React.useState(null);

  const grades = ["A", "B", "C", "D", "P", "NA"];
  const testOptions = [
    "VIM",
    "CDL",
    "FIN",
    "CCK",
    "NSE",
    "LGA",
    "VPD",
    "MPD",
    "GTM",
    "VER",
    "A2L",
    "ABS",
    "LVS",
    "DRC",
    "DFM",
    "NMC",
    "AMC",
    "CSS",
    "EXC",
    "N85",
    "N10",
    "NBC",
    "SEM",
    "NRA",
    "SCN",
    "PWD",
    "ECA",
    "EIN",
    "CPA",
    "ANT",
    "EPA",
    "EM",
  ];

  /**
   * Close the dialog.
   */
  function handleClose() {
    props.setOpenDialogAdminPhaseTable(false);
  }

  /**
   * Handle click event for selecting a grade.
   *
   * @param {*} event
   * @param {*} test
   */
  const handleGradeClick = (event, test) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Close the grade selection menu.
   */
  const handleCloseGradeMenu = () => {
    setAnchorEl(null);
  };

  /**
   * Sort tests based on a predefined order.
   *
   * @param {*} tests
   * @returns
   */
  const sortTests = (tests) => {
    const originalTestOrder = [...testOptions];

    return tests.sort((a, b) => {
      if (a === "Comment") return 1; // push comment to end
      if (b === "Comment") return -1; // keep comment at end

      return originalTestOrder.indexOf(a) - originalTestOrder.indexOf(b);
    });
  };

  /**
   * Handle the selection of a grade for a specific test.
   *
   * @param {*} grade
   * @param {*} testName
   */
  function handleSelectGrade(grade, testName) {
    setSelectedGrade((prev) => ({ ...prev, [testName]: grade }));
    setSelectedTests((prevState) => sortTests([...prevState, testName]));
    setAnchorEl(null);
  }

  const selectedTestsObject = selectedTests.reduce((acc, test) => {
    acc[test] = selectedGrade[test] || "NA";
    return acc;
  }, {});

  let selectedPhaseWithTests = {};

  if (selectedTemplate && selectedTemplate !== "None") {
    selectedPhaseWithTests[selectedTemplate] = selectedTestsObject;
  }

  const allTests = [
    ...new Set(Object.values(projectPhaseTemplates).flatMap(Object.keys)),
  ];

  /**
   * Handle the deletion of a project phase.
   *
   * @param {*} phaseToDelete
   */
  const handleDelete = (phaseToDelete) => {
    const updatedTemplates = { ...projectPhaseTemplates };
    delete updatedTemplates[phaseToDelete];
    setProjectPhaseTemplates(updatedTemplates);
  };

  const handleAddPhaseClick = () => {
    setIsAddingPhase(true);
    setEditRow(null);
  };

  const handleCancelPhaseClick = () => {
    setIsAddingPhase(false);
    setNewPhaseInput("");
    setNewCommentInput("");
  };

  /**
   * Handles the addition of a new project phase.
   *
   * @throws {Error} If an error occurs during the process.
   *
   * @param {string} newPhaseInput - The input representing the new project phase name.
   * @param {string} newCommentInput - The input representing comments for the new project phase.
   * @param {Object} selectedGrade - The selected grade for the new project phase.
   * @param {string | null} editRow - The key of the row to edit, or null if adding a new row.
   *
   * @returns {void}
   *
   * This function trims input values, validates them, and updates project templates
   * based on user input. It handles the addition or editing of project phases,
   * including the phase name, comments, and selected grade.
   */
  async function handleAddNewPhase() {
    try {
      const trimmedNewPhaseInput = newPhaseInput.trim();
      const trimmedNewCommentInput = newCommentInput.trim();

      if (trimmedNewPhaseInput !== "") {
        const newPhase = trimmedNewPhaseInput;
        const projectPhase = {
          ...(trimmedNewCommentInput !== "" && {
            Comment: trimmedNewCommentInput,
          }),
          ...selectedGrade,
        };
        // Include Comment field if trimmedNewCommentInput is not empty
        if (trimmedNewCommentInput !== "") {
          projectPhase.Comment = trimmedNewCommentInput;
        }
        const updatedTemplates = {
          ...projectPhaseTemplates,
          [newPhase]: projectPhase,
        };

        // If editing an existing row, update it instead of overwriting
        if (editRow && projectPhaseTemplates[editRow]) {
          updatedTemplates[editRow] = {
            ...projectPhaseTemplates[editRow],
            ...projectPhase,
          };
          if (newPhase !== editRow) {
            delete updatedTemplates[editRow];
          }
        }
        setProjectPhaseTemplates(updatedTemplates);
        setNewPhaseInput("");
        setNewCommentInput("");
        setIsAddingPhase(false);
        setSelectedGrade({});
        setEditRow(null);
      }
    } catch (error) {
      console.error("AddNewPhaseInput Error: ", error);
    }
  }

  /**
   * Handle editing a row.
   *
   * @param {string} rowKey - The key of the row to edit.
   */
  function handleEditRow(rowKey) {
    const editedRow = projectPhaseTemplates[rowKey];

    // Use a callback to ensure the state is updated
    setEditRow(rowKey);
    setIsAddingPhase(true);
    setSelectedTemplate(rowKey);
    setSelectedTests(Object.keys(editedRow));
    setSelectedGrade({ ...editedRow });
    setNewPhaseInput(rowKey);

    setNewCommentInput((prevComment) => {
      const newComment = editedRow.Comment || prevComment;
      return newComment;
    });

    // console.log("Edit row set to:", rowKey);
    // console.log(`Row: ${rowKey}, EditRow: ${editRow}}`);
  }

  /**
   * Handle copying a row.
   *
   * @param {string} rowKey - The key of the row to copy.
   */
  function handleCopyRow(rowKey) {
    const copiedRow = projectPhaseTemplates[rowKey];

    if (copiedRow) {
      setIsAddingPhase(true);
      setSelectedTemplate(rowKey);
      setSelectedTests(Object.keys(copiedRow));
      setSelectedGrade({ ...copiedRow });
      setNewPhaseInput(rowKey + "_");
      setNewCommentInput(copiedRow.Comment || "");
      setEditRow(null);
    }
  }

  /**
   * Get the background color based on the grade.
   *
   * @param {*} grade
   * @returns
   */
  const getBackground = (grade) => {
    let color = "";
    if (grade === undefined) return color;
    if (typeof grade === "string") {
      if (grade === "A" || grade === "W") {
        color = "#3FFF3F";
      } else if (grade === "B" || grade === "C" || grade.startsWith("P")) {
        color = "yellow";
      } else if (grade === "D" || grade === "E" || grade === "F") {
        color = "#FF3F3F";
      }
    }
    return color;
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog onClose={handleClose} open={props.open}>
        <DialogTitle
          id="dialog-title"
          sx={{ textAlign: "left", position: "relative" }}
        >
          <Box display="flex" alignItems="center">
            {/* <Tooltip title="Administrator role confirmed" arrow> */}
            {/* <AdminIcon
                setBlueGroupsList={props.setBlueGroupsList}
                blueGroupsList={props.blueGroupsList}
              /> */}
            {/* </Tooltip> */}
            <Box flexGrow={1} textAlign="center">
              Define Minimum Grade Requirements
            </Box>
          </Box>
        </DialogTitle>

        <Typography component="div" gutterBottom>
          <TableContainer sx={{ maxWidth: "100%", overflowX: "initial" }}>
            <Table stickyHeader padding="none" size="small" tablelayout="fixed">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      textAlign: "left",
                      width: "78px",
                      position: "sticky",
                      left: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                    }}
                  >
                    Actions
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "left",
                      minWidth: "150px",
                      maxWidth: "200px",
                      position: "sticky",
                      left: "78px",
                      backgroundColor: "white",
                      zIndex: 1,
                    }}
                  >
                    Project Phase
                  </TableCell>

                  {testOptions.map((test, index) => (
                    <TableCell
                      key={test}
                      sx={{
                        textAlign: "center",
                        minWidth: "10px",
                        zIndex: 0,
                        padding: "0 5px",
                        marginRight:
                          index === testOptions.length - 1 ? "0" : "3px", // Add margin except for the last cell
                      }}
                    >
                      {test}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      textAlign: "center",
                      paddingLeft: "8px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Comment
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(projectPhaseTemplates).map(
                  ([phase, testGrades], index) => (
                    <TableRow
                      key={phase}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#F2f1f1" : "",
                        border: editRow === phase ? "1px solid black" : "",
                        // border: "1px solid yellow",
                        position: "relative", // Set position to relative
                        zIndex: editRow === phase ? 999 : 1,
                      }}
                    >
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          backgroundColor: "white",
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          borderLeft: editRow === phase ? "3px solid #000" : "",
                          borderTop: editRow === phase ? "3px solid #000" : "",
                          borderBottom:
                            editRow === phase ? "3px solid #000" : "",
                        }}
                      >
                        <FileCopyIcon
                          onClick={() => handleCopyRow(phase)}
                          sx={{ cursor: "pointer" }}
                        />
                        <EditIcon
                          onClick={() => handleEditRow(phase)}
                          sx={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                        <DeleteIcon
                          onClick={() => handleDelete(phase)}
                          sx={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: "78px",
                          zIndex: 1,
                          backgroundColor: "white",
                          whiteSpace: "nowrap",
                          padding: "0 4px",
                          borderTop: editRow === phase ? "3px solid #000" : "",
                          borderBottom:
                            editRow === phase ? "3px solid #000" : "",
                        }}
                      >
                        {phase}
                      </TableCell>

                      {testOptions.map((test) => (
                        <TableCell
                          key={test}
                          sx={{
                            textAlign: "center",
                            backgroundColor: getBackground(testGrades[test]),
                            borderTop:
                              editRow === phase ? "3px solid #000" : "",
                            borderBottom:
                              editRow === phase ? "3px solid #000" : "",
                          }}
                        >
                          {testGrades[test] || " "}
                        </TableCell>
                      ))}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          // maxWidth: "10vw",
                          paddingLeft: "8px",
                          borderRight:
                            editRow === phase ? "3px solid #000" : "",
                          borderTop: editRow === phase ? "3px solid #000" : "",
                          borderBottom:
                            editRow === phase ? "3px solid #000" : "",
                        }}
                      >
                        <Tooltip title={testGrades.Comment || ""} arrow>
                          <div
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {testGrades.Comment || ""}
                          </div>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                )}
                <TableRow
                  sx={{
                    backgroundColor: isAddingPhase
                      ? "rgba(85, 108, 214, 0.25)"
                      : "",
                  }}
                >
                  {isAddingPhase ? (
                    <>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: "#d4daf5",
                          width: "78px",
                        }}
                      >
                        <IconButton
                          onClick={handleAddNewPhase}
                          color="primary"
                          aria-label="Save"
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleCancelPhaseClick()}
                          color="secondary"
                          aria-label="Cancel"
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          zIndex: 1,
                          left: "78px",
                          minWidth: "200px",
                          maxWidth: "250px",
                          position: "sticky",
                          backgroundColor: "#d4daf5",
                        }}
                      >
                        <TextField
                          fullWidth
                          placeholder="Phase name here"
                          value={newPhaseInput}
                          onChange={(e) => setNewPhaseInput(e.target.value)}
                          inputProps={{ maxLength: 30 }}
                        />
                      </TableCell>
                    </>
                  ) : (
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        position: "sticky",
                        left: 0,
                        zIndex: 1,
                        backgroundColor: "white",
                      }}
                    >
                      <AddIcon
                        sx={{ cursor: "pointer" }}
                        onClick={handleAddPhaseClick}
                      />
                    </TableCell>
                  )}

                  {/* Added Menu for grades */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseGradeMenu}
                  >
                    {grades.map((grade) => (
                      <MenuItem
                        sx={{ color: "primary", textAlign: "center" }}
                        key={grade}
                        onClick={() =>
                          handleSelectGrade(
                            grade,
                            anchorEl?.getAttribute("name")
                          )
                        }
                      >
                        {grade}
                      </MenuItem>
                    ))}
                  </Menu>
                  {isAddingPhase ? (
                    testOptions.map((test, index) => (
                      <TableCell
                        key={test}
                        ssx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <MenuItem
                          key={test}
                          selected={selectedGrade[test] === test}
                          onClick={(e) => handleGradeClick(e, test)}
                          name={test}
                          sx={{
                            width: "10px",
                            maxWidth: "100%",
                            whiteSpace: "nowrap",
                            fontSize: "10px",
                            justifyContent: "center",
                            textAlign: "center",
                            alignContent: "center",
                            paddingLeft: "21.5px",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "center",
                              display: "flex",
                              justifyContent: "center",
                              alignContent: "center",
                            }}
                          >
                            {selectedGrade[test] ? (
                              selectedGrade[test]
                            ) : (
                              <ArrowDropDownIcon />
                            )}
                          </div>
                        </MenuItem>
                      </TableCell>
                    ))
                  ) : (
                    <TableCell colSpan={testOptions.length}>&nbsp;</TableCell>
                  )}

                  <TableCell
                    sx={{ maxWidth: "10vw", backgroundColor: "white" }}
                  >
                    {isAddingPhase && allTests.includes("Comment") ? (
                      <TextField
                        fullWidth
                        placeholder="Comment here"
                        value={newCommentInput || ""}
                        onChange={(e) => setNewCommentInput(e.target.value)}
                        inputProps={{ maxLength: 80 }}
                      />
                    ) : null}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>

        <DialogActions dividers="true" sx={{ position: "relative" }}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default DialogAdminPhaseTable;
