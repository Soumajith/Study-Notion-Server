import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllCourses, getFeedbackForCourse } from '../../../services/operations/courseDetailsAPI';
import './modal.css'; // Make sure to adjust the path if needed

const FetchFeedback = () => {
    const [courses, setCourses] = useState([]);
    const [feedbacks, setFeedbacks] = useState({});
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchCoursesAndFeedbacks = async () => {
            try {
                // Fetch all courses
                const courseResponse = await getAllCourses(token);
                setCourses(courseResponse);

                // Fetch feedback for each course
                const feedbackPromises = courseResponse?.map(async (course) => {
                    const feedbackResponse = await getFeedbackForCourse(course._id, token);
                    return { courseId: course._id, feedbacks: feedbackResponse.feedbacks };
                });

                const feedbackResults = await Promise.all(feedbackPromises);

                // Map feedback results into an object with courseId as key
                const feedbackMap = feedbackResults.reduce((acc, { courseId, feedbacks }) => {
                    acc[courseId] = feedbacks;
                    return acc;
                }, {});

                setFeedbacks(feedbackMap);
            } catch (error) {
                console.error('Error fetching courses or feedback:', error);
            }
        };

        fetchCoursesAndFeedbacks();
    }, [token]);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-richblack-800 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Course Feedback</h2>
            {courses?.length === 0 ? (
                <p className="text-white">No courses available.</p>
            ) : (
                courses.map((course) => (
                    <div key={course._id} className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{course.courseName}</h3>
                        <div className="bg-richblack-700 p-4 rounded">
                            {feedbacks[course._id]?.length === 0 ? (
                                <p className="text-white">No feedback yet.</p>
                            ) : (
                                feedbacks[course._id]?.map((feedback) => (
                                    <div key={feedback._id} className="mb-4 border-b border-richblack-600 pb-4">
                                        <p className="text-white font-medium">{feedback.studentId.firstName} {feedback.studentId
                    ?.lastName}</p>
                                        <p className="text-white">Rating: {feedback.rating} / 5</p>
                                        <p className="text-white mt-1">Comments: {feedback.comments}</p>
                                        <p className="text-sm text-richblack-300 mt-1">Date: {new Date(feedback.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FetchFeedback;
