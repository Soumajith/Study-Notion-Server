import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserCourses } from '../../../services/operations/profileAPI';
import { submitCourseFeedback } from '../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import './modal.css';

const FeedbackForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const[userid, setUser] = useState(null);
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userCourses = await getUserCourses(token, dispatch);
        setCourses(userCourses.courses);
        setUser(userCourses._id)
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [token, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const feedbackData = {
      studentId:userid,
      courseId: selectedCourse,
      rating,
      comments,
    };

    try {
      await submitCourseFeedback(feedbackData, token);
      toast.success('Feedback submitted successfully!');
      setSelectedCourse('');
      setRating('');
      setComments('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-richblack-800 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white">
            Select Course:
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
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
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="mt-1 p-2 border rounded w-full bg-transparent text-white"
            >
              <option value="">Select a rating</option>
              <option value="1">1 - Very Poor</option>
              <option value="2">2 - Poor</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-white">
            Comments:
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              className="mt-1 p-2 border rounded w-full bg-transparent text-white"
              rows="4"
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mt-2"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
