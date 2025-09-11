import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCourseAssignments, submitAssignmentSolution } from '../../../services/operations/courseDetailsAPI';
import { getUserCourses } from '../../../services/operations/profileAPI';
import toast from 'react-hot-toast';
import './modal.css';
const SubmitAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentId, setStudentId] = useState('');
  const [file, setFile] = useState(null);
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userCourses = await getUserCourses(token, dispatch);
        setCourses(userCourses.courses);
        setStudentId(userCourses._id);
        console.log(courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [token]);

  const handleCourseSelect = async (courseId) => {
    try {
      const courseAssignments = await getCourseAssignments(courseId, studentId, token);
      setAssignments(courseAssignments);
      setSelectedCourse(courseId);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (event, assignmentId) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await submitAssignmentSolution(assignmentId, studentId, formData, token);
      toast.success('Assignment solution submitted successfully!');
      setFile(null);
    } catch (error) {
      console.error('Error submitting assignment solution:', error);
      toast.error('Failed to submit assignment solution.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-richblack-800 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Submit Assignment</h2>
      <div className="mb-4">
        <label className="block text-white">
          Select Course:
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseSelect(e.target.value)}
            required
            className="mt-1 p-2 border rounded w-full bg-transparent text-white"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </label>
      </div>
      {assignments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 text-white">Assignments List</h3>
          <ul className="list-disc list-inside text-white">
            {assignments.map((assignment) => (
              <li key={assignment._id}>
                <strong>{assignment.name}</strong> - {assignment.description}
                <img src={assignment.fileUrl} alt={assignment.name} />
                <form onSubmit={(e) => handleSubmit(e, assignment._id)} className="mt-2">
                  <label className="block text-white">
                    Upload Solution:
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      required
                      className="mt-1 p-2 border rounded w-full"
                    />
                  </label>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mt-2"
                    disabled={assignment.completed === 'completed'}
                  >
                    {assignment.completed === 'completed' ? 'Submitted' : 'Submit'}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubmitAssignment;
