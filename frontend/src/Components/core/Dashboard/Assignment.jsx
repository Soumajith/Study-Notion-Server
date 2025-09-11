import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getInstructorDashboard } from '../../../services/operations/profileAPI';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import axios from 'axios';

Modal.setAppElement('#root'); // Set the root element for accessibility

const Assignment = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentName, setAssignmentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [file, setFile] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const instructorDetails = await getInstructorDashboard(token, dispatch);
        const instructorCourses = await fetchInstructorCourses(token);
        setCourses(instructorCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [token, dispatch]);

  useEffect(() => {
    if (selectedCourse) {
      const fetchAssignmentsWithSubmissions = async (courseId) => {
        try {
          const response = await axios.get(`http://localhost:4000/api/v1/assignments/getassignment/${courseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAssignments(response.data);
        } catch (error) {
          console.error('Error fetching assignments:', error);
        }
      };

      fetchAssignmentsWithSubmissions(selectedCourse);
    }
  }, [selectedCourse, token]);

  useEffect(() => {
    if (selectedAssignmentId) {
      const fetchAssignmentSubmissions = async (assignmentId) => {
        try {
          const response = await axios.get(`http://localhost:4000/api/v1/assignments/${assignmentId}/submissions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const updatedAssignments = assignments.map((assignment) =>
            assignment._id === assignmentId ? { ...assignment, submittedStudents: response.data } : assignment
          );
          setAssignments(updatedAssignments);
        } catch (error) {
          console.error('Error fetching assignment submissions:', error);
        }
      };

      fetchAssignmentSubmissions(selectedAssignmentId);
    }
  }, [selectedAssignmentId, token, assignments]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setFile(file);
    } else {
      alert('Please upload a PNG or JPEG image.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', assignmentName);
    formData.append('description', description);
    formData.append('course', selectedCourse);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:4000/api/v1/assignments/send', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Assignment uploaded successfully!');
        setAssignments(prev => [...prev, result.assignment]);
        setAssignmentName('');
        setDescription('');
        setSelectedCourse('');
        setFile(null);
      } else {
        alert('Failed to upload assignment: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading assignment:', error);
      alert('An error occurred while uploading the assignment.');
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedAssignmentId(null);
  };

  const handleShowSubmissions = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
  };

  const handleViewSubmission = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImageUrl('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-richblack-800 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Upload Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white">
            Name of the Assignment:
            <input
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              required
              className="mt-1 p-2 border rounded w-full bg-transparent"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-white">
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 p-2 border rounded w-full bg-transparent text-white"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-white">
            Course:
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
        <div className="mb-4">
          <label className="block text-white">
            Upload File (PNG/JPEG):
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {assignments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 text-white">Assignments List</h3>
          <ul className="list-disc list-inside text-white">
            {assignments.map((assignment) => (
              <li key={assignment._id}>
                <strong>{assignment.name}</strong> - {assignment.description} (Course: {courses.find(course => course._id === assignment.course)?.courseName})
                <img src={assignment.fileUrl} alt={assignment.name} />
                <button
                  onClick={() => handleShowSubmissions(assignment._id)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-700 mt-2"
                >
                  Show Submissions
                </button>
                {assignment._id === selectedAssignmentId && assignment.submittedStudents && (
                  <div>
                    <h4 className="text-lg font-bold text-white">Submitted By:</h4>
                    <ul>
                      {assignment.submittedStudents.map((student) => (
                        <li key={student._id} className="text-white">
                          {student.firstName} ({student.email})
                          <button onClick={() => handleViewSubmission(student.fileUrl)} className="ml-2 text-blue-500 underline">
                            View
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="View Submission"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl mb-4">Submission</h2>
        <img src={modalImageUrl} alt="Submission" className="w-full h-auto" />
        <button onClick={closeModal} className="mt-4 bg-red-500 text-white p-2 rounded">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Assignment;
