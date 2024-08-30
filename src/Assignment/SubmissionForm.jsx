/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const SubmissionForm = ({ onSubmit }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!url.trim()) {
            setError('Submission URL is required');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            // Pass only the URL string to the onSubmit function
            await onSubmit(url);
            setUrl(''); // Clear the form
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="url"
                        name="url"
                        label="Submission URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        error={Boolean(error)}
                        helperText={error}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        color="primary" 
                        variant="contained" 
                        fullWidth 
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default SubmissionForm;