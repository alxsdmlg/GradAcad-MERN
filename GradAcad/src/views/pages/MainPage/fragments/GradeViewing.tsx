import styles from "../styles/MainPage.module.scss";
import studentImg from "../../../../assets/images/student_image.jpg";
import nclogo from "../../../../assets/images/nc_logo.png";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { useTerm } from "../../../../hooks/useTerm";
import { useContext, useEffect, useState } from "react";
import API from "../../../../context/axiosInstance";
import { UserContext } from "../../../../context/UserContext";

export interface StudentDetails {
  StudentId: string;
  LastName: string;
  FirstName: string;
  MiddleInitial: string;
  SectionId: string;
  StudentType: string;
}

export interface StudentGradeDetails {
  SubjectId: string;
  SubjectName: string;
  Credits: number;
  acadYr: string;
  sem: string;
  terms: {
    PRELIM?: number;
    MIDTERM?: number;
    FINAL?: number;
  };
  prelimRemarks?: string;
  midtermRemarks?: string;
  finalRemarks?: string;
}

const GradeViewing = () => {
  const iconWH = 270;
  let courseName = "Unknown Course";
  let yearLevel = "Unknown Year";

  const context = useContext(UserContext);
  if (!context) {
    throw new Error("ExportExcel must be used within a UserProvider");
  }

  const { user } = context;

  const { activeAcadYrs, activeSems } = useTerm();

  const [studentDetails, setIsStudentDetails] = useState<StudentDetails[]>([
    {
      StudentId: "2020-0081",
      LastName: "Dumalaog",
      FirstName: "Alexis Jhudiel",
      MiddleInitial: "N",
      SectionId: "BSCS-4A",
      StudentType: "REGULAR",
    },
  ]);

  useEffect(() => {
    const fetchStudentInfoById = async () => {
      try {
        const response = await API.post("/student/getStudentInfoById", {
          studentId: user?.refId,
        });

        setIsStudentDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch student info:", error);
      }
    };

    if (user?.refId) {
      fetchStudentInfoById();
    }
  }, [user?.refId]);

  if (studentDetails.length > 0) {
    const sectionId = studentDetails[0].SectionId; // e.g., "BSCS-4A"
    const [courseCode, yearSection] = sectionId.split("-");
    const yearNumber = yearSection.match(/\d/)?.[0]; // Extract the digit

    const courseMap: Record<string, string> = {
      BSCS: "Bachelor of Science in Computer Science",
      BEED: "Bachelor of Elementary Education",
      BSED: "Bachelor of Secondary Education",
      BSHM: "Bachelor of Science in Hospitality Management",
      ACT: "Associate in Computer Technology",
    };

    const yearLevelMap: Record<string, string> = {
      "1": "First Year",
      "2": "Second Year",
      "3": "Third Year",
      "4": "Fourth Year",
    };

    courseName = courseMap[courseCode] || courseName;
    yearLevel = yearLevelMap[yearNumber || ""] || yearLevel;
  }

  const loadImage = async (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });
  };

  const handlePrintPDF = async () => {
    const doc = new jsPDF();

    const pageWidthTitle = doc.internal.pageSize.getWidth();

    // Add top-left corner text
    doc.setFontSize(9);
    doc.setFont("times", "italic");
    doc.text("Student's Copy", pageWidthTitle - 30, 10);

    // Load logo image
    const NClogo = await loadImage(nclogo);

    // Logo dimensions
    const logoWidth = 28;
    const logoHeight = 28;
    const logoX = (pageWidthTitle - logoWidth) / 2; // Center horizontally

    // Add centered logo
    doc.addImage(NClogo, "PNG", logoX, 10, logoWidth, logoHeight);

    // Header text
    doc.setFontSize(13);
    doc.setFont("times", "bold");
    doc.text("NORZAGARAY COLLEGE", pageWidthTitle / 2, 45, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text(
      "Municipal Compound, Poblacion, Norzagaray, Bulacan",
      pageWidthTitle / 2,
      50,
      { align: "center" }
    );

    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("CLASS CARD", pageWidthTitle / 2, 62, { align: "center" });

    // Left column x and right column x
    const leftX = 20;
    const rightX = pageWidthTitle / 2 + 25; // Slight offset from center

    // Starting Y position for both columns
    let startY = 75;
    const lineSpacing = 8;

    doc.setFontSize(10);
    doc.setFont("times", "bold");

    // LEFT SIDE
    doc.setFontSize(10);

    // Student ID
    doc.setFont("times", "normal");
    doc.text("Student ID: ", leftX, startY);
    doc.setFont("times", "bold");
    doc.text("2021-0213", leftX + 30, startY); // Adjust the offset

    // Student Name
    doc.setFont("times", "normal");
    doc.text("Student Name: ", leftX, startY + lineSpacing);
    doc.setFont("times", "bold");
    doc.text("DUMALAOG, ALEXIS JHUDIEL N.", leftX + 30, startY + lineSpacing);

    // Course & Section
    doc.setFont("times", "normal");
    doc.text("Course & Section: ", leftX, startY + lineSpacing * 2);
    doc.setFont("times", "bold");
    doc.text("BSCS - 4A", leftX + 30, startY + lineSpacing * 2);

    // RIGHT SIDE
    doc.setFont("times", "normal");
    doc.text("Academic Year: ", rightX, startY);
    doc.setFont("times", "bold");
    doc.text("2024 - 2025", rightX + 25, startY);

    doc.setFont("times", "normal");
    doc.text("Semester: ", rightX, startY + lineSpacing);
    doc.setFont("times", "bold");
    doc.text("1st SEMESTER", rightX + 25, startY + lineSpacing);

    // Extract table data
    const headers = Array.from(
      document.querySelectorAll("#studentTable th")
    ).map((th) => th.textContent);
    const rows = Array.from(
      document.querySelectorAll("#studentTable tbody tr")
    ).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) => td.textContent)
    );

    // Add table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: startY + 25,
      margin: { top: 60 },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [0, 0, 0], // Black border
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [200, 200, 200], // Light gray
        textColor: 20,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      bodyStyles: {
        valign: "middle",
        halign: "center",
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
    });

    // **Open print panel**
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <>
      <header
        className={styles.GradeViewing}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "18px 40px",
        }}
      >
        <h3>Grade Viewing</h3>
        <button
          style={{
            backgroundColor: "#0F2A71",
            borderRadius: "10px",
          }}
          onClick={handlePrintPDF}
        >
          DOWNLOAD PDF
        </button>
      </header>
      <main style={{ width: "100%" }}>
        {studentDetails.length > 0 && (
          <section
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundColor: "#EAECF0",
              padding: "25px",
            }}
            className={styles.studentInfo}
          >
            <img
              src={studentImg}
              alt="Your Picture"
              width={iconWH}
              height={iconWH}
            />
            <div>
              <div className={styles.studentTitle}>
                <p>Student Name</p>
                <h3>
                  {studentDetails[0].LastName}, {studentDetails[0].FirstName}{" "}
                  {studentDetails[0].MiddleInitial}.
                </h3>
              </div>
              <div className={styles.studentTitle}>
                <p>Student Number</p>
                <h3>{studentDetails[0].StudentId}</h3>
              </div>
              <div className={styles.studentTitle}>
                <p>Academic Year</p>
                <select name="" id="">
                  <option value={activeAcadYrs}>{activeAcadYrs}</option>
                </select>
              </div>
            </div>
            <div>
              <div className={styles.studentTitle}>
                <p>Course</p>
                <h3>{courseName.toUpperCase()}</h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "60px",
                }}
              >
                <div className={styles.studentTitle}>
                  <p>Year Level</p>
                  <h3>{yearLevel}</h3>
                </div>
                <div className={styles.studentTitle}>
                  <p>Student Type</p>
                  <h3>{studentDetails[0].StudentType}</h3>
                </div>
              </div>
              <div className={styles.studentTitle}>
                <p>Semester</p>
                <select name="" id="">
                  <option value={activeSems}>{activeSems} Semester</option>
                </select>
              </div>
            </div>
          </section>
        )}
        <section style={{ maxWidth: "100%", padding: "30px" }}>
          <table className={styles.studentTable} id="studentTable">
            <thead>
              <tr>
                <th>#</th>
                <th>SUBJECT CODE</th>
                <th>SUBJECT DESCRIPTION</th>
                <th>CREDITS</th>
                <th>GRADE</th>
                <th>REMARK</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>PRC 101</td>
                <td>Practicum 101</td>
                <td>3</td>
                <td>90</td>
                <td>PASSED</td>
              </tr>
              <tr>
                <td>1</td>
                <td>PRC 101</td>
                <td>Practicum 101</td>
                <td>3</td>
                <td>90</td>
                <td>PASSED</td>
              </tr>
              <tr>
                <td>1</td>
                <td>PRC 101</td>
                <td>Practicum 101</td>
                <td>3</td>
                <td>90</td>
                <td>PASSED</td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              paddingTop: "40px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "100px",
            }}
            className={styles.belowTable}
          >
            <h4>Total Units: 9</h4>
            <h4>Average 1.25</h4>
          </div>
        </section>
      </main>
    </>
  );
};

export default GradeViewing;
