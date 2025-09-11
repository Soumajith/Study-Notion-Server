import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import axios from 'axios';

const AdminPannel = () => {
  const { token } = useSelector((state) => state.auth);
  const [category, setCategory] = useState({
    name: '',
    description: ''
  });
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [courseId, setCourseId] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchCourses();
    await fetchStudents();
    await fetchInstructors();
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/course/getallcourses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data.data);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/admin/instructors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstructors(res.data);
    } catch (error) {
      console.error('Failed to fetch instructors', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name || !category.description) {
      return;
    }
    try {
      const res = await axios.post('http://localhost:4000/api/v1/admin/categories', {
        name: category.name,
        description: category.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
    } catch (error) {
      console.error('Failed to create category', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/course/delete/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course', error);
    }
  };
  const handleEnrollStudent = async () => {
    try {
        const res = await axios.post(`http://localhost:4000/api/v1/course/${courseId}/enroll`, {
            studentEmail: studentEmail
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
    } catch (error) {
        console.error('Failed to enroll student', error);
    }
};


  const handleDeEnrollStudent = async () => {
    try {
        const res = await axios.delete('http://localhost:4000/api/v1/admin/user', {
            data: { email: studentEmail },
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        fetchStudents();
    } catch (error) {
        console.error('Failed to de-enroll student', error);
    }
};

const handleRemoveInstructor = async () => {
    try {
        const res = await axios.delete('http://localhost:4000/api/v1/admin/user', {
            data: { email: instructorEmail },
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        fetchInstructors();
    } catch (error) {
        console.error('Failed to remove instructor', error);
    }
};

  return (
    <div className='text-pure-greys-50 text-xl p-5'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <label htmlFor="category">Category Name</label>
          <input
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            type="text"
            name="category"
            id="category"
            className="form-style"
            placeholder='Enter category name'
          />
        </div>
        <div className='flex flex-col gap-2 mt-10'>
          <label htmlFor="category">Category Description</label>
          <textarea
            value={category.description}
            onChange={(e) => setCategory({ ...category, description: e.target.value })}
            name="category"
            id="category"
            className="form-style"
            placeholder='Enter category description'
          />
        </div>
        <button
          type="submit"
          className="mt-10 rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none disabled:bg-richblack-500 sm:text-[16px]"
        >
          Create
        </button>
      </form>

      {/* View and Delete Courses */}
      <div className='mt-10'>
        <h2>Courses</h2>
        <Table className='w-full mt-5'>
          <Thead>
            <Tr>
            <Th className='border bg-blue-500 px-4 py-2'>Course Id</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Course Name</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Instructor Name</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Course Price</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Status</Th>
              <Th className='border bg-blue-500  px-4 py-2'>Ratings</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {courses?.map(course => (
              <Tr key={course._id}>
                <Td className='border px-4 py-2'>{course._id}</Td>
                <Td className='border px-4 py-2'>{course.courseName}</Td>
                <Td className='border px-4 py-2'>{course.instructor.firstName}</Td>
                <Td className='border px-4 py-2'>₹{course.price}</Td>
                <Td className='border px-4 py-2'>{course.approved ? 'Approved' : 'Draft'}</Td>
                <Td className='border px-4 py-2'>{course.ratingAndReviews?.length > 0 ? course.ratingAndReviews.reduce((acc, review) => acc + review.rating, 0) / course.ratingAndReviews.length : '5'}</Td>
                <Td className='border px-4 py-2'>
                  <button onClick={() => handleDeleteCourse(course._id)}>Delete</button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {/* View Student Details */}
      <div className='mt-10'>
        <h2>Students</h2>
        <Table className='w-full mt-5'>
          <Thead>
            <Tr>
              <Th className='border bg-blue-500 px-4 py-2'>Name</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Email</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Active</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Course Progress</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students?.map(student => (
              <Tr key={student._id}>
                <Td className='border px-4 py-2'>{student.firstName} {student?.lastName}</Td>
                <Td className='border px-4 py-2'>{student.email}</Td>
                <Td className='border px-4 py-2'>{student.active ? 'Active' : 'Inactive'}</Td>
                <Td className='border px-4 py-2'>{student.courseProgress.length > 0 ? `${student.courseProgress.length} courses` : 'No courses'}</Td>
                <Td className='border px-4 py-2'>
                  <button onClick={() => handleDeEnrollStudent(student.email)}>Delete</button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {/* Enroll and De-enroll Students */}
      <div className='mt-10'>
        <h2>Enroll Students</h2>
        <div className='flex gap-2'>
          <input
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            type="text"
            placeholder='Student Email'
            className='form-style'
          />
          <input
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            type="text"
            placeholder='Course ID'
            className='form-style'
          />
          <button onClick={handleEnrollStudent} className='bg-yellow-50 px-4 py-2 text-base text-black font-bold rounded'>Enroll</button>
     </div>
      </div>

      

      {/* View Instructor Details */}
      <div className='mt-10'>
        <h2>Instructors</h2>
        <Table className='w-full mt-5'>
          <Thead>
            <Tr>
              <Th className='border bg-blue-500 px-4 py-2'>Name</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Email</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Active</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Courses Published</Th>
              <Th className='border bg-blue-500 px-4 py-2'>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {instructors?.map(instructor => (
              <Tr key={instructor._id}>
                <Td className='border px-4 py-2'>{instructor?.firstName} {instructor?.lastName}</Td>
                <Td className='border px-4 py-2'>{instructor?.email}</Td>
                <Td className='border px-4 py-2'>{instructor.active ? 'Active' : 'Inactive'}</Td>
                <Td className='border px-4 py-2'>{instructor.courses?.length || 0}</Td>
                <Td className='border px-4 py-2'>
                  <button onClick={() => handleRemoveInstructor(instructor.email)}>Delete</button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPannel;
