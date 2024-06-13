// src/components/AppointmentForm.js

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BiColor } from 'react-icons/bi';
import { Navigate, useNavigate } from 'react-router-dom';

const AppointmentForm = () => {
  const [barbers, setBarbers] = useState([]);
  const navigate = useNavigate()
  
  useEffect(() => {
    fetch('/api/barbers')
      .then(response => response.json())
      .then(data => setBarbers(data))
      .catch(error => console.error('Error fetching barbers:', error));
  }, []);
  
  const initialValues = {
    date: '',
    time: '',
    barberId: ''
  };

  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    time: Yup.string().required('Time is required'),
    barberId: Yup.string().required('Barber is required')
  });

  const onSubmit = (values, { setSubmitting }) => {
    fetch('/api/my_appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    .then(response => {
      if (response.ok) {
        navigate('/appointments')
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Appointment created:', data);
    })
    .catch(error => {
      console.error('Error creating appointment:', error);
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={onSubmit}
>
  {({ isSubmitting }) => (
    <Form className="flex flex-col items-center bg-white shadow-md p-8 rounded w-full max-w-md mx-auto">
      <div className="w-full mb-4">
        <label htmlFor="date" className="mb-2 text-gray-700">Date</label>
        <Field 
          as="select" 
          name="date" 
          className="mb-1 p-2 border border-gray-300 rounded w-full"
        >
          <option value="" label="Select date" />
          <option value="2024-06-14" label="June 14, 2024" />
          <option value="2024-06-15" label="June 15, 2024" />
        </Field>
        <ErrorMessage name="date" component="div" className="text-red-500" />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="time" className="mb-2 text-gray-700">Time</label>
        <Field 
          as="select" 
          name="time" 
          className="mb-1 p-2 border border-gray-300 rounded w-full"
        >
          <option value="" label="Select time" />
          <option value="09:00" label="09:00 AM" />
          <option value="10:00" label="10:00 AM" />
        </Field>
        <ErrorMessage name="time" component="div" className="text-red-500" />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="barberId" className="mb-2 text-gray-700">Barber</label>
        <Field 
          as="select" 
          name="barberId" 
          className="mb-1 p-2 border border-gray-300 rounded w-full"
        >
          <option value="" label="Select barber" />
          {barbers.map(barber => (
            <option key={barber.id} value={barber.id} label={barber.name} />
          ))}
        </Field>
        <ErrorMessage name="barberId" component="div" className="text-red-500" />
      </div>

      <div className="w-full">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600 transition duration-200"
        >
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
      </div>
    </Form>
  )}
</Formik>

  );
};

export default AppointmentForm;
