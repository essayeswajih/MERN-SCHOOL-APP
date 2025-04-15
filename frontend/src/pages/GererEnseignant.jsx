import React, { useState, useEffect, useCallback } from "react";
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

// Styles alignés avec GererElevePage
const styles = {
  content: (themeMode) => ({
    flexGrow: 1,
    width: "calc(100% - 230px)",
    marginLeft: "230px",
    padding: "20px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: themeMode === "dark" ? "#2a1b3d" : "#f0f4f8",
    minHeight: "100vh",
    pt: "80px",
    transition: "all 0.5s ease-in-out",
  }),
  header: (themeMode) => ({
    width: "100%",
    padding: { xs: "15px", md: "20px 30px" },
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    background: themeMode === "dark" ? "#2a1b3d" : "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    mb: "20px",
  }),
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  title: (themeMode) => ({
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 800,
    fontSize: { xs: "1.8rem", md: "2.2rem" },
    color: themeMode === "dark" ? "#ffffff" : "#2a1b3d",
    transition: "transform 0.4s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }),
  teacherCount: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.9rem",
    color: "#fff",
    background: "#6a4bff",
    padding: "6px 12px",
    borderRadius: "20px",
    boxShadow: "0 2px 6px rgba(90, 61, 255, 0.3)",
  },
  searchField: (themeMode) => ({
    width: { xs: "100%", sm: "250px", md: "300px" },
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
  }),
  addButton: {
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
  },
  tableContainer: (themeMode) => ({
    width: "100%",
    background: themeMode === "dark" ? "#2a1b3d" : "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    mt: "15px",
  }),
  tableHeader: (themeMode) => ({
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
  }),
  tableRow: (themeMode) => ({
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
  }),
  avatar: {
    width: 40,
    height: 40,
    border: "2px solid #6a4bff",
    borderRadius: "50%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  actionButtons: { display: "flex", gap: "10px" },
  viewButton: {
    color: "#6a4bff",
    "&:hover": {
      backgroundColor: "rgba(90, 61, 255, 0.1)",
    },
  },
  deleteButton: {
    color: "#ff3d3d",
    "&:hover": {
      backgroundColor: "rgba(255, 61, 61, 0.1)",
    },
  },
  pagination: {
    mt: "20px",
    mb: "20px",
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
  },
  listContainer: (themeMode) => ({
    width: "100%",
    mt: "15px",
    background: themeMode === "dark" ? "#2a1b3d" : "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    p: "15px",
  }),
  textFieldStyle: (themeMode) => ({
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
  }),
  progressBar: {
    width: "100%",
    mt: "10px",
    "& .MuiLinearProgress-bar": {
      background: "#6a4bff",
    },
  },
};

const GererEnseignantPage = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [themeMode, setThemeMode] = useState("light");
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [enseignant, setEnseignant] = useState({
    nom: "",
    prenom: "",
    matiere: "",
    dateEmbauche: "",
    email: "",
    password: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});

  // Données initiales des enseignants (sans le champ status)
  useEffect(() => {
    const initialEnseignants = [
      {
        id: "1",
        nom: "Durand",
        prenom: "Paul",
        matiere: "Mathématiques",
        dateEmbauche: "2010-09-01",
        email: "paul.durand@example.com",
        created: "01/09/2010",
        role: "Enseignant",
        photo: "https://i.pravatar.cc/40?img=1",
      },
      {
        id: "2",
        nom: "Leclerc",
        prenom: "Sophie",
        matiere: "Physique",
        dateEmbauche: "2015-02-10",
        email: "sophie.leclerc@example.com",
        created: "10/02/2015",
        role: "Enseignant",
        photo: "https://i.pravatar.cc/40?img=2",
      },
    ];
    setEnseignants(
      initialEnseignants.map((ens) => ({
        ...ens,
        name: `${ens.nom} ${ens.prenom}`,
      }))
    );
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleDelete = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/enseignants/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setEnseignants((prev) => prev.filter((ens) => ens.id !== id));
        setDeleteDialog({ open: false, id: null });
      } else {
        setError("Erreur lors de la suppression de l'enseignant.");
      }
    } catch (error) {
      setError("Erreur réseau lors de la suppression.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleViewClick = useCallback(
    (id) => navigate(`/enseignant/${id}`),
    [navigate]
  );

  const handleSort = (field) => setSortBy(field);

  // Filtrage sans le statut
  const filteredEnseignants = enseignants
    .filter(
      (ens) =>
        ens.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ens.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ens.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "created") return new Date(a.created) - new Date(b.created);
      if (sortBy === "email") return a.email.localeCompare(b.email);
      return 0;
    });

  const paginatedEnseignants = filteredEnseignants.slice((page - 1) * 5, page * 5);

  const validateForm = () => {
    let tempErrors = {};
    if (!enseignant.nom) tempErrors.nom = "Le nom est requis";
    if (!enseignant.prenom) tempErrors.prenom = "Le prénom est requis";
    if (!enseignant.matiere) tempErrors.matiere = "La matière est requise";
    if (!enseignant.dateEmbauche) tempErrors.dateEmbauche = "La date est requise";
    if (!enseignant.email) tempErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enseignant.email))
      tempErrors.email = "Email invalide";
    if (!enseignant.password) tempErrors.password = "Le mot de passe est requis";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnseignant((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoChange = (e) => {
    setEnseignant((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const formData = new FormData();
      Object.keys(enseignant).forEach((key) => formData.append(key, enseignant[key]));
      try {
        const response = await fetch("http://localhost:5000/enseignants", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const newEnseignant = await response.json();
          setEnseignants((prev) => [
            ...prev,
            {
              ...newEnseignant,
              id: newEnseignant._id,
              name: `${newEnseignant.nom} ${newEnseignant.prenom}`,
              role: "Enseignant",
              created: new Date(newEnseignant.createdAt).toLocaleDateString(),
              email: newEnseignant.email,
              matiere: newEnseignant.matiere,
              dateEmbauche: newEnseignant.dateEmbauche,
            },
          ]);
          setOpenDialog(false);
          setEnseignant({
            nom: "",
            prenom: "",
            matiere: "",
            dateEmbauche: "",
            email: "",
            password: "",
            photo: null,
          });
          setErrors({});
        } else {
          setError("Erreur lors de l'enregistrement de l'enseignant.");
        }
      } catch (error) {
        setError("Erreur réseau lors de l'enregistrement.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={styles.content(themeMode)} aria-label="Gestion des enseignants">
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Fade in={!loading}>
        <Box sx={styles.header(themeMode)}>
          <Box sx={styles.titleContainer}>
            <Typography variant="h4" sx={styles.title(themeMode)} aria-label="Titre de la page">
              Gérer les Enseignants
            </Typography>
            <Typography variant="body2" sx={styles.teacherCount}>
              {filteredEnseignants.length} Enseignants
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="10px" flexWrap="wrap">
            <Button
              variant="contained"
              sx={styles.addButton}
              onClick={() => setOpenDialog(true)}
              startIcon={<Add />}
              aria-label="Ajouter un nouvel enseignant"
            >
              Ajouter
            </Button>
            <TextField
              sx={styles.searchField(themeMode)}
              variant="outlined"
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#6a4bff" }} />
                  </InputAdornment>
                ),
              }}
              aria-label="Champ de recherche"
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
              <InputLabel sx={{ fontFamily: "'Montserrat', sans-serif", color: "#6a4bff" }}>
                Trier par
              </InputLabel>
              <Select
                value={sortBy}
                label="Trier par"
                onChange={(e) => handleSort(e.target.value)}
                sx={styles.textFieldStyle(themeMode)}
              >
                <MenuItem value="name">Nom</MenuItem>
                <MenuItem value="created">Date de création</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" alignItems="center">
              <Typography sx={{ fontFamily: "'Montserrat', sans-serif", color: "#6a4bff", fontSize: "0.9rem" }}>
                Mode Sombre
              </Typography>
              <Switch
                checked={themeMode === "dark"}
                onChange={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
                color="primary"
              />
            </Box>
          </Box>
        </Box>
      </Fade>

      {loading && <LinearProgress sx={styles.progressBar} />}

      {!loading && viewMode === "table" && (
        <Zoom in={!loading}>
          <TableContainer component={Paper} sx={styles.tableContainer(themeMode)}>
            <Table aria-label="Tableau des enseignants">
              <TableHead sx={styles.tableHeader(themeMode)}>
                <TableRow>
                  <TableCell>Enseignant</TableCell>
                  <TableCell>Matière</TableCell>
                  <TableCell>Date d'embauche</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEnseignants.map((ens) => (
                  <TableRow key={ens.id} sx={styles.tableRow(themeMode)} aria-label={`Ligne pour ${ens.nom} ${ens.prenom}`}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap="10px">
                        <Avatar
                          sx={styles.avatar}
                          src={ens.photo}
                          alt={`${ens.nom} ${ens.prenom}'s avatar`}
                        />
                        <Box>
                          <Typography variant="body1">{ens.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {ens.role}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{ens.matiere}</TableCell>
                    <TableCell>{ens.dateEmbauche}</TableCell>
                    <TableCell>{ens.email}</TableCell>
                    <TableCell>
                      <Box sx={styles.actionButtons}>
                        <Tooltip title="Voir">
                          <IconButton
                            sx={styles.viewButton}
                            onClick={() => handleViewClick(ens.id)}
                            aria-label={`Voir les détails de ${ens.nom} ${ens.prenom}`}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            sx={styles.deleteButton}
                            onClick={() => setDeleteDialog({ open: true, id: ens.id })}
                            aria-label={`Supprimer ${ens.nom} ${ens.prenom}`}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Zoom>
      )}

      {!loading && viewMode === "list" && (
        <Zoom in={!loading}>
          <Box sx={styles.listContainer(themeMode)}>
            <List>
              {paginatedEnseignants.map((ens) => (
                <ListItem
                  key={ens.id}
                  sx={{
                    borderBottom: "1px solid rgba(90, 61, 255, 0.15)",
                    py: "12px",
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
                    <Avatar
                      sx={styles.avatar}
                      src={ens.photo}
                      alt={`${ens.nom} ${ens.prenom}'s avatar`}
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
                        {ens.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {ens.email} | Matière: {ens.matiere} | Date d'embauche: {ens.dateEmbauche}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <IconButton
                      sx={styles.viewButton}
                      onClick={() => handleViewClick(ens.id)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      sx={styles.deleteButton}
                      onClick={() => setDeleteDialog({ open: true, id: ens.id })}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Zoom>
      )}

      <Pagination
        sx={styles.pagination}
        count={Math.ceil(filteredEnseignants.length / 5)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        aria-label="Pagination des enseignants"
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
          Ajouter un Enseignant
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  value={enseignant.nom}
                  onChange={handleChange}
                  required
                  error={!!errors.nom}
                  helperText={errors.nom}
                  sx={styles.textFieldStyle(themeMode)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  name="prenom"
                  value={enseignant.prenom}
                  onChange={handleChange}
                  required
                  error={!!errors.prenom}
                  helperText={errors.prenom}
                  sx={styles.textFieldStyle(themeMode)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Matière"
                  name="matiere"
                  value={enseignant.matiere}
                  onChange={handleChange}
                  required
                  error={!!errors.matiere}
                  helperText={errors.matiere}
                  sx={styles.textFieldStyle(themeMode)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date d'embauche"
                  name="dateEmbauche"
                  type="date"
                  value={enseignant.dateEmbauche}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  error={!!errors.dateEmbauche}
                  helperText={errors.dateEmbauche}
                  sx={styles.textFieldStyle(themeMode)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={enseignant.email}
                  onChange={handleChange}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={styles.textFieldStyle(themeMode)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mot de passe"
                  name="password"
                  type="password"
                  value={enseignant.password}
                  onChange={handleChange}
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={styles.textFieldStyle(themeMode)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="file"
                  name="photo"
                  onChange={handlePhotoChange}
                  InputLabelProps={{ shrink: true }}
                  sx={styles.textFieldStyle(themeMode)}
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
              ...styles.addButton,
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
          <Typography>Êtes-vous sûr de vouloir supprimer cet enseignant ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Annuler
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.id)}
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GererEnseignantPage;