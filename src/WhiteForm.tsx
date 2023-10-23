import {ChangeEvent, useState} from "react";
import {Button, Grid, TextField, Container, Card, CardContent, Typography} from "@mui/material";
import axios from "axios";
import {ArrowForwardIos} from "@mui/icons-material";


interface FieldConfig {
    name: string;
    label: string;
    type?: string;
    defaultValue?: string | number;
}

interface WhiteFormProps {
    fieldSteps: FieldConfig[][];
    endpoint: string;
}

const WhiteForm: React.FC<WhiteFormProps> = ({fieldSteps, endpoint}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const isLastStep = currentStep === fieldSteps.length - 1;

    const initialState = fieldSteps.flat().reduce<Record<string, string | number>>(
        (acc, field) => ({
            ...acc,
            [field.name]: field.defaultValue || ""
        }),
        {}
    );

    const [formState, setFormState] = useState(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = () => {
        if (isLastStep) {
            // Submit form data
            axios.post(endpoint, formState).then(() => {
                // Handle successful submission
            }).catch(() => {
                // Handle submission error
            });
        } else {
            // Navigate to next step
            setCurrentStep(prevStep => prevStep + 1);
        }
    };

    return (
        <Container maxWidth="sm" style={{marginTop: "2rem"}}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Step {currentStep + 1}
                    </Typography>
                    <br/>
                    <Grid container spacing={3} direction="column">
                        {fieldSteps[currentStep].map(field => (
                            <Grid key={field.name} item xs={12}>
                                <TextField
                                    fullWidth
                                    name={field.name}
                                    label={field.label}
                                    type={field.type || "text"}
                                    variant="outlined"
                                    value={formState[field.name]}
                                    onChange={handleChange}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowForwardIos/>}
                                onClick={handleNext}
                            >
                                {isLastStep ? "Submit" : "Next"}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default WhiteForm;

