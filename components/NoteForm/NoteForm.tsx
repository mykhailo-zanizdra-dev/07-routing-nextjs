import { useId } from 'react';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteForm.module.css';
import type { NoteTag } from '../../types/note';
import { createNote } from '@/lib/api';
import QUERY_KEYS from '../../const/queryKeys';

interface NoteFormProps {
  handleClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .required('Name is required'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.string()
    .oneOf<NoteTag>(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Tag is invalid'
    )
    .required('Tag is required'),
});

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

function NoteForm({ handleClose }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const { mutate: createNoteRequest, isPending: isCreatingNote } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note created successfully');
      handleClose();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTES] });
    },
    onError: () => {
      toast.error('There was an error creating the note');
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    createNoteRequest(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            type="text"
            id={`${fieldId}-title`}
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            onClick={handleClose}
            type="button"
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isCreatingNote}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default NoteForm;
