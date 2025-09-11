import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserCourses as getUserEnrolledCourses, getCourseGrade } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router';

const EnrolledCourses = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const[userId, setUser]= useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState(undefined);
    const [progressData, setProgressData] = useState(undefined);
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getEnrolledCourses = async () => {
        setLoading(true);
        const response = await getUserEnrolledCourses(token, dispatch);
        setEnrolledCourses(response?.courses);
        setProgressData(response?.courseProgress);
        setUser(response?._id);
        setLoading(false);
    };

    const fetchGrades = async (courses) => {
        const gradesData = {};
        for (const course of courses) {
            const gradeResponse = await getCourseGrade(token, userId, course._id, dispatch);
            gradesData[course._id] = gradeResponse?.grade;
        }
        setGrades(gradesData);
    };

    const totalNoOfLectures = (course) => {
        let total = 0;
        course.courseContent.forEach((section) => {
            total += section.subSection.length;
        });
        return total;
    };

    useEffect(() => {
        const fetchData = async () => {
            await getEnrolledCourses();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (enrolledCourses) {
            fetchGrades(enrolledCourses);
        }
    }, [enrolledCourses]);

    if (loading) {
        return (
            <div className='flex h-[calc(100vh)] w-full justify-center items-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-richblack-500'></div>
            </div>
        );
    }

    return (
        <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
            <div className='text-3xl text-richblack-50'>Enrolled Courses</div>
            {
                !enrolledCourses ? (
                    <div>Loading...</div>
                ) : !enrolledCourses.length ? (
                    <p className='grid h-[10vh] w-full place-content-center text-richblack-5'>
                        You have not enrolled in any course yet
                    </p>
                ) : (
                    <div className='my-8 text-richblack-5'>
                        <div className='flex rounded-t-lg bg-richblack-500'>
                            <p className='w-[35%] px-5 py-3'>Course Name</p>
                            <p className='w-[15%] px-2 py-3'>Grade</p>
                            <p className='w-[15%] px-2 py-3'>Total Duration</p>
                            <p className='flex-1 px-2 py-3'>Progress</p>
                        </div>
                        {
                            enrolledCourses.map((course, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        navigate(`view-course/${course._id}/section/${course.courseContent[0]._id}/sub-section/${course.courseContent[0].subSection[0]}`);
                                    }}
                                    className='flex items-center border border-richblack-700 rounded-none'
                                >
                                    <div className='flex w-[35%] cursor-pointer items-center gap-4 px-5 py-3'>
                                        <img className='h-14 w-14 rounded-lg object-cover' src={course.thumbnail} />
                                        <div className='flex max-w-xs flex-col gap-2'>
                                            <p className='font-semibold'>{course.courseName}</p>
                                            <p className='text-xs text-richblack-300 hidden md:block'>
                                                {course.courseDescription.length > 50
                                                    ? course.courseDescription.slice(0, 50) + '....'
                                                    : course.courseDescription}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='w-[15%] px-2 py-3'>
                                        {grades[course._id] !== undefined ? grades[course._id] : 'N/A'}
                                    </div>
                                    <div className='w-[15%] px-2 py-3'>
                                        {course.totalDuration}
                                    </div>
                                    <div className='flex w-[35%] flex-col gap-2 px-2 py-3'>
                                        {
                                            progressData?.map((progress, index) => {
                                                if (progress?.courseID === course?._id) {
                                                    return (
                                                        <div key={index}>
                                                            <p>Completed: {progress?.completedVideos?.length} / {totalNoOfLectures(course)}</p>
                                                            <ProgressBar
                                                                completed={progress?.completedVideos?.length / totalNoOfLectures(course) * 100}
                                                                total={progress?.total}
                                                                height='8px'
                                                                isLabelVisible={false}
                                                            />
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default EnrolledCourses;
