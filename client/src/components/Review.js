import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ReviewSchema = Yup.object().shape({
  rating: Yup.number().required('Rating is required').min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  comments: Yup.string(),
});

const ReviewForm = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    // Handle form submission
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Submit Review</h2>
      <Formik
        initialValues={{ rating: '', comments: '' }}
        validationSchema={ReviewSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Rating:</label>
              <Field type="number" name="rating" />
              <ErrorMessage name="rating" component="div" />
            </div>
            <div>
              <label>Comments:</label>
              <Field as="textarea" name="comments" />
              <ErrorMessage name="comments" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Submit Review
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReviewForm;
