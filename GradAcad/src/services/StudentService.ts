import { API } from "@/context/axiosInstance";


export const StudentData = (
    department: string,
    section: string,
    setStudent: React.Dispatch<React.SetStateAction<any>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<any>>,
) => {
    API
        .post("/student/getSection", { department, section })
        .then((response) => {
            if (response.data) {
              setStudent(response.data.students);
            } else {
              setErrorMessage(response.data.message || "Invalid credentials.");
            }
          })
        .catch((error) => {
            const message = error.response?.data?.message || "An error occurred.";
            setErrorMessage(message);
        });
};

export const StudentGrade = ( 
  dept: string,
  acadYr: string,
  sem: string,
  sect: string,
  subjCode: string,
  terms: string[],
  setGrades: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<any>>,
) => {
  API
        .post("/grade/getAllGrades", {
          dept: dept,
          acadYr: acadYr,
          sem: sem,
          sect: sect,
          subjCode: subjCode,
          terms: terms,
        })
        .then((response) => {
          if (response.data.success && Array.isArray(response.data.data)) {
            setGrades(response.data.data);
            setError("");
          } else {
            setError("Failed to fetch grades.");
          }
        })
        .catch((error) => {
          setError("An error occurred while fetching grades.");
          console.error(error);
        })
};

export const StudentGradeAll = ( 
  acadYr: string,
  sem: string,
  dept: string,
  sect: string,
  subjectId: string,
  setGrades: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<any>>,
) => {
  API
        .post("/grade/getStudentGrades", {
          acadYr,
          sem,
          dept,
          sect,
          subjectId
        })
        .then((response) => {
          if (response.data.success && Array.isArray(response.data.data)) {
            setGrades(response.data.data);
            setError("");
          } else {
            setError("Failed to fetch grades.");
          }
        })
        .catch((error) => {
          setError("An error occurred while fetching grades.");
          console.error(error);
        })
}