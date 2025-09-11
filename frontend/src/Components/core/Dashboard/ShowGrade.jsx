import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CourseWiseGrades = () => {
  const [courses, setCourses] = useState([]);
  const [courseStudents, setCourseStudents] = useState({});
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/course/getallcourses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedCourses = response.data.data;
        setCourses(fetchedCourses);

        // Fetch students for each course after setting courses
        fetchedCourses.forEach(course => {
          fetchCourseStudents(course._id);
        });
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchCourseStudents = async (courseId) => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/course/${courseId}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const students = response.data; // Assuming the response structure
        const studentsWithGrades = await Promise.all(students.map(async (student) => {
          try {
            const gradeResponse = await axios.get(`http://localhost:4000/api/v1/grade/${student._id}/${courseId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return { ...student, grade: gradeResponse.data.grade };
          } catch (error) {
            console.error('Error fetching grade:', error);
            return { ...student, grade: 'N/A' };
          }
        }));

        setCourseStudents((prev) => ({
          ...prev,
          [courseId]: studentsWithGrades,
        }));
      } catch (error) {
        console.error('Error fetching students for course:', error);
      }
    };

    fetchCourses();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Course Wise Students and Grades</h2>
      {courses.map((course) => (
        <div key={course._id} className="mb-6">
          <h3 className="text-xl font-semibold text-white">{course.courseName}</h3>
          {courseStudents[course._id] ? (
            <table className="min-w-full bg-gray-900 text-white mt-2">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-700">Name</th>
                  <th className="py-2 px-4 border-b border-gray-700">Email</th>
                  <th className="py-2 px-4 border-b border-gray-700">Grade</th>
                </tr>
              </thead>
              <tbody>
                {courseStudents[course._id].map((student) => (
                  <tr key={student._id}>
                    <td className="py-2 px-4 border-b border-gray-700">{student.firstName} {student?.lastName}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{student.email}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{student.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-white">Loading students...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseWiseGrades;
