import courseStyles from "../styles/Subjects.module.scss";
import style from "../styles/department.module.scss";
import { SubjectData } from "../../../../models/types/SubjectData";
import { useSubjects } from "../../../../hooks/useSubjects";

interface Props {
  LoggeduserName: string | undefined;
  onStudentClick: (data: SubjectData[]) => void;
}

const Subjects: React.FC<Props> = ({ LoggeduserName, onStudentClick }) => {
  const { subjects, errorMessage } = useSubjects(LoggeduserName);

  const getClassForDept = (dept: string) => {
    switch (dept) {
      case "Gen":
        return style.gen;
      case "BSCS":
        return style.cs;
      case "BEED":
      case "BSED":
        return style.coed;
      case "BSHM":
        return style.hm;
      default:
        return "";
    }
  };

  return (
    <>
      <header>
        <h2>Subjects</h2>
      </header>
      <main className={courseStyles.mainSubjects}>
        {errorMessage ? (
          <p className={courseStyles.error}>{errorMessage}</p>
        ) : subjects.length === 0 ? (
          <p className={courseStyles.loading}>Loading subjects...</p>
        ) : (
          <div className={courseStyles.listSubjects}>
            <ul>
              {subjects.map((subject, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      onStudentClick([subject]);
                    }}
                  >
                    <div>
                      <div className={getClassForDept(subject.dept)}></div>
                      <div className={style.deptName}>
                        <h2>{subject.subjectCode}</h2>
                        <p>{subject.subjectName}</p>
                        <p>{`${subject.dept} - ${subject.section}`}</p>
                      </div>
                      <footer>
                        <p>First Semester A.Y. 2023 - 2024</p>
                      </footer>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
};

export default Subjects;
