import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Fade,
  Zoom,
  Alert,
  Switch,
} from "@mui/material";
import { Visibility, Delete, Search, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";

// --- Styles ---
// (Tous vos styles styled-components restent inchangés)
const Content = styled(Box)(({ theme, themeMode }) => ({
  flexGrow: 1,
  width: "calc(100% - 230px)",
  marginLeft: "230px",
  padding: theme.spacing(2, 3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: themeMode === "dark" ? "#2a1b3d" : "#f0f4f8",
  minHeight: "100vh",
  paddingTop: "80px",
  transition: "all 0.5s ease-in-out",
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    width: "100%",
  },
}));

const Header = styled(Box)(({ theme, themeMode }) => ({
  width: "100%",
  padding: theme.spacing(2, 3),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  background: themeMode === "dark" ? "#2a1b3d" : "#ffffff",
  borderRadius: theme.spacing(1.5),
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(2.5),
}));

const TitleContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const Title = styled(Typography)(({ theme, themeMode }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 800,
  fontSize: "2.2rem",
  color: themeMode === "dark" ? "#ffffff" : "#2a1b3d",
  transition: "transform 0.4s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.8rem",
  },
}));

const StudentCount = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.9rem",
  color: "#fff",
  background: "#6a4bff",
  padding: "6px 12px",
  borderRadius: "20px",
  boxShadow: "0 2px 6px rgba(90, 61, 255, 0.3)",
});

const SearchField = styled(TextField)(({ theme, themeMode }) => ({
  width: "300px",
  "& .MuiOutlinedInput-root": {
    background: themeMode === "dark" ? "#2a1b3d" : "#fff",
    borderRadius: "10px",
    "& fieldset": {
      borderColor: "#6a4bff",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "#8c5eff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6a4bff",
      boxShadow: "0 0 8px rgba(90, 61, 255, 0.4)",
    },
  },
  "& .MuiInputBase-input": {
    color: themeMode === "dark" ? "#fff" : "#333",
    fontSize: "1rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const AddButton = styled(Button)({
  background: "#6a4bff",
  color: "#fff",
  padding: "8px 20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(90, 61, 255, 0.4)",
  transition: "all 0.4s ease",
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "uppercase",
  "&:hover": {
    background: "#8c5eff",
    boxShadow: "0 6px 15px rgba(90, 61, 255, 0.6)",
    transform: "translateY(-2px)",
  },
});

const TableContainerStyled = styled(TableContainer)(({ theme, themeMode }) => ({
  width: "100%",
  background: themeMode === "dark" ? "#2a1b3d" : "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  marginTop: "15px",
}));

const TableHeader = styled(TableHead)(({ theme, themeMode }) => ({
  background: themeMode === "dark" ? "#35254a" : "#f5f7ff",
  "& th": {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    color: themeMode === "dark" ? "#fff" : "#2a1b3d",
    borderBottom: "2px solid #6a4bff",
    padding: "12px",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
}));

const TableRowStyled = styled(TableRow)(({ theme, themeMode }) => ({
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor:
      themeMode === "dark" ? "rgba(90, 61, 255, 0.2)" : "rgba(90, 61, 255, 0.1)",
    transform: "translateY(-2px)",
  },
  "& td": {
    padding: "12px",
    borderBottom: "1px solid rgba(90, 61, 255, 0.15)",
    fontSize: "0.9rem",
    fontFamily: "'Montserrat', sans-serif",
    color: themeMode === "dark" ? "#fff" : "#333",
  },
}));

const AvatarStyled = styled(Avatar)({
  width: 40,
  height: 40,
  border: "2px solid #6a4bff",
  borderRadius: "50%",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const Status = styled(Box)(({ theme }) => ({
  padding: "6px 12px",
  borderRadius: "10px",
  fontSize: "0.8rem",
  fontWeight: 600,
  fontFamily: "'Montserrat', sans-serif",
}));

const StatusActive = styled(Status)({ background: "#c6f0c2", color: "#1b5e20" });
const StatusInactive = styled(Status)({ background: "#e6e9ec", color: "#424242" });
const StatusBanned = styled(Status)({ background: "#ffd4d4", color: "#b71c1c" });
const StatusPending = styled(Status)({ background: "#fff3c4", color: "#f57f17" });

const ActionButtons = styled(Box)({
  display: "flex",
  gap: "10px",
});

const ViewButton = styled(IconButton)({
  color: "#6a4bff",
  "&:hover": {
    backgroundColor: "rgba(90, 61, 255, 0.1)",
  },
});

const DeleteButton = styled(IconButton)({
  color: "#ff3d3d",
  "&:hover": {
    backgroundColor: "rgba(255, 61, 61, 0.1)",
  },
});

const PaginationStyled = styled(Pagination)({
  marginTop: "20px",
  marginBottom: "20px",
  "& .MuiPaginationItem-root": {
    fontFamily: "'Montserrat', sans-serif",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(90, 61, 255, 0.2)",
    },
    "&.Mui-selected": {
      background: "#6a4bff",
      color: "#fff",
    },
  },
});

const ListContainer = styled(Box)(({ theme, themeMode }) => ({
  width: "100%",
  marginTop: "15px",
  background: themeMode === "dark" ? "#2a1b3d" : "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  padding: "15px",
}));

const TextFieldStyle = styled(TextField)(({ theme, themeMode }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: themeMode === "dark" ? "#2a1b3d" : "#fafafa",
    "& fieldset": {
      borderColor: "#6a4bff",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "#8c5eff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6a4bff",
      boxShadow: "0 0 8px rgba(90, 61, 255, 0.4)",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Montserrat', sans-serif",
    color: "#6a4bff",
    fontSize: "0.9rem",
  },
}));

const ProgressBar = styled(LinearProgress)({
  width: "100%",
  marginTop: "10px",
  "& .MuiLinearProgress-bar": {
    background: "#6a4bff",
  },
});

const GererElevePage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [themeMode, setThemeMode] = useState("light");
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [eleve, setEleve] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    dateNaissance: "",
    adresse: "",
    ville: "",
    telephone: "",
    email: "",
    password: "",
    photo: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  // Configuration des headers avec le token, enveloppée dans useCallback
  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirige si pas de token
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [navigate]); // Dépendance : navigate

  // Récupération des élèves avec Axios
  const fetchEleves = useCallback(async () => {
    setLoading(true);
    const config = getAuthConfig();
    if (!config) return;

    try {
      const response = await axios.get("/api/eleves", config);
      setUsers(
        response.data.map((eleve) => ({
          ...eleve,
          id: eleve._id, // S'assurer que l'ID correspond au champ _id de MongoDB
          name: `${eleve.nom} ${eleve.prenom}`,
          created: new Date(eleve.createdAt).toLocaleDateString(),
        }))
      );
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message || "Erreur lors de la récupération des élèves."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, getAuthConfig]);

  useEffect(() => {
    fetchEleves();
  }, [fetchEleves]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleDelete = useCallback(
    async (id) => {
      setLoading(true);
      const config = getAuthConfig();
      if (!config) return;

      try {
        await axios.delete(`/api/eleves/${id}`, config);
        await fetchEleves();
        setDeleteDialog({ open: false, id: null });
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            error.response?.data?.message || "Erreur lors de la suppression de l'élève."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchEleves, navigate, getAuthConfig]
  );

  const handleViewClick = useCallback((id) => navigate(`/eleve/${id}`), [navigate]);

  const handleSort = (field) => setSortBy(field);

  const filteredUsers = useMemo(() => {
    return users
      .filter(
        (user) =>
          (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filterStatus === "all" || user.status === filterStatus)
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "created") return new Date(a.created) - new Date(b.created);
        if (sortBy === "email") return a.email.localeCompare(b.email);
        return 0;
      });
  }, [users, searchTerm, filterStatus, sortBy]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * 5, page * 5);
  }, [filteredUsers, page]);

  const validateForm = () => {
    let tempErrors = {};
    if (!eleve.nom) tempErrors.nom = "Le nom est requis";
    if (!eleve.prenom) tempErrors.prenom = "Le prénom est requis";
    if (!eleve.sexe) tempErrors.sexe = "Le sexe est requis";
    if (!eleve.dateNaissance) {
      tempErrors.dateNaissance = "La date est requise";
    } else {
      const birthDate = new Date(eleve.dateNaissance);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (isNaN(birthDate.getTime()) || age < 5 || age > 100) {
        tempErrors.dateNaissance = "Date de naissance invalide";
      }
    }
    if (!eleve.adresse) tempErrors.adresse = "L'adresse est requise";
    if (!eleve.ville) tempErrors.ville = "La ville est requise";
    if (!eleve.telephone) tempErrors.telephone = "Le téléphone est requis";
    else if (!/^\+?[1-9]\d{1,14}$/.test(eleve.telephone))
      tempErrors.telephone = "Numéro invalide";
    if (!eleve.email) tempErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eleve.email))
      tempErrors.email = "Email invalide";
    if (!eleve.password) tempErrors.password = "Le mot de passe est requis";
    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEleve((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoChange = (e) => {
    setEleve((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const config = getAuthConfig();
      if (!config) return;

      try {
        const formData = new FormData();
        Object.keys(eleve).forEach((key) => formData.append(key, eleve[key]));
        await axios.post("/api/eleves", formData, {
          ...config,
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        });
        await fetchEleves();
        setOpenDialog(false);
        setEleve({
          nom: "",
          prenom: "",
          sexe: "",
          dateNaissance: "",
          adresse: "",
          ville: "",
          telephone: "",
          email: "",
          password: "",
          photo: null,
        });
        setFormErrors({});
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            error.response?.data?.message || "Erreur lors de l'enregistrement de l'élève."
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // JSX reste identique à votre version, sauf pour la clé dans TableRowStyled
  return (
    <ThemeProvider theme={theme}>
      <Content themeMode={themeMode}>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Fade in={!loading}>
          <Header themeMode={themeMode}>
            <TitleContainer>
              <Title themeMode={themeMode}>Gérer les Élèves</Title>
              <StudentCount>{filteredUsers.length} Élèves</StudentCount>
            </TitleContainer>
            <Box display="flex" alignItems="center" gap="10px" flexWrap="wrap">
              <AddButton
                variant="contained"
                onClick={() => setOpenDialog(true)}
                startIcon={<Add />}
              >
                Ajouter
              </AddButton>
              <SearchField
                variant="outlined"
                placeholder="Rechercher un élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#6a4bff" }} />
                    </InputAdornment>
                  ),
                }}
                themeMode={themeMode}
              />
              <Button
                variant="outlined"
                onClick={() => setViewMode(viewMode === "table" ? "list" : "table")}
                sx={{
                  borderColor: "#6a4bff",
                  color: "#6a4bff",
                  fontFamily: "'Montserrat', sans-serif",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  padding: "8px 16px",
                }}
              >
                {viewMode === "table" ? "Vue Liste" : "Vue Tableau"}
              </Button>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel
                  sx={{ fontFamily: "'Montserrat', sans-serif", color: "#6a4bff" }}
                >
                  Trier par
                </InputLabel>
                <Select
                  value={sortBy}
                  label="Trier par"
                  onChange={(e) => handleSort(e.target.value)}
                  themeMode={themeMode}
                >
                  <MenuItem value="name">Nom</MenuItem>
                  <MenuItem value="created">Date de création</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel
                  sx={{ fontFamily: "'Montserrat', sans-serif", color: "#6a4bff" }}
                >
                  Statut
                </InputLabel>
                <Select
                  value={filterStatus}
                  label="Statut"
                  onChange={(e) => setFilterStatus(e.target.value)}
                  themeMode={themeMode}
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                  <MenuItem value="pending">En attente</MenuItem>
                  <MenuItem value="banned">Banni</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" alignItems="center">
                <Typography
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: "#6a4bff",
                    fontSize: "0.9rem",
                  }}
                >
                  Mode Sombre
                </Typography>
                <Switch
                  checked={themeMode === "dark"}
                  onChange={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
                  color="primary"
                />
              </Box>
            </Box>
          </Header>
        </Fade>

        {loading && <ProgressBar />}

        {!loading && viewMode === "table" && (
          <Zoom in={!loading}>
            <TableContainerStyled component={Paper} themeMode={themeMode}>
              <Table>
                <TableHeader themeMode={themeMode}>
                  <TableRow>
                    <TableCell>Élève</TableCell>
                    <TableCell>Créé</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRowStyled key={user._id} themeMode={themeMode}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="10px">
                          <AvatarStyled
                            src={
                              user.photo
                                ? `data:${user.photo.contentType};base64,${user.photo.data}`
                                : `https://i.pravatar.cc/40?img=${user._id}`
                            }
                          />
                          <Box>
                            <Typography variant="body1">{user.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {user.role || "Élève"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.created}</TableCell>
                      <TableCell>
                        {user.status === "active" && <StatusActive>{user.status}</StatusActive>}
                        {user.status === "inactive" && (
                          <StatusInactive>{user.status}</StatusInactive>
                        )}
                        {user.status === "banned" && <StatusBanned>{user.status}</StatusBanned>}
                        {user.status === "pending" && (
                          <StatusPending>{user.status}</StatusPending>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <Tooltip title="Voir">
                            <ViewButton onClick={() => handleViewClick(user._id)}>
                              <Visibility />
                            </ViewButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <DeleteButton
                              onClick={() => setDeleteDialog({ open: true, id: user._id })}
                            >
                              <Delete />
                            </DeleteButton>
                          </Tooltip>
                        </ActionButtons>
                      </TableCell>
                    </TableRowStyled>
                  ))}
                </TableBody>
              </Table>
            </TableContainerStyled>
          </Zoom>
        )}

        {!loading && viewMode === "list" && (
          <Zoom in={!loading}>
            <ListContainer themeMode={themeMode}>
              <List>
                {paginatedUsers.map((user) => (
                  <ListItem
                    key={user._id}
                    sx={{
                      borderBottom: "1px solid rgba(90, 61, 255, 0.15)",
                      paddingY: "12px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          themeMode === "dark"
                            ? "rgba(90, 61, 255, 0.2)"
                            : "rgba(90, 61, 255, 0.1)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <AvatarStyled
                        src={
                          user.photo
                            ? `data:${user.photo.contentType};base64,${user.photo.data}`
                            : `https://i.pravatar.cc/40?img=${user._id}`
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 600,
                            color: themeMode === "dark" ? "#fff" : "#333",
                          }}
                        >
                          {user.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          {user.email} | Créé le: {user.created}
                        </Typography>
                      }
                    />
                    <Box display="flex" gap="15px" alignItems="center">
                      {user.status === "active" && <StatusActive>{user.status}</StatusActive>}
                      {user.status === "inactive" && (
                        <StatusInactive>{user.status}</StatusInactive>
                      )}
                      {user.status === "banned" && <StatusBanned>{user.status}</StatusBanned>}
                      {user.status === "pending" && (
                        <StatusPending>{user.status}</StatusPending>
                      )}
                      <ViewButton onClick={() => handleViewClick(user._id)}>
                        <Visibility />
                      </ViewButton>
                      <DeleteButton
                        onClick={() => setDeleteDialog({ open: true, id: user._id })}
                      >
                        <Delete />
                      </DeleteButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </ListContainer>
          </Zoom>
        )}

        <PaginationStyled
          count={Math.ceil(filteredUsers.length / 5)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
          <DialogTitle sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            Ajouter un Élève
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextFieldStyle
                    fullWidth
                    label="Nom"
                    name="nom"
                    value={eleve.nom}
                    onChange={handleChange}
                    required
                    error={!!formErrors.nom}
                    helperText={formErrors.nom}
                    themeMode={themeMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldStyle
                    fullWidth
                    label="Prénom"
                    name="prenom"
                    value={eleve.prenom}
                    onChange={handleChange}
                    required
                    error={!!formErrors.prenom}
                    helperText={formErrors.prenom}
                    themeMode={themeMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!formErrors.sexe}>
                    <InputLabel sx={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Sexe
                    </InputLabel>
                    <Select
                      name="sexe"
                      value={eleve.sexe}
                      label="Sexe"
                      onChange={handleChange}
                      themeMode={themeMode}
                    >
                      <MenuItem value="">Sélectionner</MenuItem>
                      <MenuItem value="Homme">Homme</MenuItem>
                      <MenuItem value="Femme">Femme</MenuItem>
                    </Select>
                    {formErrors.sexe && (
                      <Typography color="error" variant="caption">
                        {formErrors.sexe}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldStyle
                    fullWidth
                    label="Date de naissance"
                    name="dateNaissance"
                    type="date"
                    value={eleve.dateNaissance}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!!formErrors.dateNaissance}
                    helperText={formErrors.dateNaissance}
                    themeMode={themeMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldStyle
                    fullWidth
                    label="Téléphone"
                    name="telephone"
                    value={eleve.telephone}
                    onChange={handleChange}
                    required
                    error={!!formErrors.telephone}
                    helperText={formErrors.telephone}
                    themeMode={themeMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldStyle
                    fullWidth
                    label="Email"
                    name="email"
                    value={eleve.email}
                    onChange={handleChange}
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    themeMode={themeMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldStyle
                    fullWidth
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={eleve.password}
                    onChange={handleChange}
                    required
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    themeMode={themeMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldStyle
                    fullWidth
                    label="Ville"
                    name="ville"
                    value={eleve.ville}
                    onChange={handleChange}
                    required
                    error={!!formErrors.ville}
                    helperText={formErrors.ville}
                    themeMode={themeMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextFieldStyle
                    fullWidth
                    label="Adresse"
                    name="adresse"
                    value={eleve.adresse}
                    onChange={handleChange}
                    required
                    error={!!formErrors.adresse}
                    helperText={formErrors.adresse}
                    themeMode={themeMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextFieldStyle
                    fullWidth
                    type="file"
                    name="photo"
                    onChange={handlePhotoChange}
                    InputLabelProps={{ shrink: true }}
                    themeMode={themeMode}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ fontFamily: "'Montserrat', sans-serif", color: "#6a4bff" }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              sx={{
                ...AddButton.style,
                fontSize: "1rem",
                padding: "10px 20px",
              }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
        >
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <Typography>Êtes-vous sûr de vouloir supprimer cet élève ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
              Annuler
            </Button>
            <Button onClick={() => handleDelete(deleteDialog.id)} color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
    </ThemeProvider>
  );
};

export default GererElevePage;