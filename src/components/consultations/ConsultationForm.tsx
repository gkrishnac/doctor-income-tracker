  deductibles: {
    id: string;
    amount: number;
  }[];
}

const ConsultationForm: React.FC = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const [establishments, setEstablishments] = useState([]);
  const [deductibles, setDeductibles] = useState([]);
  const [formData, setFormData] = useState<ConsultationData>({
    patientId: patientId || '',
    establishmentId: '',
    appointmentDate: new Date(),
    billAmount: 0,
    notes: '',
    deductibles: [],
  });

  useEffect(() => {
    fetchEstablishments();
    fetchDeductibles();
  }, []);

  // Fetch functions and handlers here...

  const calculateFinalAmount = () => {
    // Implementation of the calculation logic based on establishment share
    // and deductibles (both pre-share and post-share)
  };

  return (
    <Paper className="consultation-form">
      <Typography variant="h6">New Consultation</Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Form fields here */}
        </Grid>
      </form>
    </Paper>
  );
};
